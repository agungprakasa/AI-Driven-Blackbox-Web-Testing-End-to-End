#!/usr/bin/env bash
# Setup environment untuk API Testing Template
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "=== Setup API Testing Template ==="

# 1. Konfigurasi env
if [ ! -f config/api-config.env ]; then
  echo "[WARN] config/api-config.env belum ada — buat dari contoh"
else
  echo "[OK] config/api-config.env sudah ada"
fi

# 2. Dependensi Node
if command -v node >/dev/null 2>&1; then
  if [ ! -d node_modules ]; then
    if [ -f package.json ]; then
      npm install
      npx playwright install --with-deps || npx playwright install
      echo "[OK] Dependensi Playwright terpasang"
    fi
  else
    echo "[SKIP] node_modules sudah ada"
  fi
else
  echo "[WARN] Node.js tidak ditemukan"
fi

# 3. Validasi curl input
if [ -d input/curl ]; then
  CURL_FILES=$(find input/curl -name "*.txt" -o -name "*.sh" 2>/dev/null | wc -l)
  echo "[INFO] Ditemukan $CURL_FILES file curl di input/curl/"
fi

echo ""
echo "Setup selesai!"
echo ""
echo "Langkah selanjutnya:"
echo "  1. Isi config/api-config.env"
echo "  2. Masukkan curl commands ke input/curl/"
echo "  3. Jalankan: python scripts/parse-curl.py input/curl/endpoints.txt"
echo "  4. Jalankan: npx playwright test tests/api/"
