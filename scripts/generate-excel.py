#!/usr/bin/env python3
"""Generator laporan Excel untuk API Testing.

Usage:
    python scripts/generate-excel.py
"""
from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reports" / "excel"

THIN = Side(style="thin", color="CCCCCC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
HEADER_FILL = PatternFill("solid", fgColor="1F4E78")
HEADER_FONT = Font(bold=True, color="FFFFFF")
STATUS_FILL = {
    "PASS": PatternFill("solid", fgColor="C6EFCE"),
    "FAIL": PatternFill("solid", fgColor="FFC7CE"),
}
STATUS_FONT = {
    "PASS": Font(color="006100", bold=True),
    "FAIL": Font(color="9C0006", bold=True),
}


def baca_baris_tabel(path: Path, awal_id: str) -> list[list[str]]:
    if not path.exists():
        return []
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s.startswith("|") and re.match(rf"^\|\s*{awal_id}\b", s):
            sel = [c.strip() for c in s.strip("|").split("|")]
            rows.append(sel)
    return rows


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    tc_rows = baca_baris_tabel(ROOT / "docs" / "test-case.md", r"TC-[A-Z0-9]+-\d{3}")
    defect_rows = baca_baris_tabel(ROOT / "docs" / "defect-list.md", r"DEF-\d+")

    tests = []
    for sel in tc_rows:
        if len(sel) < 7:
            continue
        tc_id, judul, _pre, langkah, expected, prioritas, status = sel[:7]
        modul = re.match(r"TC-([A-Z0-9]+)-", tc_id)
        tests.append({
            "id": tc_id,
            "judul": re.sub(r"<br\s*/?>", " ", judul),
            "langkah": re.sub(r"\s*<br\s*/?>\s*", " ", langkah),
            "expected": re.sub(r"\s*<br\s*/?>\s*", " ", expected),
            "modul": modul.group(1) if modul else "-",
            "prioritas": prioritas,
            "status": status.upper(),
        })

    total = len(tests)
    n_pass = sum(1 for t in tests if t["status"] == "PASS")
    n_fail = sum(1 for t in tests if t["status"] == "FAIL")

    wb = Workbook()

    # Sheet 1: Ringkasan
    ws = wb.active
    ws.title = "Ringkasan"
    ringkasan = [
        ("LAPORAN PENGUJIAN API", ""),
        ("Tanggal Laporan", date.today().isoformat()),
        ("", ""),
        ("Total Test Case", total),
        ("PASS", n_pass),
        ("FAIL", n_fail),
        ("Pass Rate", f"{(n_pass / total * 100):.1f}%" if total else "-"),
        ("", ""),
        ("Total Defect", len(defect_rows)),
    ]
    for r, (label, nilai) in enumerate(ringkasan, start=1):
        a = ws.cell(row=r, column=1, value=label)
        b = ws.cell(row=r, column=2, value=nilai)
        a.border = BORDER
        b.border = BORDER
        if r == 1:
            a.font = Font(bold=True, size=13)
        elif label:
            a.font = Font(bold=True)
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 50

    # Sheet 2: Hasil Test
    ws2 = wb.create_sheet("Hasil Test")
    headers = ["Test Case ID", "Judul", "Request", "Expected", "Modul", "Priority", "Status"]
    for c, h in enumerate(headers, start=1):
        ws2.cell(row=1, column=c, value=h)
    for r, t in enumerate(tests, start=2):
        ws2.cell(row=r, column=1, value=t["id"])
        ws2.cell(row=r, column=2, value=t["judul"])
        ws2.cell(row=r, column=3, value=t["langkah"])
        ws2.cell(row=r, column=4, value=t["expected"])
        ws2.cell(row=r, column=5, value=t["modul"])
        ws2.cell(row=r, column=6, value=t["prioritas"])
        sc = ws2.cell(row=r, column=7, value=t["status"])
        sc.fill = STATUS_FILL.get(t["status"], PatternFill())
        sc.font = STATUS_FONT.get(t["status"], Font())
        sc.alignment = Alignment(horizontal="center")
        for c in range(1, 8):
            ws2.cell(row=r, column=c).border = BORDER
    ws2.freeze_panes = "A2"

    out = OUT_DIR / f"Laporan-API-Testing-{date.today().isoformat()}.xlsx"
    wb.save(out)
    print(f"Laporan Excel dibuat: {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
