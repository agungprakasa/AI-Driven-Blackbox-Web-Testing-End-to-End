#!/usr/bin/env python3
"""Validasi kelengkapan laporan QA sebelum delivery.

Cek:
1. Semua file docs/*.md wajib ada.
2. Setiap ID test case di docs/test-case.md berstatus PASS/FAIL harus punya bukti
   di evidence/PASS atau evidence/FAIL sesuai konvensi penamaan.
3. Folder reports/ tidak boleh kosong pada fase pelaporan.

Usage:
    python scripts/validate-report.py [--phase analysis|execution|reporting]
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_DOCS = [
    "material-analysis.md",
    "application-map.md",
    "test-strategy.md",
    "test-scenario.md",
    "test-case.md",
    "exploratory-findings.md",
    "security-findings.md",
    "defect-list.md",
    "evidence-validation.md",
    "final-summary.md",
]

TC_ID_RE = re.compile(r"TC-[A-Z]+-\d{3}")
STATUS_RE = re.compile(r"\b(PASS|FAIL|NOT VERIFIED|BLOCKED)\b", re.IGNORECASE)


def check_docs() -> list[str]:
    problems = []
    docs_dir = ROOT / "docs"
    for name in REQUIRED_DOCS:
        path = docs_dir / name
        if not path.exists():
            problems.append(f"[DOCS] File hilang: docs/{name}")
        elif path.stat().st_size == 0:
            problems.append(f"[DOCS] File kosong: docs/{name}")
    return problems


def extract_test_cases() -> list[tuple[str, str]]:
    """Kembalikan daftar (tc_id, status) dari tabel di docs/test-case.md."""
    cases = []
    text = (ROOT / "docs" / "test-case.md").read_text(encoding="utf-8") if (
        ROOT / "docs" / "test-case.md").exists() else ""
    for line in text.splitlines():
        # Lewati baris template/contoh (mis. "evidence/PASS/TC-XXX-001_*.png")
        if "*." in line:
            continue
        m = TC_ID_RE.search(line)
        s = STATUS_RE.search(line)
        if m and s:
            cases.append((m.group(0), s.group(1).upper()))
    return cases


def check_evidence(cases: list[tuple[str, str]]) -> list[str]:
    problems = []
    pass_dir = ROOT / "evidence" / "PASS"
    fail_dir = ROOT / "evidence" / "FAIL"
    for tc_id, status in cases:
        if status in ("NOT VERIFIED", "BLOCKED"):
            continue
        folder = pass_dir if status == "PASS" else fail_dir
        found = any(f.name.startswith(tc_id) for f in folder.glob("*") if f.is_file())
        if not found:
            problems.append(
                f"[EVIDENCE] {tc_id} berstatus {status} tapi tidak ada bukti "
                f"berawalan '{tc_id}' di evidence/{status.upper()}/")
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description="Validasi kelengkapan laporan QA")
    parser.add_argument("--phase", choices=["analysis", "execution", "reporting"],
                        default="reporting",
                        help="Fase workflow; menentukan cek mana yang aktif")
    args = parser.parse_args()

    problems = check_docs()

    if args.phase in ("execution", "reporting"):
        cases = extract_test_cases()
        print(f"Ditemukan {len(cases)} test case di docs/test-case.md")
        problems += check_evidence(cases)

    if args.phase == "reporting":
        for sub in ("docx", "excel", "playwright"):
            files = [f for f in (ROOT / "reports" / sub).glob("*")
                     if f.name != ".gitkeep"]
            if not files:
                problems.append(f"[REPORTS] reports/{sub}/ masih kosong")

    if problems:
        print("\nTemuan validasi:")
        for p in problems:
            print(" -", p)
        print(f"\nHasil: {len(problems)} masalah perlu diperbaiki [GAGAL]")
        return 1
    print("\nHasil: SEMUA LENGKAP [OK]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
