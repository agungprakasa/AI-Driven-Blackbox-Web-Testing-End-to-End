#!/usr/bin/env python3
"""Generator laporan DOCX QA — Ipos5 Dev
Format: Header resmi PT Pos Indonesia, tabel landscape, screenshot evidence.

Usage:
    python scripts/generate-docx.py
"""
from __future__ import annotations

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
from docx.shared import Pt, RGBColor, Inches, Cm

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reports" / "docx"
TARGET_APP = "Ipos5 Courier Core System (https://ipos-dev.posindonesia.co.id)"


def baca(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def load_screenshot(tc_id: str) -> Path | None:
    """Load screenshot for a test case. Matches any PNG with TC-ID prefix."""
    for folder in [ROOT / "evidence" / "PASS", ROOT / "evidence" / "FAIL", ROOT / "evidence"]:
        if folder.exists():
            # Match: TC-AUTH-001_screenshot.png OR TC-AUTH-001_login_berhasil.png
            for f in folder.glob(f"{tc_id}*.png"):
                return f
    return None


def bersihkan_md(s: str) -> str:
    return re.sub(r"<br\s*/?>", " ", re.sub(r"`([^`]*)`", r"\1", s))


def set_cell_shading(cell, color_hex: str):
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color_hex)
    shading.set(qn("w:val"), "clear")
    cell._tc.get_or_add_tcPr().append(shading)


def set_cell_text(cell, text: str, bold: bool = False, size: int = 9, align=WD_ALIGN_PARAGRAPH.LEFT):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    run = p.add_run(text)
    run.font.bold = bold
    run.font.size = Pt(size)
    run.font.name = "Calibri"
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER


def parse_tests(tc_teks: str) -> list[dict]:
    tests = []
    for line in tc_teks.splitlines():
        s = line.strip()
        if s.startswith("|") and re.match(r"^\|\s*TC-[A-Z0-9]+-\d{3}\b", s):
            cols = [c.strip() for c in s.strip("|").split("|")]
            if len(cols) < 7:
                continue
            m = re.match(r"TC-([A-Z0-9]+)-", cols[0])
            tests.append({
                "id": cols[0], "judul": cols[1],
                "langkah": re.sub(r"\s*<br\s*/?>\s*", " ", cols[3]),
                "expected": re.sub(r"\s*<br\s*/?>\s*", " ", cols[4]),
                "modul": m.group(1) if m else "UNKNOWN",
                "prioritas": cols[5], "status": cols[6].upper(),
            })
    return tests


def get_category(tc_id: str) -> str:
    modul_map = {
        "AUTH": "Autentikasi & Sesi", "PROC": "Processing",
        "COLL": "Collecting", "REPO": "Reporting", "TRCK": "Tracking",
        "SETT": "Settings", "MODL": "Modules", "ACCT": "Account",
        "DASH": "Dashboard", "FILTER": "Filter & Export", "E2E": "End-to-End",
    }
    m = re.match(r"TC-([A-Z0-9]+)-", tc_id)
    if m:
        code = m.group(1)
        return modul_map.get(code, code)
    return "Lainnya"


