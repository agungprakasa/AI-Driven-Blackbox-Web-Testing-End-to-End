#!/usr/bin/env python3
"""Validasi kelengkapan laporan API Testing.

Usage:
    python scripts/validate-report.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_DOCS = [
    "material-analysis.md",
    "api-map.md",
    "test-strategy.md",
    "test-scenario.md",
    "test-case.md",
    "defect-list.md",
    "final-summary.md",
]

TC_ID_RE = re.compile(r"TC-[A-Z]+-?\d{3}")
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
    cases = []
    text = (ROOT / "docs" / "test-case.md").read_text(encoding="utf-8") if (
        ROOT / "docs" / "test-case.md").exists() else ""
    for line in text.splitlines():
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
                f"di evidence/{status.upper()}/")
    return problems


def main() -> int:
    problems = check_docs()
    cases = extract_test_cases()
    print(f"Ditemukan {len(cases)} test case di docs/test-case.md")
    problems += check_evidence(cases)

    for sub in ("docx", "excel"):
        files = [f for f in (ROOT / "reports" / sub).glob("*") if f.name != ".gitkeep"]
        if not files:
            problems.append(f"[REPORTS] reports/{sub}/ masih kosong")

    if problems:
        print("\nTemuan validasi:")
        for p in problems:
            print(f" - {p}")
        print(f"\nHasil: {len(problems)} masalah [GAGAL]")
        return 1

    print("\nHasil: SEMUA LENGKAP [OK]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
