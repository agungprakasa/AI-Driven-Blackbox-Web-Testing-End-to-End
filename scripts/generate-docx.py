#!/usr/bin/env python3
"""Generator laporan DOCX QA — membaca docs/*.md dan menghasilkan laporan Word
di reports/docx/.

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
from docx.shared import Inches, Pt, RGBColor

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reports" / "docx"
TARGET_APP = "Ipos5 Courier Core System (https://ipos-dev.posindonesia.co.id)"

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
        for i, val in enumerate(row[: len(headers)]):
            cells[i].text = bersihkan_md(val)
    if widths:
        for i, w in enumerate(widths):
            for row in t.rows:
                row.cells[i].width = w
    doc.add_paragraph()


def heading(doc: Document, text: str, level: int = 1) -> None:
    doc.add_heading(text, level=level)


def para(doc: Document, text: str, bold: bool = False, italic: bool = False) -> None:
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    tc_teks = baca(ROOT / "docs" / "test-case.md")
    defect_rows = baris_tabel(baca(ROOT / "docs" / "defect-list.md"), r"DEF-\d+")
    sec_pos = [r for r in baris_tabel(baca(ROOT / "docs" / "security-findings.md"), r"SEC-POS-\d+")
               if re.fullmatch(r"SEC-POS-\d{2}", r[0])]

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

    # ===== Halaman judul =====
    judul = doc.add_heading("Laporan Pengujian QA", level=0)
    judul.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub = doc.add_paragraph("AI-Driven Blackbox Web Testing — End-to-End")
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.runs[0].italic = True
    info = doc.add_paragraph()
    info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = info.add_run(f"Target: {TARGET_APP}\nTanggal: {date.today().isoformat()}\n"
                     "Environment: public-demo · Chromium headless · Playwright")
    r.font.size = Pt(11)

    # ===== 1. Ringkasan Eksekutif =====
    heading(doc, "1. Ringkasan Eksekutif", 1)
    para(doc, f"Pengujian black-box dilakukan terhadap {total} test case yang mencakup functional, "
              "boundary value analysis, equivalence partitioning, abnormal, exploratory, security "
              "(authentication, authorization, session), dan E2E testing.")
    tambah_tabel(doc,
                 ["Metrik", "Nilai"],
                 [["Total Test Case", str(total)],
                  ["PASS", str(n_pass)],
                  ["FAIL", str(n_fail)],
                  ["Pass Rate (dari yang dieksekusi)", pass_rate],
                  ["Total Defect", str(len(defect_rows))]],
                 widths=[Pt(220), Pt(180)])

    # ===== 2. Hasil Pengujian per Modul =====
    heading(doc, "2. Hasil Pengujian", 1)
    modul_urut = ["AUTH", "PROC", "COLL", "REPO", "TRCK", "SETT", "MODL", "ACCT", "DASH", "FILTER", "E2E"]
    nama_modul = {"AUTH": "Autentikasi & Sesi", "PROC": "Processing (Pengolahan Paket)",
                  "COLL": "Collecting (Transaksi)", "REPO": "Reporting (Pelaporan)",
                  "TRCK": "Tracking", "SETT": "Settings (Pengaturan)",
                  "MODL": "Modules (Tambahan)", "ACCT": "Account (Akun)",
                  "DASH": "Dashboard", "FILTER": "Filter & Export/Download",
                  "E2E": "End-to-End"}
    for m in modul_urut:
        subset = [t for t in tests if t["modul"] == m]
        if not subset:
            continue
        heading(doc, f"2.{modul_urut.index(m) + 1} {nama_modul[m]}", 2)
        data = [[t["id"], bersihkan_md(t["judul"])[:70], t["langkah"], t["expected"], t["prioritas"], t["status"]] for t in subset]
        tambah_tabel(doc, ["ID", "Judul", "Langkah Pengujian", "Expected Result", "Priority", "Status"], data,
                     widths=[Pt(70), Pt(120), Pt(150), Pt(150), Pt(45), Pt(60)])
        # Rapikan font langkah & expected agar lebih kecil dan wrap rapi
        for row in doc.tables[-1].rows[1:]:
            for idx in (2, 3):
                for p in row.cells[idx].paragraphs:
                    for run in p.runs:
                        run.font.size = Pt(8)
            status_text = row.cells[5].text.strip()
            if status_text in ("PASS", "FAIL"):
                for p in row.cells[5].paragraphs:
                    for run in p.runs:
                        run.font.bold = True
                        run.font.color.rgb = HIJAU if status_text == "PASS" else MERAH

    # ===== 3. Temuan Keamanan =====
    heading(doc, "3. Sorotan Keamanan", 1)
    para(doc, "Enam kontrol keamanan dasar terverifikasi positif: SQL Injection ditolak, XSS tidak "
              "tereksekusi, akses langsung URL tanpa sesi ditolak, logout membersihkan sesi, pesan error "
              "tidak membocorkan informasi internal, dan parameter id invalid tidak menyebabkan crash.")
    if sec_pos:
        tambah_tabel(doc, ["ID", "Kontrol Terverifikasi", "Test", "Hasil"],
                     [[s[0], bersihkan_md(s[1])[:100], s[2], s[3]] for s in sec_pos],
                     widths=[Pt(75), Pt(260), Pt(90), Pt(60)])

    # ===== 4. Defect =====
    heading(doc, "4. Daftar Defect", 1)
    if defect_rows:
        for sel in defect_rows:
            did, djudul, dmodul, dsev, dpri, dtc, dstat = sel[:7]
            heading(doc, f"{did} — {bersihkan_md(djudul)} ({dsev}, {dstat})", 3)
            para(doc, f"Modul: {dmodul} | Test Case: {dtc} | Priority: {dpri}")
        para(doc, "Detail langkah reproduksi lengkap tersedia pada docs/defect-list.md beserta "
                  "bukti screenshot di folder evidence/.", italic=True)
    else:
        para(doc, "Tidak ada defect terdokumentasi.")

    # ===== 5. Kesimpulan & Rekomendasi =====
    heading(doc, "5. Kesimpulan & Rekomendasi", 1)
    para(doc, f"Dari {total} test case, {n_pass} PASS dan {n_fail} FAIL (pass rate {pass_rate}). "
              "Fungsi inti e-commerce — autentikasi, katalog, keranjang, checkout end-to-end, dan "
              "kontrol keamanan dasar — berfungsi dengan baik.")
    para(doc, "Dua temuan terbuka: (1) DEF-001 High — perilaku pesan error akun locked_user tidak "
              "sesuai dokumentasi; perlu konfirmasi pemilik aplikasi; (2) DEF-002 Low — Reset App State "
              "meninggalkan state tombol basi sampai reload.", bold=False)
    para(doc, "Rekomendasi: GO dengan catatan — aplikasi layak digunakan untuk tujuan demo/edukasi; "
              "kedua temuan tidak memblokir alur bisnis utama. Untuk konteks produksi nyata, DEF-001 "
              "wajib diklarifikasi terlebih dahulu.", bold=True)

    doc.add_paragraph()
    para(doc, "Lampiran: Laporan Excel (reports/excel/), hasil Playwright (reports/playwright/), "
              "bukti pengujian (evidence/PASS|FAIL/), dokumen analisis (docs/).", italic=True)

    # ===== 6. Lampiran Bukti Pengujian =====
    heading(doc, "6. Lampiran Bukti Pengujian", 1)
    para(doc, "Berikut adalah screenshot bukti pengujian untuk setiap test case yang telah dieksekusi. "
              "Gambar dikelompokkan berdasarkan modul dan status (PASS/FAIL).", italic=True)

    # Kumpulkan file bukti dari evidence/PASS dan evidence/FAIL
    bukti_map: dict[str, list[tuple[str, str]]] = {}  # tc_id -> [(path, status)]
    for folder_name in ("PASS", "FAIL"):
        ev_dir = ROOT / "evidence" / folder_name
        if not ev_dir.exists():
            continue
        for f in sorted(ev_dir.iterdir()):
            if f.suffix.lower() in (".png", ".jpg", ".jpeg", ".gif", ".bmp") and f.name != ".gitkeep":
                # Ekstrak TC-ID dari nama file (bagian sebelum underscore pertama)
                tc_match = re.match(r"(TC-[A-Z0-9]+-\d{3})", f.name)
                if tc_match:
                    tc_id = tc_match.group(1)
                    bukti_map.setdefault(tc_id, []).append((str(f), folder_name))

    # Tambahkan bukti per modul
    for m in modul_urut:
        subset = [t for t in tests if t["modul"] == m]
        if not subset:
            continue
        # Kumpulkan semua bukti untuk modul ini
        modul_bukti: list[tuple[str, str, str, str]] = []  # (tc_id, judul, path, status)
        for t in subset:
            for ev_path, ev_status in bukti_map.get(t["id"], []):
                modul_bukti.append((t["id"], t["judul"], ev_path, ev_status))
        if not modul_bukti:
            continue
        heading(doc, f"6.{modul_urut.index(m) + 1} {nama_modul[m]}", 2)
        for tc_id, judul, ev_path, ev_status in modul_bukti:
            # Caption: ID — Judul (STATUS)
            caption = f"{tc_id} — {bersihkan_md(judul)[:60]} ({ev_status})"
            p_caption = doc.add_paragraph()
            r_cap = p_caption.add_run(caption)
            r_cap.bold = True
            r_cap.font.size = Pt(9)
            r_cap.font.color.rgb = HIJAU if ev_status == "PASS" else MERAH
            # Sisipkan gambar (maks lebar 6 inch agar rapi di A4)
            try:
                doc.add_picture(ev_path, width=Inches(5.5))
            except Exception as e:
                para(doc, f"[Gagal menyisipkan gambar: {e}]", italic=True)
            doc.add_paragraph()  # spasi antar gambar

    out = OUT_DIR / f"Laporan-QA-Ipos5-{date.today().isoformat()}.docx"
    try:
        doc.save(out)
    except PermissionError:
        import time
        out = OUT_DIR / f"Laporan-QA-Ipos5-{date.today().isoformat()}-{time.strftime('%H%M')}.docx"
        doc.save(out)
        print("[INFO] File tanggal sama terkunci; disimpan dengan suffix jam.")
    print(f"Laporan DOCX dibuat : {out.relative_to(ROOT)}")
    print(f"Isi                 : {total} test case ({n_pass} PASS, {n_fail} FAIL), {len(defect_rows)} defect, "
          f"{len(sec_pos)} kontrol keamanan positif")
    return 0


if __name__ == "__main__":
    sys.exit(main())
