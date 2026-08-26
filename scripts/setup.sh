#!/usr/bin/env bash
# Setup environment untuk freebuff-web-testing-template
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "=== Setup Freebuff Web Testing Template ==="

# 1. Konfigurasi env
if [ ! -f config/test-config.env ]; then
  cp config/test-config.example.env config/test-config.env
  echo "[OK] Dibuat config/test-config.env — silakan isi nilai aktual."
else
  echo "[SKIP] config/test-config.env sudah ada."
fi

# 2. Dependensi Node (Playwright) jika package.json tersedia
if command -v node >/dev/null 2>&1; then
  if [ ! -d node_modules ]; then
    if [ -f package.json ]; then
      npm install
      npx playwright install --with-deps || npx playwright install
      echo "[OK] Dependensi Playwright terpasang."
    else
      echo "[INFO] Belum ada package.json — inisialisasi manual bila perlu:"
      echo "       npm init -y && npm i -D @playwright/test && npx playwright install"
    fi
  else
    echo "[SKIP] node_modules sudah ada."
  fi
else
  echo "[WARN] Node.js tidak ditemukan. Install dari https://nodejs.org"
fi

echo "Setup selesai. Jalankan scripts/validate-environment.sh untuk verifikasi."
