#!/usr/bin/env bash
# Validasi kesiapan lingkungan testing sebelum eksekusi.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
FAIL=0

pass() { echo "  [PASS] $1"; }
fail() { echo "  [FAIL] $1"; FAIL=$((FAIL+1)); }

check() { # check <deskripsi> <perintah...>
  local desc="$1"; shift
  if command -v "$1" >/dev/null 2>&1; then pass "$desc"; else fail "$desc (tidak ditemukan: $1)"; fi
}

echo "=== Validasi Lingkungan ==="

echo "-- Tools dasar --"
check "Node.js" node && node --version
check "npm" npm
if command -v python3 >/dev/null 2>&1; then
  pass "Python" && python3 --version
elif command -v python >/dev/null 2>&1; then
  pass "Python" && python --version
else
  fail "Python tidak ditemukan"
fi
check "git" git

echo "-- Struktur direktori --"
for d in input docs tests/web evidence/PASS evidence/FAIL reports scripts; do
  [ -d "$d" ] && pass "direktori $d" || fail "direktori $d hilang"
done

echo "-- Konfigurasi --"
[ -f config/test-config.example.env ] && pass "config/test-config.example.env ada" \
  || fail "config/test-config.example.env hilang"
if [ -f config/test-config.env ]; then
  pass "config/test-config.env ada"
  grep -q '^APP_BASE_URL=' config/test-config.env && pass "APP_BASE_URL terisi" \
    || fail "APP_BASE_URL belum diisi di test-config.env"
else
  fail "config/test-config.env belum dibuat (jalankan scripts/setup.sh)"
fi

echo "-- Playwright --"
if [ -x node_modules/.bin/playwright ]; then
  pass "Playwright terpasang"
else
  echo "  [INFO] Playwright belum terpasang (opsional sampai fase eksekusi)."
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "Hasil: SEMUA VALID [OK]"
  exit 0
else
  echo "Hasil: $FAIL masalah perlu diperbaiki [GAGAL]"
  exit 1
fi
