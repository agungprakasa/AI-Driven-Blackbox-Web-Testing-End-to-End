#!/usr/bin/env python3
"""Generator laporan DOCX untuk API Testing — format sesuai TS QRIS.docx.

Usage:
    python scripts/generate-docx.py
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.shared import Pt, RGBColor, Inches, Cm, Emu

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reports" / "docx"

HIJAU = RGBColor(0x00, 0x61, 0x00)
MERAH = RGBColor(0x9C, 0x00, 0x06)


def baca(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def load_evidence(tc_id: str) -> list[dict]:
    """Load evidence JSON files for a test case."""
    evidence = []
    for folder in [ROOT / "evidence" / "PASS", ROOT / "evidence" / "FAIL"]:
        if folder.exists():
            for f in folder.glob(f"{tc_id}*.json"):
                try:
                    evidence.append(json.loads(f.read_text(encoding="utf-8")))
                except Exception:
                    pass
    return evidence


def load_screenshot(tc_id: str) -> Path | None:
    """Load screenshot PNG for a test case."""
    for folder in [ROOT / "evidence" / "PASS", ROOT / "evidence" / "FAIL"]:
        if folder.exists():
            for f in folder.glob(f"{tc_id}_screenshot.png"):
                return f
    return None


def bersihkan_md(s: str) -> str:
    return re.sub(r"<br\s*/?>", " ", re.sub(r"`([^`]*)`", r"\1", s))


def set_cell_shading(cell, color_hex: str):
    """Set background color for a table cell."""
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color_hex)
    shading.set(qn("w:val"), "clear")
    cell._tc.get_or_add_tcPr().append(shading)


def set_cell_merging(cell, grid_span: int):
    """Merge cell horizontally."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcGridSpan = OxmlElement("w:gridSpan")
    tcGridSpan.set(qn("w:val"), str(grid_span))
    tcPr.append(tcGridSpan)


def set_cell_text(cell, text: str, bold: bool = False, size: int = 9, align=WD_ALIGN_PARAGRAPH.LEFT):
    """Set cell text with formatting."""
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    run = p.add_run(text)
    run.font.bold = bold
    run.font.size = Pt(size)
    run.font.name = "Calibri"
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER


def parse_test_cases(tc_teks: str) -> list[dict]:
    """Parse test-case.md into structured data."""
    tests = []
    for line in tc_teks.splitlines():
        s = line.strip()
        if s.startswith("|") and re.match(r"^\|\s*TC-[A-Z0-9]+-?\d{3}\b", s):
            cols = [c.strip() for c in s.strip("|").split("|")]
            if len(cols) < 7:
                continue
            m = re.match(r"TC-([A-Z0-9]+)-?", cols[0])
            tests.append({
                "id": cols[0],
                "judul": cols[1],
                "endpoint": cols[2],
                "request": cols[3],
                "expected": cols[4],
                "priority": cols[5],
                "status": cols[6].upper(),
                "modul": m.group(1) if m else "UNKNOWN",
            })
    return tests


def get_category(tc_id: str) -> str:
    """Determine test category from ID prefix."""
    prefix_map = {
        "P": "Normal Case",
        "N": "Abnormal Case",
        "B": "Boundary Value",
        "S": "Security",
        "PF": "Performance",
        "DV": "Data Validation",
        "E2E": "Integration / E2E",
    }
    for prefix, cat in prefix_map.items():
        if re.match(rf"^TC-{prefix}\d", tc_id):
            return cat
    return "Lainnya"


