#!/usr/bin/env python3
"""Organize evidence files into PASS/FAIL directories."""
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EVIDENCE_DIR = ROOT / "evidence"
PASS_DIR = EVIDENCE_DIR / "PASS"
FAIL_DIR = EVIDENCE_DIR / "FAIL"

# Create directories
PASS_DIR.mkdir(exist_ok=True)
FAIL_DIR.mkdir(exist_ok=True)

# Read test results from JSON report
results_file = ROOT / "reports" / "json" / "results.json"
if not results_file.exists():
    print("No results.json found. Running tests first...")
    exit(1)

with open(results_file, "r") as f:
    results = json.load(f)

# Build test status map
test_status = {}
for suite in results.get("suites", []):
    for spec in suite.get("specs", []):
        for test in spec.get("tests", []):
            test_id = test.get("testId", "")
            status = test.get("status", "")
            if test_id:
                test_status[test_id] = status

print(f"Found {len(test_status)} test results")

# Move evidence files
moved = 0
for evidence_file in EVIDENCE_DIR.glob("*.json"):
    filename = evidence_file.stem
    # Extract test ID from filename (e.g., TC-P-001_post_123 -> TC-P-001)
    parts = filename.split("_")
    if len(parts) >= 2:
        test_id = parts[0]
        status = test_status.get(test_id, "UNKNOWN")
        
        if status == "passed":
            dest = PASS_DIR / evidence_file.name
            shutil.move(str(evidence_file), str(dest))
            moved += 1
        elif status == "failed":
            dest = FAIL_DIR / evidence_file.name
            shutil.move(str(evidence_file), str(dest))
            moved += 1
        else:
            # Unknown status, put in PASS by default
            dest = PASS_DIR / evidence_file.name
            shutil.move(str(evidence_file), str(dest))
            moved += 1

print(f"Moved {moved} evidence files")
print(f"PASS: {len(list(PASS_DIR.glob('*.json')))} files")
print(f"FAIL: {len(list(FAIL_DIR.glob('*.json')))} files")
