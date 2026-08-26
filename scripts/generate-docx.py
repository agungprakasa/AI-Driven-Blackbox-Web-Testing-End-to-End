#!/usr/bin/env python3
"""Generator laporan DOCX untuk API Testing.

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
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reports" / "docx"

HIJAU = RGBColor(0x00, 0x61, 0x00)
MERAH = RGBColor(0x9C, 0x00, 0x06)


def baca(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


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
    for sel in baris_tabel(tc_teks, r"TC-[A-Z0-9]+-\d{3}"):
        if len(sel) < 7:
            continue
        tests.append({
            "id": sel[0], "judul": sel[1],
            "langkah": re.sub(r"\s*<br\s*/?>\s*", " ", sel[3]),
            "expected": re.sub(r"\s*<br\s*/?>\s*", " ", sel[4]),
            "modul": re.match(r"TC-([A-Z0-9]+)-", sel[0]).group(1),
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

    # 2. Hasil Pengujian
    doc.add_heading("2. Hasil Pengujian", level=1)
    data = [[t["id"], bersihkan_md(t["judul"])[:60], t["langkah"][:80], t["expected"][:80], t["prioritas"], t["status"]] for t in tests]
    tambah_tabel(doc, ["ID", "Judul", "Request", "Expected", "Priority", "Status"], data)

    # 3. Defect
    doc.add_heading("3. Daftar Defect", level=1)
    if defect_rows:
        for sel in defect_rows:
            did = sel[0] if len(sel) > 0 else ""
            djudul = sel[1] if len(sel) > 1 else ""
            doc.add_heading(f"{did} — {bersihkan_md(djudul)}", level=3)
    else:
        doc.add_paragraph("Tidak ada defect terdokumentasi.")

    # 4. Kesimpulan
    doc.add_heading("4. Kesimpulan & Rekomendasi", level=1)
    doc.add_paragraph(f"Dari {total} test case, {n_pass} PASS dan {n_fail} FAIL (pass rate {pass_rate}).")

    out = OUT_DIR / f"Laporan-API-Testing-{date.today().isoformat()}.docx"
    doc.save(out)
    print(f"Laporan DOCX dibuat: {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
