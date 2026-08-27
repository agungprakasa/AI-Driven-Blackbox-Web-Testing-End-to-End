#!/usr/bin/env python3
"""Generator laporan DOCX untuk API Testing.

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
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor, Inches

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reports" / "docx"

HIJAU = RGBColor(0x00, 0x61, 0x00)
MERAH = RGBColor(0x9C, 0x00, 0x06)


def baca(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def load_evidence(tc_id: str) -> list[dict]:
    """Load evidence files for a test case."""
    evidence = []
    pass_dir = ROOT / "evidence" / "PASS"
    fail_dir = ROOT / "evidence" / "FAIL"
    
    for folder in [pass_dir, fail_dir]:
        if folder.exists():
            for f in folder.glob(f"{tc_id}*.json"):
                try:
                    data = json.loads(f.read_text(encoding="utf-8"))
                    evidence.append(data)
                except:
                    pass
    return evidence


def load_screenshot(tc_id: str) -> Path | None:
    """Load screenshot file for a test case."""
    pass_dir = ROOT / "evidence" / "PASS"
    fail_dir = ROOT / "evidence" / "FAIL"
    
    for folder in [pass_dir, fail_dir]:
        if folder.exists():
            for f in folder.glob(f"{tc_id}_screenshot.png"):
                return f
    return None


def add_evidence_section(doc: Document, evidence: list[dict], tc_id: str) -> None:
    """Add evidence section to document for a test case."""
    # Check for screenshot first
    screenshot_path = load_screenshot(tc_id)
    if screenshot_path and screenshot_path.exists():
        doc.add_heading("Bukti Testing (Screenshot):", level=3)
        doc.add_picture(str(screenshot_path), width=Inches(6))
        doc.add_paragraph()
        return
    
    # Fallback to JSON evidence
    if not evidence:
        doc.add_paragraph("Tidak ada bukti testing tersada.", style='Intense Quote')
        return
    
    # Use the most recent evidence
    ev = evidence[-1]
    
    # Request Details
    doc.add_heading("Bukti Testing:", level=3)
    
    # Create evidence table
    t = doc.add_table(rows=1, cols=2)
    t.style = "Light Grid Accent 1"
    t.rows[0].cells[0].text = "Field"
    t.rows[0].cells[1].text = "Detail"
    for p in t.rows[0].cells[0].paragraphs:
        for run in p.runs:
            run.font.bold = True
    for p in t.rows[0].cells[1].paragraphs:
        for run in p.runs:
            run.font.bold = True
    
    rows_data = [
        ("Test ID", ev.get("testId", "N/A")),
        ("Endpoint", ev.get("endpoint", "N/A")),
        ("Method", ev.get("method", "N/A")),
        ("Timestamp", ev.get("timestamp", "N/A")),
        ("Duration", f"{ev.get('duration', 0)}ms"),
        ("Response Status", str(ev.get("responseStatus", "N/A"))),
    ]
    
    for label, value in rows_data:
        row = t.add_row()
        row.cells[0].text = label
        row.cells[1].text = value
    
    doc.add_paragraph()
    
    # Request Body
    req_body = ev.get("requestBody")
    if req_body:
        p = doc.add_paragraph()
        run = p.add_run("Request Body:")
        run.font.bold = True
        p = doc.add_paragraph()
        run = p.add_run(json.dumps(req_body, indent=2, ensure_ascii=False))
        run.font.size = Pt(9)
        run.font.name = "Courier New"
    
    # Response Body
    res_body = ev.get("responseBody")
    if res_body:
        p = doc.add_paragraph()
        run = p.add_run("Response Body:")
        run.font.bold = True
        p = doc.add_paragraph()
        res_str = json.dumps(res_body, indent=2, ensure_ascii=False)
        if len(res_str) > 500:
            res_str = res_str[:500] + "..."
        run = p.add_run(res_str)
        run.font.size = Pt(9)
        run.font.name = "Courier New"


def baris_tabel(teks: str, awal_id: str) -> list[list[str]]:
    rows = []
    for line in teks.splitlines():
        s = line.strip()
        if s.startswith("|") and re.match(rf"^\|\s*{awal_id}\b", s):
            rows.append([c.strip() for c in s.strip("|").split("|")])
    return rows


def bersihkan_md(s: str) -> str:
    return re.sub(r"<br\s*/?>", " ", re.sub(r"`([^`]*)`", r"\1", s))


def tambah_tabel(doc: Document, headers: list[str], data: list[list[str]], widths=None) -> None:
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Light Grid Accent 1"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        cell = t.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            for run in p.runs:
                run.font.bold = True
    for row in data:
        cells = t.add_row().cells
        for i, val in enumerate(row[:len(headers)]):
            cells[i].text = bersihkan_md(val)
    if widths:
        for i, w in enumerate(widths):
            for row in t.rows:
                row.cells[i].width = w
    doc.add_paragraph()


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    tc_teks = baca(ROOT / "docs" / "test-case.md")
    defect_rows = baris_tabel(baca(ROOT / "docs" / "defect-list.md"), r"DEF-\d+")

    tests = []
    for sel in baris_tabel(tc_teks, r"TC-[A-Z0-9]+-?\d{3}"):
        if len(sel) < 7:
            continue
        m = re.match(r"TC-([A-Z0-9]+)-?", sel[0])
        tests.append({
            "id": sel[0], "judul": sel[1],
            "langkah": re.sub(r"\s*<br\s*/?>\s*", " ", sel[3]),
            "expected": re.sub(r"\s*<br\s*/?>\s*", " ", sel[4]),
            "modul": m.group(1) if m else "UNKNOWN",
            "prioritas": sel[5], "status": sel[6].upper(),
        })

    hitung = Counter(t["status"] for t in tests)
    total = len(tests)
    n_pass, n_fail = hitung.get("PASS", 0), hitung.get("FAIL", 0)
    dieksekusi = total - hitung.get("NOT VERIFIED", 0) - hitung.get("BLOCKED", 0)
    pass_rate = f"{n_pass / dieksekusi * 100:.1f}%" if dieksekusi else "-"

    doc = Document()

    # Halaman judul
    judul = doc.add_heading("Laporan Pengujian API", level=0)
    judul.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub = doc.add_paragraph("AI-Driven Blackbox API Testing — End-to-End")
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.runs[0].italic = True
    info = doc.add_paragraph()
    info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = info.add_run(f"Tanggal: {date.today().isoformat()}\nEnvironment: API Testing")
    r.font.size = Pt(11)

    # 1. Ringkasan Eksekutif
    doc.add_heading("1. Ringkasan Eksekutif", level=1)
    p = doc.add_paragraph()
    p.add_run(f"Pengujian API dilakukan terhadap {total} test case dengan pass rate {pass_rate}.")
    tambah_tabel(doc,
                 ["Metrik", "Nilai"],
                 [["Total Test Case", str(total)],
                  ["PASS", str(n_pass)],
                  ["FAIL", str(n_fail)],
                  ["Pass Rate", pass_rate],
                  ["Total Defect", str(len(defect_rows))]],
                 widths=[Pt(220), Pt(180)])

    # 2. Hasil Pengujian - Summary Table
    doc.add_heading("2. Hasil Pengujian", level=1)
    data = [[t["id"], bersihkan_md(t["judul"])[:60], t["langkah"][:80], t["expected"][:80], t["prioritas"], t["status"]] for t in tests]
    tambah_tabel(doc, ["ID", "Judul", "Request", "Expected", "Priority", "Status"], data)

    # 3. Detail Pengujian dengan Evidence
    doc.add_heading("3. Detail Pengujian & Bukti", level=1)
    for t in tests:
        tc_id = t["id"]
        tc_status = t["status"]
        
        # Heading untuk setiap test case
        status_icon = "✓" if tc_status == "PASS" else "✗"
        doc.add_heading(f"{status_icon} {tc_id} — {bersihkan_md(t['judul'])}", level=2)
        
        # Info dasar
        p = doc.add_paragraph()
        p.add_run(f"Status: {tc_status} | Priority: {t['prioritas']}")
        
        # Request details
        p = doc.add_paragraph()
        run = p.add_run("Request:")
        run.font.bold = True
        doc.add_paragraph(f"Endpoint: POST /getfeeLnDiscountNew")
        doc.add_paragraph(f"Input: {t['langkah'][:200]}")
        
        # Expected result
        p = doc.add_paragraph()
        run = p.add_run("Expected:")
        run.font.bold = True
        doc.add_paragraph(t['expected'])
        
        # Evidence section
        evidence = load_evidence(tc_id)
        add_evidence_section(doc, evidence, tc_id)
        
        # Separator
        doc.add_paragraph("─" * 50)

    # 4. Defect
    doc.add_heading("3. Daftar Defect", level=1)
    if defect_rows:
        for sel in defect_rows:
            did = sel[0] if len(sel) > 0 else ""
            djudul = sel[1] if len(sel) > 1 else ""
            doc.add_heading(f"{did} — {bersihkan_md(djudul)}", level=3)
    else:
        doc.add_paragraph("Tidak ada defect terdokumentasi.")

    # 5. Kesimpulan
    doc.add_heading("5. Kesimpulan & Rekomendasi", level=1)
    doc.add_paragraph(f"Dari {total} test case, {n_pass} PASS dan {n_fail} FAIL (pass rate {pass_rate}).")
    
    # Defect summary
    if defect_rows:
        p = doc.add_paragraph()
        run = p.add_run(f"Total Defect Ditemukan: {len(defect_rows)}")
        run.font.bold = True
        
        # Critical defects
        critical = [d for d in defect_rows if len(d) > 2 and 'Critical' in d[2]]
        high = [d for d in defect_rows if len(d) > 2 and 'High' in d[2]]
        
        doc.add_paragraph(f"- Critical: {len(critical)}")
        doc.add_paragraph(f"- High: {len(high)}")
        doc.add_paragraph(f"- Medium/Low: {len(defect_rows) - len(critical) - len(high)}")

    out = OUT_DIR / f"Laporan-API-Testing-{date.today().isoformat()}-v2.docx"
    doc.save(out)
    print(f"Laporan DOCX dibuat: {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
