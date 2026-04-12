# PWA Icon Guide

## Cara Membuat Icon untuk PWA

Kamu perlu 2 icon PNG:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

### Opsi 1: Buat di Canva (MUDAH)
1. Buka https://canva.com
2. Buat design baru 512x512 px
3. Design icon dengan:
   - Background: Gradient hijau (#10b981 ke #059669)
   - Icon: Smartphone atau logo app
   - Text: "SF" atau "SmartFinder"
4. Download sebagai PNG
5. Resize ke 192x192 untuk icon kecil

### Opsi 2: Gunakan Tool Online
1. Buka https://realfavicongenerator.net/
2. Upload logo/icon kamu
3. Generate semua ukuran otomatis
4. Download dan extract ke folder `public/`

### Opsi 3: Gunakan Favicon yang Ada
Untuk sementara, copy `favicon.svg` dan convert ke PNG:
1. Buka https://cloudconvert.com/svg-to-png
2. Upload `favicon.svg`
3. Set width: 192px, download
4. Ulangi dengan width: 512px

### Temporary Solution
Untuk testing, kamu bisa pakai icon default dulu.
Nanti ganti dengan icon yang lebih bagus sebelum publish.

## File yang Perlu Diganti:
- `/public/icon-192.png`
- `/public/icon-512.png`