def add_header(doc, title: str, modul: str):
    section = doc.sections[0]
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.header_distance = Cm(1.2)

    logo_path = ROOT / "config" / "logo-pos-indonesia.png"
    header = section.header
    header.is_linked_to_previous = False

    header_table = header.add_table(rows=4, cols=4, width=Inches(6.5))
    header_table.style = "Table Grid"
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    hdr_col_widths = [Cm(2.2), Cm(8.5), Cm(2.2), Cm(2.8)]
    for row in header_table.rows:
        for i, w in enumerate(hdr_col_widths):
            row.cells[i].width = w

    header_table.rows[0].cells[0].merge(header_table.rows[3].cells[0])
    header_table.rows[0].cells[1].merge(header_table.rows[1].cells[1])

    cell_logo = header_table.rows[0].cells[0]
    cell_logo.text = ""
    if logo_path.exists():
        p = cell_logo.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run()
        run.add_picture(str(logo_path), width=Cm(2.0))
    tc = cell_logo._tc
    tcPr = tc.get_or_add_tcPr()
    vAlign = OxmlElement("w:vAlign")
    vAlign.set(qn("w:val"), "center")
    tcPr.append(vAlign)

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
    tc_c = cell_company._tc
    tcPr_c = tc_c.get_or_add_tcPr()
    vAlign_c = OxmlElement("w:vAlign")
    vAlign_c.set(qn("w:val"), "center")
    tcPr_c.append(vAlign_c)

    set_cell_text(header_table.rows[0].cells[2], "Dokumen", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[0].cells[3], "Skenario", bold=False, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[1].cells[2], "Halaman", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[1].cells[3], "", size=9)
    set_cell_text(header_table.rows[2].cells[1], title, bold=True, size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[2].cells[2], "No. Revisi", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[2].cells[3], "-", size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[3].cells[1], f"Modul : {modul}", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[3].cells[2], "Tanggal", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(header_table.rows[3].cells[3], date.today().strftime("%d/%m/%Y"), size=9, align=WD_ALIGN_PARAGRAPH.CENTER)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    tc_teks = baca(ROOT / "docs" / "test-case.md")
    defect_teks = baca(ROOT / "docs" / "defect-list.md")

    tests = parse_tests(tc_teks)
    if not tests:
        print("ERROR: Tidak ada test case ditemukan")
        return 1

    total = len(tests)
    hitung = Counter(t["status"] for t in tests)
    n_pass = hitung.get("PASS", 0)
    n_fail = hitung.get("FAIL", 0)
    pass_rate = f"{n_pass / total * 100:.1f}%" if total else "-"

    doc = Document()
    add_header(doc, "PENGUJIAN WEB", "Ipos5 Courier Core System")

    # Body content
    header_data = [
        ("Tanggal\t\t:", date.today().strftime("%d/%m/%Y")),
        ("Penguji\t\t\t:", "Agung Prakasa"),
        ("Tempat\t\t\t:", "Graha Pos Indonesia, Lt. 4"),
        ("Subjek\t\t\t:", TARGET_APP),
        ("Note\t\t\t:", "AI-Driven Blackbox Web Testing — End-to-End"),
    ]
    for label, value in header_data:
        p = doc.add_paragraph()
        run = p.add_run(f"{label} {value}")
        run.font.size = Pt(11)
        run.font.name = "Calibri"

    doc.add_paragraph()

    # Keterangan
    p = doc.add_paragraph()
    run = p.add_run("Keterangan :")
    run.font.bold = True
    run.font.size = Pt(11)

    keterangan_table = doc.add_table(rows=7, cols=2)
    keterangan_table.style = "Table Grid"
    keterangan_table.alignment = WD_TABLE_ALIGNMENT.CENTER
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

    # Ringkasan Eksekutif
    p = doc.add_paragraph()
    run = p.add_run("Ringkasan Eksekutif")
    run.font.bold = True
    run.font.size = Pt(12)

    p = doc.add_paragraph()
    run = p.add_run(
        f"Pengujian black-box dilakukan terhadap {total} test case dengan pass rate {pass_rate}. "
        f"Target: {TARGET_APP}. Pengujian mencakup functional, boundary value, abnormal, "
        f"exploratory, security, dan end-to-end testing."
    )
    run.font.size = Pt(10)

    doc.add_paragraph()

    # Summary table
    summary_table = doc.add_table(rows=1, cols=2)
    summary_table.style = "Table Grid"
    summary_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_cell_text(summary_table.rows[0].cells[0], "Metrik", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(summary_table.rows[0].cells[1], "Nilai", bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_shading(summary_table.rows[0].cells[0], "4472C4")
    set_cell_shading(summary_table.rows[0].cells[1], "4472C4")
    for c in [0, 1]:
        for p in summary_table.rows[0].cells[c].paragraphs:
            for run in p.runs:
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    defect_count = len([l for l in defect_teks.splitlines()
                        if l.strip().startswith("|") and re.match(r"^\|\s*DEF-\d+", l.strip())])
    summary_data = [
        ("Total Test Case", str(total)),
        ("PASS", str(n_pass)),
        ("FAIL", str(n_fail)),
        ("Pass Rate", pass_rate),
        ("Total Defect", str(defect_count)),
    ]
    for label, value in summary_data:
        row = summary_table.add_row()
        set_cell_text(row.cells[0], label, size=9)
        set_cell_text(row.cells[1], value, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_paragraph()

    # Landscape section
    new_section = doc.add_section()
    new_section.orientation = 1
    new_section.page_width = Cm(29.7)
    new_section.page_height = Cm(21.0)
    new_section.left_margin = Cm(1.5)
    new_section.right_margin = Cm(1.5)
    new_section.top_margin = Cm(1.5)
    new_section.bottom_margin = Cm(1.5)

    # Main table
    headers = ["No.", "ID", "Butir\nUji", "Langkah\nPengujian", "Hasil\nPengujian",
               "Status\nPengujian", "Keterangan", "Evidence"]
    num_cols = len(headers)
    table = doc.add_table(rows=1, cols=num_cols)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Cm(1.0), Cm(1.8), Cm(2.5), Cm(5.5), Cm(4.0), Cm(2.0), Cm(3.5), Cm(6.0)]

    hdr_row = table.rows[0]
    for i, h in enumerate(headers):
        set_cell_text(hdr_row.cells[i], h, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
        set_cell_shading(hdr_row.cells[i], "4472C4")
        for p in hdr_row.cells[i].paragraphs:
            for run in p.runs:
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Title row
    row_title = table.add_row()
    set_cell_text(row_title.cells[0], "IPOS5 COURIER CORE SYSTEM", bold=True, size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_shading(row_title.cells[0], "D6E4F0")
    for i in range(1, num_cols):
        set_cell_shading(row_title.cells[i], "D6E4F0")
    for i in range(1, num_cols):
        row_title.cells[0].merge(row_title.cells[i])

    # Group by module
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

        row_cat = table.add_row()
        set_cell_text(row_cat.cells[0], cat_name, bold=True, size=10)
        set_cell_shading(row_cat.cells[0], "E2EFDA")
        for i in range(1, num_cols):
            set_cell_shading(row_cat.cells[i], "E2EFDA")
        for i in range(1, num_cols):
            row_cat.cells[0].merge(row_cat.cells[i])

        for t in cat_tests:
            no_counter += 1
            tc_id = t["id"]
            status = t["status"]
            ok_nok = "OK" if status == "PASS" else "NOK"
            screenshot = load_screenshot(tc_id)

            row = table.add_row()
            set_cell_text(row.cells[0], str(no_counter), size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
            set_cell_text(row.cells[1], tc_id, bold=True, size=8, align=WD_ALIGN_PARAGRAPH.CENTER)
            set_cell_text(row.cells[2], t["judul"], size=8)
            set_cell_text(row.cells[3], t["langkah"], size=8)
            set_cell_text(row.cells[4], f"Status: {status}", size=8)
            set_cell_text(row.cells[5], ok_nok, bold=True, size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
            if ok_nok == "OK":
                set_cell_shading(row.cells[5], "C6EFCE")
            else:
                set_cell_shading(row.cells[5], "FFC7CE")

            keterangan = ""
            if status == "FAIL":
                keterangan = "P: Perlu perbaikan"
            set_cell_text(row.cells[6], keterangan, size=8)

            if screenshot and screenshot.exists():
                cell_ev = row.cells[7]
                cell_ev.text = ""
                p = cell_ev.paragraphs[0]
                run = p.add_run()
                run.add_picture(str(screenshot), width=Inches(2.2))
            else:
                set_cell_text(row.cells[7], "-", size=8, align=WD_ALIGN_PARAGRAPH.CENTER)

    for row in table.rows:
        for i, w in enumerate(col_widths):
            if i < len(row.cells):
                row.cells[i].width = w

    # Back to portrait
    new_section2 = doc.add_section()
    new_section2.orientation = 0
    new_section2.page_width = Cm(21.0)
    new_section2.page_height = Cm(29.7)
    new_section2.left_margin = Cm(2.5)
    new_section2.right_margin = Cm(2.5)

    # Defect list
    doc.add_paragraph()
    doc.add_heading("Daftar Defect", level=1)
    defect_lines = [l.strip() for l in defect_teks.splitlines()
                    if l.strip().startswith("|") and re.match(r"^\|\s*DEF-\d+", l.strip())]
    if defect_lines:
        defect_table = doc.add_table(rows=1, cols=5)
        defect_table.style = "Table Grid"
        defect_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        for i, h in enumerate(["ID", "Judul", "Severity", "Status", "Keterangan"]):
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

    # Kesimpulan
    doc.add_heading("Kesimpulan & Rekomendasi", level=1)
    doc.add_paragraph(f"Dari {total} test case, {n_pass} PASS dan {n_fail} FAIL (pass rate {pass_rate}).")

    out = OUT_DIR / f"Laporan-QA-Ipos5-{date.today().isoformat()}-final.docx"
    doc.save(out)
    print(f"Laporan DOCX dibuat: {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
