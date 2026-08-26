#!/usr/bin/env python3
"""Generator laporan Excel QA — membaca docs/test-case.md & docs/defect-list.md,
menghasilkan laporan .xlsx di reports/excel/.

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

TARGET_APP = "SauceDemo (https://www.saucedemo.com)"

THIN = Side(style="thin", color="CCCCCC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
HEADER_FILL = PatternFill("solid", fgColor="1F4E78")
HEADER_FONT = Font(bold=True, color="FFFFFF")
STATUS_FILL = {
    "PASS": PatternFill("solid", fgColor="C6EFCE"),
    "FAIL": PatternFill("solid", fgColor="FFC7CE"),
    "NOT VERIFIED": PatternFill("solid", fgColor="D9D9D9"),
    "BLOCKED": PatternFill("solid", fgColor="FFE699"),
}
STATUS_FONT = {
    "PASS": Font(color="006100", bold=True),
    "FAIL": Font(color="9C0006", bold=True),
}


def baca_baris_tabel(path: Path, awal_id: str) -> list[list[str]]:
    """Ambil baris tabel markdown yang sel pertamanya diawali awal_id."""
    if not path.exists():
        return []
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s.startswith("|") and re.match(rf"^\|\s*{awal_id}\b", s):
            sel = [c.strip() for c in s.strip("|").split("|")]
            rows.append(sel)
    return rows


def cari_bukti(tc_id: str) -> str:
    for folder in ("PASS", "FAIL"):
        d = ROOT / "evidence" / folder
        if d.exists():
            for f in sorted(d.glob(f"{tc_id}_*")):
                return f"evidence/{folder}/{f.name}"
    # TC-E2E-003 (regresi): artefak laporan Playwright
    if tc_id == "TC-E2E-003" and (ROOT / "reports" / "playwright" / "results.json").exists():
        return "reports/playwright/results.json (+ html)"
    return "-"


def style_header(ws, kolom: int) -> None:
    for c in range(1, kolom + 1):
        cell = ws.cell(row=1, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.border = BORDER
        cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.freeze_panes = "A2"


def auto_width(ws, widths: dict[int, int]) -> None:
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = w


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # --- Parse data ---
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
            "bukti": cari_bukti(tc_id),
        })

    total = len(tests)
    n_pass = sum(1 for t in tests if t["status"] == "PASS")
    n_fail = sum(1 for t in tests if t["status"] == "FAIL")
    n_nv = sum(1 for t in tests if t["status"] == "NOT VERIFIED")
    n_blocked = sum(1 for t in tests if t["status"] == "BLOCKED")
    dieksekusi = total - n_nv - n_blocked
    pass_rate = f"{(n_pass / dieksekusi * 100):.1f}%" if dieksekusi else "-"

    wb = Workbook()

    # --- Sheet 1: Ringkasan ---
    ws = wb.active
    ws.title = "Ringkasan"
    ringkasan = [
        ("LAPORAN PENGUJIAN QA — AI-DRIVEN BLACKBOX WEB TESTING", ""),
        ("Target Aplikasi", TARGET_APP),
        ("Tanggal Laporan", date.today().isoformat()),
        ("Environment", "public-demo, Chromium headless 1920x1080, Playwright"),
        ("", ""),
        ("Total Test Case", total),
        ("PASS", n_pass),
        ("FAIL", n_fail),
        ("BLOCKED", n_blocked),
        ("NOT VERIFIED", n_nv),
        ("Pass Rate (dari yang dieksekusi)", pass_rate),
        ("", ""),
        ("Total Defect Terdokumentasi", len(defect_rows)),
        ("Referensi Dokumen", "docs/test-case.md, docs/defect-list.md, docs/security-findings.md"),
    ]
    for r, (label, nilai) in enumerate(ringkasan, start=1):
        a = ws.cell(row=r, column=1, value=label)
        b = ws.cell(row=r, column=2, value=nilai)
        a.border = BORDER; b.border = BORDER
        if r == 1:
            a.font = Font(bold=True, size=13)
        elif label:
            a.font = Font(bold=True)
    auto_width(ws, {1: 34, 2: 60})

    # --- Sheet 2: Hasil Test ---
    ws2 = wb.create_sheet("Hasil Test")
    headers = ["Test Case ID", "Judul", "Langkah Pengujian", "Expected Result", "Modul", "Priority", "Status", "Bukti"]
    for c, h in enumerate(headers, start=1):
        ws2.cell(row=1, column=c, value=h)
    for r, t in enumerate(tests, start=2):
        ws2.cell(row=r, column=1, value=t["id"])
        ws2.cell(row=r, column=2, value=t["judul"])
        for col, key in ((3, "langkah"), (4, "expected")):
            cell = ws2.cell(row=r, column=col, value=t[key])
            cell.alignment = Alignment(wrap_text=True, vertical="top")
        ws2.cell(row=r, column=5, value=t["modul"])
        ws2.cell(row=r, column=6, value=t["prioritas"])
        sc = ws2.cell(row=r, column=7, value=t["status"])
        sc.fill = STATUS_FILL.get(t["status"], PatternFill())
        sc.font = STATUS_FONT.get(t["status"], Font())
        sc.alignment = Alignment(horizontal="center")
        ws2.cell(row=r, column=8, value=t["bukti"])
        for c in range(1, 9):
            ws2.cell(row=r, column=c).border = BORDER
    style_header(ws2, 8)
    auto_width(ws2, {1: 14, 2: 38, 3: 52, 4: 48, 5: 9, 6: 10, 7: 14, 8: 46})

    # --- Sheet 3: Defect ---
    ws3 = wb.create_sheet("Defect")
    if defect_rows and len(defect_rows[0]) >= 8:
        headers3 = ["ID", "Judul", "Modul", "Severity", "Priority", "Test Case", "Status", "Bukti"]
        for c, h in enumerate(headers3, start=1):
            ws3.cell(row=1, column=c, value=h)
        for r, sel in enumerate(defect_rows, start=2):
            sev = sel[3].upper()
            for c, val in enumerate(sel[:8], start=1):
                cell = ws3.cell(row=r, column=c, value=val)
                cell.border = BORDER
                cell.alignment = Alignment(wrap_text=True, vertical="top")
            ws3.cell(row=r, column=4).fill = STATUS_FILL.get(sev, PatternFill())
            ws3.cell(row=r, column=4).font = STATUS_FONT.get(sev, Font())
        style_header(ws3, 8)
        auto_width(ws3, {1: 10, 2: 48, 3: 16, 4: 11, 5: 10, 6: 14, 7: 9, 8: 50})
    else:
        ws3.cell(row=1, column=1, value="Tidak ada defect terdokumentasi.")

    out = OUT_DIR / f"Laporan-QA-SauceDemo-{date.today().isoformat()}.xlsx"
    try:
        wb.save(out)
    except PermissionError:
        # File lama terbuka di Excel/terkunci -> simpan dengan suffix jam
        import time
        out = OUT_DIR / f"Laporan-QA-SauceDemo-{date.today().isoformat()}-{time.strftime('%H%M')}.xlsx"
        wb.save(out)
        print("[INFO] File tanggal sama terkunci; disimpan dengan suffix jam.")
    print(f"Laporan Excel dibuat : {out.relative_to(ROOT)}")
    print(f"Data                 : {total} test case ({n_pass} PASS, {n_fail} FAIL), {len(defect_rows)} defect")
    return 0


if __name__ == "__main__":
    sys.exit(main())