def get_evidence_text(tc_id: str) -> str:
    """Get short evidence text for Keterangan column."""
    ev = load_evidence(tc_id)
    if ev:
        latest = ev[-1]
        status = latest.get("responseStatus", "?")
        duration = latest.get("duration", 0)
        return f"Status: {status}, Duration: {duration}ms"
    return ""


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    tc_teks = baca(ROOT / "docs" / "test-case.md")
    defect_teks = baca(ROOT / "docs" / "defect-list.md")

    tests = parse_test_cases(tc_teks)
    if not tests:
        print("ERROR: Tidak ada test case ditemukan di docs/test-case.md")
        return 1

    # Count stats
    hitung = Counter(t["status"] for t in tests)
    total = len(tests)
    n_pass = hitung.get("PASS", 0)
    n_fail = hitung.get("FAIL", 0)
    pass_rate = f"{n_pass / total * 100:.1f}%" if total else "-"

    doc = Document()

    # Set page margins (same as reference)
    section = doc.sections[0]
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.header_distance = Cm(1.2)

    # =========================================================
    # OFFICIAL COMPANY HEADER (sesuai TS QRIS.docx)
    # =========================================================
    logo_path = ROOT / "config" / "logo-pos-indonesia.png"
    header = section.header
    header.is_linked_to_previous = False

    # Header table: 4 cols x 4 rows, then merge col 0 vertically
    header_table = header.add_table(rows=4, cols=4, width=Inches(6.5))
    header_table.style = "Table Grid"
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Set column widths
    hdr_col_widths = [Cm(2.2), Cm(8.5), Cm(2.2), Cm(2.8)]
    for row in header_table.rows:
        for i, w in enumerate(hdr_col_widths):
            row.cells[i].width = w

    # Merge col 0 vertically (row 0..3) — Logo spans all 4 rows
    header_table.rows[0].cells[0].merge(header_table.rows[3].cells[0])

    # Merge col 1 row 0..1 — Company name spans 2 rows
    header_table.rows[0].cells[1].merge(header_table.rows[1].cells[1])

    # Now put logo in the merged cell
    cell_logo = header_table.rows[0].cells[0]
    cell_logo.text = ""
    if logo_path.exists():
        p = cell_logo.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run()
        run.add_picture(str(logo_path), width=Cm(2.0))
    # Vertical align center
    tc = cell_logo._tc
    tcPr = tc.get_or_add_tcPr()
    vAlign = OxmlElement("w:vAlign")
    vAlign.set(qn("w:val"), "center")
    tcPr.append(vAlign)

    # Row 0-1 Col 1 (merged): Company Name — appears once
    cell_company = header_table.rows[0].cells[1]
    cell_company.text = ""
    p = cell_company.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("PT POS INDONESIA (PERSERO)")
    run.font.bold = True
    run.font.size = Pt(9)
    run.font.name = "Calibri"
    p2 = cell_company.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run2 = p2.add_run("BAG. QUALITY ASSURANCE DEVSECOPS PLATFORM")
    run2.font.bold = True
    run2.font.size = Pt(9)
    run2.font.name = "Calibri"
    # Vertical align center
    tc_c = cell_company._tc
    tcPr_c = tc_c.get_or_add_tcPr()
    vAlign_c = OxmlElement("w:vAlign")
    vAlign_c.set(qn("w:val"), "center")
    tcPr_c.append(vAlign_c)

    # Row 0 Col 2-3: Dokumen | Skenario
    set_cell_text(header_table.rows[0].cells[2], "Dokumen", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[0].cells[3], "Skenario", bold=False, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 1 Col 2-3: Halaman | (empty)
    set_cell_text(header_table.rows[1].cells[2], "Halaman", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[1].cells[3], "", size=9)

    # Row 2: Title | No. Revisi | -
    set_cell_text(header_table.rows[2].cells[1], "PENGUJIAN API TARIFF", bold=True, size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[2].cells[2], "No. Revisi", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[2].cells[3], "-", size=9, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 3: Modul | Tanggal | Date
    set_cell_text(header_table.rows[3].cells[1], "Modul : Tariff (getfeeLnDiscountNew)", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[3].cells[2], "Tanggal", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[3].cells[3], date.today().strftime("%d/%m/%Y"), size=9, align=WD_ALIGN_PARAGRAPH.CENTER)

    # =========================================================
    # BODY CONTENT
    # =========================================================
    # Metadata header
    header_data = [
        ("Tanggal\t\t:", date.today().strftime("%d/%m/%Y")),
        ("Penguji\t\t\t:", "Agung Prakasa"),
        ("Tempat\t\t\t:", "Graha Pos Indonesia, Lt. 4"),
        ("Subjek\t\t\t:", "API Tariff — getfeeLnDiscountNew"),
        ("Note\t\t\t:", "AI-Driven Blackbox API Testing — End-to-End"),
    ]
    for label, value in header_data:
        p = doc.add_paragraph()
        run = p.add_run(f"{label} {value}")
        run.font.size = Pt(11)
        run.font.name = "Calibri"

    # Spacer
    doc.add_paragraph()

    # Kredensial
    p = doc.add_paragraph()
    run = p.add_run("Data Akses Kredensial Pengujian:")
    run.font.bold = True
    run.font.size = Pt(11)

    cred_lines = [
        "A. Base URL",
        "1. URL : http://10.29.41.37:8280/test/1.0.0",
        "2. Endpoint : POST /getfeeLnDiscountNew",
        "B. Authentication : None (tanpa autentikasi)",
    ]
    for line in cred_lines:
        p = doc.add_paragraph()
        run = p.add_run(line)
        run.font.size = Pt(10)
        run.font.name = "Calibri"

    doc.add_paragraph()

    # Keterangan (legend) — simple table
    p = doc.add_paragraph()
    run = p.add_run("Keterangan :")
    run.font.bold = True
    run.font.size = Pt(11)
    run.font.name = "Calibri"

    keterangan_table = doc.add_table(rows=7, cols=2)
    keterangan_table.style = "Table Grid"
    keterangan_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Set widths
    for row in keterangan_table.rows:
        row.cells[0].width = Cm(4.5)
        row.cells[1].width = Cm(9.5)

    keterangan_data = [
        ("Status Pengujian", ""),
        ("OK", "Jika hasil pengujian diterima"),
        ("NOK", "Jika hasil pengujian tidak diterima"),
        ("Keterangan", ""),
        ("P", "Perbaikan"),
        ("T", "Tambahan / Usulan"),
        ("Status Perbaikan", "OK = Diterima, NOK = Tidak diterima"),
    ]
    for ri, (label, desc) in enumerate(keterangan_data):
        is_header = desc == ""
        set_cell_text(keterangan_table.rows[ri].cells[0], label, bold=is_header, size=9)
        set_cell_text(keterangan_table.rows[ri].cells[1], desc, size=9)
        if is_header:
            set_cell_shading(keterangan_table.rows[ri].cells[0], "D6E4F0")
            set_cell_shading(keterangan_table.rows[ri].cells[1], "D6E4F0")

    doc.add_paragraph()

    # =========================================================
    # RINGKASAN EKSEKUTIF
    # =========================================================
    p = doc.add_paragraph()
    run = p.add_run("Ringkasan Eksekutif")
    run.font.bold = True
    run.font.size = Pt(12)
    run.font.name = "Calibri"

    p = doc.add_paragraph()
    run = p.add_run(f"Pengujian API dilakukan terhadap {total} test case dengan pass rate {pass_rate}. Endpoint yang diuji adalah POST /getfeeLnDiscountNew pada base URL http://10.29.41.37:8280/test/1.0.0. Pengujian mencakup normal case, abnormal case, boundary value, security, performance, data validation, dan integrasi end-to-end.")
    run.font.size = Pt(10)
    run.font.name = "Calibri"

    doc.add_paragraph()

    # Summary table
    summary_table = doc.add_table(rows=1, cols=2)
    summary_table.style = "Table Grid"
    summary_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for row in summary_table.rows:
        row.cells[0].width = Cm(6.0)
        row.cells[1].width = Cm(4.0)

    set_cell_text(summary_table.rows[0].cells[0], "Metrik", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(summary_table.rows[0].cells[1], "Nilai", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_shading(summary_table.rows[0].cells[0], "4472C4")
    set_cell_shading(summary_table.rows[0].cells[1], "4472C4")
    for p in summary_table.rows[0].cells[0].paragraphs:
        for run in p.runs:
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    for p in summary_table.rows[0].cells[1].paragraphs:
        for run in p.runs:
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    summary_data = [
        ("Total Test Case", str(total)),
        ("PASS", str(n_pass)),
        ("FAIL", str(n_fail)),
        ("Pass Rate", pass_rate),
        ("Jenis Pengujian", "7 kategori"),
        ("Total Defect", str(len([l for l in defect_teks.splitlines() if l.strip().startswith("|") and re.match(r"^\|\s*DEF-\d+", l.strip())]))),
    ]
    for label, value in summary_data:
        row = summary_table.add_row()
        set_cell_text(row.cells[0], label, size=9)
        set_cell_text(row.cells[1], value, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_paragraph()

    # =========================================================
    # LANDSCAPE SECTION FOR MAIN TABLE
    # =========================================================
    # Add new section with landscape orientation
    new_section = doc.add_section()
    new_section.orientation = 1  # WD_ORIENT.LANDSCAPE
    new_section.page_width = Cm(29.7)   # A4 landscape width
    new_section.page_height = Cm(21.0)  # A4 landscape height
    new_section.left_margin = Cm(1.5)
    new_section.right_margin = Cm(1.5)
    new_section.top_margin = Cm(1.5)
    new_section.bottom_margin = Cm(1.5)

    # =========================================================
    # MAIN TABLE — Landscape
    # =========================================================
    # Columns: No | ID | Butir Uji | Uraian Kegiatan | Hasil Pengujian | Status (dropdown) | Keterangan | Evidence
    headers = [
        "No.", "ID", "Butir\nUji", "Uraian\nKegiatan",
        "Hasil\nPengujian", "Status\nPengujian",
        "Keterangan", "Evidence"
    ]
    num_cols = len(headers)

    table = doc.add_table(rows=1, cols=num_cols)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Column widths for landscape (total ~26.7cm usable)
    col_widths = [Cm(1.0), Cm(1.8), Cm(2.5), Cm(5.5), Cm(4.0), Cm(2.0), Cm(3.5), Cm(6.0)]

    # Header row
    hdr_row = table.rows[0]
    for i, h in enumerate(headers):
        set_cell_text(hdr_row.cells[i], h, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
        set_cell_shading(hdr_row.cells[i], "4472C4")
        for p in hdr_row.cells[i].paragraphs:
            for run in p.runs:
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Row 1: API Name (merged across all columns)
    row_api = table.add_row()
    set_cell_text(row_api.cells[0], "API TARIFF — getfeeLnDiscountNew", bold=True, size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_shading(row_api.cells[0], "D6E4F0")
    for i in range(1, num_cols):
        set_cell_shading(row_api.cells[i], "D6E4F0")
    for i in range(1, num_cols):
        row_api.cells[0].merge(row_api.cells[i])

    # Group tests by category
    categories = []
    current_cat = None
    for t in tests:
        cat = get_category(t["id"])
        if cat != current_cat:
            categories.append({"name": cat, "tests": []})
            current_cat = cat
        categories[-1]["tests"].append(t)

    no_counter = 0
    for cat_info in categories:
        cat_name = cat_info["name"]
        cat_tests = cat_info["tests"]

        # Category header row (merged)
        row_cat = table.add_row()
        set_cell_text(row_cat.cells[0], cat_name, bold=True, size=10, align=WD_ALIGN_PARAGRAPH.LEFT)
        set_cell_shading(row_cat.cells[0], "E2EFDA")
        for i in range(1, num_cols):
            set_cell_shading(row_cat.cells[i], "E2EFDA")
        for i in range(1, num_cols):
            row_cat.cells[0].merge(row_cat.cells[i])

        # Test case rows
        for t in cat_tests:
            no_counter += 1
            tc_id = t["id"]
            status = t["status"]
            ok_nok = "OK" if status == "PASS" else "NOK"

            # Get evidence info
            evidence_info = get_evidence_text(tc_id)

            # Get screenshot path
            screenshot = load_screenshot(tc_id)

            # Build row
            row = table.add_row()

            # No.
            set_cell_text(row.cells[0], str(no_counter), size=9, align=WD_ALIGN_PARAGRAPH.CENTER)

            # ID
            set_cell_text(row.cells[1], tc_id, bold=True, size=8, align=WD_ALIGN_PARAGRAPH.CENTER)

            # Butir Uji (Test Item name)
            set_cell_text(row.cells[2], t["judul"], size=8)

            # Uraian Kegiatan (Activity Description)
            deskripsi = f"Request: {t['request']}\nExpected: {t['expected']}"
            set_cell_text(row.cells[3], deskripsi, size=8)

            # Hasil Pengujian (Test Result — text)
            hasil = f"Status: {status}\n{evidence_info}" if evidence_info else f"Status: {status}"
            set_cell_text(row.cells[4], hasil, size=8)

            # Status Pengujian (OK / NOK)
            set_cell_text(row.cells[5], ok_nok, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
            if ok_nok == "OK":
                set_cell_shading(row.cells[5], "C6EFCE")
            else:
                set_cell_shading(row.cells[5], "FFC7CE")

            # Keterangan
            keterangan = ""
            if status == "FAIL":
                if "S" in tc_id[:4]:
                    keterangan = "P: Perlu input validation"
                elif "N" in tc_id[:4]:
                    keterangan = "P: Perlu validasi input"
                elif "B" in tc_id[:4]:
                    keterangan = "P: Perlu boundary check"
                else:
                    keterangan = "P: Perlu perbaikan"
            set_cell_text(row.cells[6], keterangan, size=8)

            # Evidence (screenshot)
            if screenshot and screenshot.exists():
                cell_ev = row.cells[7]
                cell_ev.text = ""
                p = cell_ev.paragraphs[0]
                run = p.add_run()
                run.add_picture(str(screenshot), width=Inches(2.2))
            else:
                set_cell_text(row.cells[7], "-", size=8, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Set column widths for all rows
    for row in table.rows:
        for i, w in enumerate(col_widths):
            row.cells[i].width = w

    # =========================================================
    # BACK TO PORTRAIT FOR REMAINING CONTENT
    # =========================================================
    new_section2 = doc.add_section()
    new_section2.orientation = 0  # WD_ORIENT.PORTRAIT
    new_section2.page_width = Cm(21.0)
    new_section2.page_height = Cm(29.7)
    new_section2.left_margin = Cm(2.5)
    new_section2.right_margin = Cm(2.5)
    new_section2.top_margin = Cm(2.5)
    new_section2.bottom_margin = Cm(2.5)

    # =========================================================
    # DAFTAR DEFECT (after table)
    # =========================================================
    doc.add_paragraph()
    doc.add_heading("Daftar Defect", level=1)

    defect_lines = [l.strip() for l in defect_teks.splitlines() if l.strip().startswith("|") and re.match(r"^\|\s*DEF-\d+", l.strip())]
    if defect_lines:
        defect_table = doc.add_table(rows=1, cols=5)
        defect_table.style = "Table Grid"
        defect_table.alignment = WD_TABLE_ALIGNMENT.CENTER

        # Defect header
        d_headers = ["ID", "Judul", "Severity", "Status", "Keterangan"]
        for i, h in enumerate(d_headers):
            set_cell_text(defect_table.rows[0].cells[i], h, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
            set_cell_shading(defect_table.rows[0].cells[i], "4472C4")
            for p in defect_table.rows[0].cells[i].paragraphs:
                for run in p.runs:
                    run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

        for line in defect_lines:
            cols = [c.strip() for c in line.strip("|").split("|")]
            if len(cols) >= 4:
                row = defect_table.add_row()
                for i in range(min(5, len(cols))):
                    set_cell_text(row.cells[i], cols[i], size=8)
    else:
        doc.add_paragraph("Tidak ada defect terdokumentasi.")

    # =========================================================
    # KESIMPULAN & REKOMENDASI
    # =========================================================
    doc.add_heading("Kesimpulan & Rekomendasi", level=1)
    doc.add_paragraph(
        f"Dari {total} test case yang dieksekusi, {n_pass} PASS dan {n_fail} FAIL "
        f"dengan pass rate {pass_rate}."
    )

    p = doc.add_paragraph()
    run = p.add_run("Rekomendasi:")
    run.font.bold = True

    if n_fail > 0:
        doc.add_paragraph(
            "1. Perbaiki validasi input pada endpoint — beberapa input invalid (weight negatif, "
            "body kosong) masih diterima dengan status 200.",
            style="List Number"
        )
        doc.add_paragraph(
            "2. Perkuat proteksi keamanan — SQL Injection, XSS, dan Path Traversal menyebabkan "
            "HTTP 500 (server crash), perlu input sanitization.",
            style="List Number"
        )
        doc.add_paragraph(
            "3. Tambahkan validasi Content-Type dan request method — API menerima GET/PUT dan "
            "berbagai Content-Type tanpa penolakan.",
            style="List Number"
        )
    else:
        doc.add_paragraph("Semua test case PASS. Tidak ada rekomendasi perbaikan saat ini.")

    # =========================================================
    # SAVE
    # =========================================================
    out = OUT_DIR / f"Laporan-API-Testing-{date.today().isoformat()}-final.docx"
    doc.save(out)
    print(f"Laporan DOCX dibuat: {out.relative_to(ROOT)}")
    print(f"Total: {total} test cases | PASS: {n_pass} | FAIL: {n_fail} | Rate: {pass_rate}")

    # Count screenshots
    ss_count = 0
    for folder in [ROOT / "evidence" / "PASS", ROOT / "evidence" / "FAIL"]:
        if folder.exists():
            ss_count += len(list(folder.glob("*_screenshot.png")))
    print(f"Screenshots terlampir: {ss_count}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
