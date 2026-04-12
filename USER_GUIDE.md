# 📖 Panduan Pengguna - Smartphone Finder

Panduan lengkap untuk menggunakan aplikasi Smartphone Finder.

## 🌐 Akses Aplikasi

**Website:** [https://smartphone-finder-backend.vercel.app](https://smartphone-finder-backend.vercel.app)

**Kompatibilitas:**
- ✅ Chrome, Firefox, Safari, Edge (versi terbaru)
- ✅ Android 8.0+
- ✅ iOS 12+
- ✅ Desktop (Windows, Mac, Linux)

---

## 🚀 Memulai

### 1. Registrasi Akun

Pertama kali menggunakan aplikasi, kamu perlu membuat akun:

1. Buka aplikasi di browser
2. Klik tombol **"Daftar di sini"** di halaman login
3. Isi form registrasi:
   - **Username:** Nama pengguna unik (contoh: johndoe)
   - **Email:** Email valid (contoh: john@example.com)
   - **Password:** Minimal 6 karakter
   - **Confirm Password:** Ulangi password yang sama
4. Klik tombol **"Daftar"**
5. Jika berhasil, kamu akan diarahkan ke halaman login

**Tips:**
- Gunakan password yang kuat dan mudah diingat
- Email harus valid dan belum terdaftar sebelumnya
- Username tidak bisa diubah setelah registrasi

---

### 2. Login

Setelah punya akun, login untuk mengakses dashboard:

1. Masukkan **Username** dan **Password**
2. Klik tombol **"Login"**
3. Kamu akan masuk ke dashboard utama

**Lupa Password?**
Saat ini belum ada fitur reset password. Pastikan kamu mengingat password dengan baik.

---

## 📱 Fitur Utama

### Dashboard

Setelah login, kamu akan melihat dashboard dengan beberapa bagian:

#### 🎯 Hero Section (Kiri Atas)
- Judul aplikasi dengan animasi
- Tombol **"Mulai Analisis"** untuk menghitung ranking
- Deskripsi singkat aplikasi

#### 🏆 Top Ranking (Kanan Atas)
- Menampilkan 3 smartphone terbaik
- Badge emas, perak, perunggu
- Score masing-masing smartphone
- Muncul setelah klik "Mulai Analisis"

#### ➕ Form Tambah Smartphone (Tengah)
- Input data smartphone baru
- 6 field yang harus diisi

#### 📊 Daftar Smartphone (Bawah)
- Card untuk setiap smartphone
- Tombol hapus di pojok kanan atas card
- Informasi lengkap setiap smartphone

#### 📈 Grafik Ranking (Paling Bawah)
- Grafik batang perbandingan score
- Muncul setelah klik "Mulai Analisis"

---

## ➕ Menambah Data Smartphone

### Langkah-langkah:

1. Scroll ke bagian **"Tambah Smartphone"**
2. Isi semua field:

   **Nama HP**
   - Contoh: Samsung Galaxy S23, iPhone 15 Pro
   - Boleh pakai spasi dan angka

   **Harga**
   - Masukkan harga dalam Rupiah (tanpa titik/koma)
   - Contoh: 12000000 (untuk Rp 12.000.000)
   - Harus lebih dari 0

   **RAM**
   - Kapasitas RAM dalam GB
   - Contoh: 8, 12, 16
   - Harus lebih dari 0

   **Kamera**
   - Resolusi kamera utama dalam Megapixel
   - Contoh: 50, 108, 200
   - Harus lebih dari 0

   **Berat**
   - Berat smartphone dalam gram
   - Contoh: 168, 195, 210
   - Harus lebih dari 0

   **Keunikan**
   - Nilai subjektif fitur unik (1-10)
   - 1 = Biasa saja
   - 10 = Sangat unik/inovatif
   - Contoh: Layar lipat = 9, Kamera periscope = 8

3. Klik tombol **"Simpan Data"**
4. Data akan langsung muncul di daftar smartphone

**Validasi:**
- Semua field wajib diisi
- Semua nilai harus lebih dari 0
- Jika ada error, akan muncul alert

---

## 🔍 Menganalisis & Melihat Ranking

### Cara Menggunakan:

1. Pastikan sudah ada minimal 2 data smartphone
2. Klik tombol **"Mulai Analisis"** di bagian atas
3. Sistem akan menghitung score menggunakan metode SAW
4. Hasil akan muncul di 2 tempat:
   - **Top Ranking** (sidebar kanan): 3 teratas dengan badge
   - **Grafik Ranking** (bawah): Grafik batang semua smartphone

### Cara Membaca Hasil:

**Score:**
- Berkisar antara 0.000 - 1.000
- Semakin tinggi score, semakin baik
- Score 0.800+ = Sangat baik
- Score 0.600-0.799 = Baik
- Score < 0.600 = Cukup

**Ranking:**
- #1 = Badge emas 🥇
- #2 = Badge perak 🥈
- #3 = Badge perunggu 🥉

**Grafik:**
- Batang hijau = Score tinggi
- Batang biru = Score sedang
- Batang ungu/merah = Score rendah

---

## 🗑️ Menghapus Data Smartphone

1. Cari card smartphone yang ingin dihapus
2. Klik icon **Trash** (🗑️) di pojok kanan atas card
3. Data akan langsung terhapus
4. Jika ingin analisis ulang, klik "Mulai Analisis" lagi

**Perhatian:**
- Data yang dihapus tidak bisa dikembalikan
- Pastikan data yang dihapus sudah benar

---

## 👤 Profile & Statistik

### Mengakses Profile:

1. Klik icon **Menu** (☰) di pojok kiri atas
2. Pilih **"Profile"**
3. Lihat informasi akun dan statistik

### Informasi yang Ditampilkan:

**User Information:**
- Username
- Email
- Role (User)
- Join Date (bulan & tahun registrasi)

**Recent Activity:**
- **Total Analyses:** Berapa kali klik "Mulai Analisis"
- **Saved Items:** Berapa smartphone yang ditambahkan
- **Comparisons:** Berapa kali melihat grafik
- **This Week:** Berapa analyses dalam 7 hari terakhir

### Kembali ke Dashboard:

Klik tombol **"Kembali ke Dashboard"** di bagian atas

---

## 🌓 Dark Mode / Light Mode

Aplikasi mendukung 2 tema:

### Cara Mengganti Tema:

1. Klik icon **Menu** (☰) di pojok kiri atas
2. Pilih **"Dark Mode"** atau **"Light Mode"**
3. Tema akan langsung berubah
4. Pilihan tema akan tersimpan otomatis

**Dark Mode:**
- Background gelap (hitam/abu-abu)
- Cocok untuk malam hari
- Hemat baterai (OLED screen)

**Light Mode:**
- Background terang (putih/hijau muda)
- Cocok untuk siang hari
- Lebih mudah dibaca di outdoor

---

## 📱 Install sebagai Aplikasi (PWA)

Kamu bisa install aplikasi ini di HP/Desktop seperti aplikasi native!

### Android (Chrome):

1. Buka aplikasi di Chrome
2. Klik **Menu** (⋮) di pojok kanan atas
3. Pilih **"Add to Home screen"** atau **"Install app"**
4. Klik **"Install"**
5. Icon akan muncul di home screen
6. Buka dari home screen seperti aplikasi biasa

### iPhone (Safari):

1. Buka aplikasi di Safari
2. Klik tombol **Share** (kotak dengan panah ↑)
3. Scroll dan pilih **"Add to Home Screen"**
4. Edit nama jika perlu
5. Klik **"Add"**
6. Icon akan muncul di home screen

### Desktop (Chrome/Edge):

1. Buka aplikasi di browser
2. Lihat icon **Install** (⊕) di address bar
3. Klik icon tersebut
4. Klik **"Install"**
5. Aplikasi akan terbuka di window terpisah
6. Shortcut akan dibuat di desktop/start menu

**Keuntungan Install:**
- Akses lebih cepat (tidak perlu buka browser)
- Full screen (tidak ada address bar)
- Icon di home screen
- Bisa buka offline (untuk halaman yang sudah di-cache)
- Notifikasi (jika diaktifkan)

---

## 🔐 Keamanan & Privacy

### Password:
- Password di-enkripsi dengan bcrypt
- Tidak ada yang bisa melihat password kamu
- Tidak disimpan dalam bentuk plain text

### Session:
- Login session berlaku 1 jam
- Setelah 1 jam, harus login ulang
- Token disimpan di browser (localStorage)

### Data:
- Data smartphone bersifat global (semua user bisa lihat)
- Data profile bersifat private (hanya kamu yang bisa lihat)
- Statistik aktivitas per user (tidak dicampur dengan user lain)

---

## ❓ FAQ (Frequently Asked Questions)

### Q: Apakah aplikasi ini gratis?
**A:** Ya, 100% gratis untuk semua fitur.

### Q: Apakah perlu install aplikasi?
**A:** Tidak wajib. Bisa diakses langsung via browser. Tapi bisa diinstall sebagai PWA untuk kemudahan.

### Q: Berapa banyak smartphone yang bisa ditambahkan?
**A:** Tidak ada batasan. Bisa tambahkan sebanyak yang kamu mau.

### Q: Apakah data saya aman?
**A:** Ya. Password di-enkripsi dan data disimpan di database yang aman.

### Q: Bagaimana cara menghitung ranking?
**A:** Menggunakan metode SAW (Simple Additive Weighting) dengan 5 kriteria: harga, RAM, kamera, berat, dan keunikan.

### Q: Kenapa score smartphone saya rendah?
**A:** Score dihitung berdasarkan perbandingan dengan smartphone lain. Coba tambahkan lebih banyak data untuk perbandingan yang lebih akurat.

### Q: Bisa ubah data smartphone yang sudah ditambahkan?
**A:** Saat ini belum ada fitur edit. Kamu bisa hapus dan tambahkan ulang dengan data yang benar.

### Q: Apakah bisa digunakan offline?
**A:** Sebagian. Halaman yang sudah dibuka bisa di-cache. Tapi untuk fetch data baru tetap perlu internet.

### Q: Kenapa harus login?
**A:** Untuk tracking aktivitas personal dan keamanan data.

### Q: Lupa password, bagaimana?
**A:** Saat ini belum ada fitur reset password. Pastikan kamu mengingat password dengan baik.

---

## 🐛 Troubleshooting

### Tidak bisa login
- Pastikan username dan password benar (case-sensitive)
- Cek koneksi internet
- Clear cache browser dan coba lagi
- Pastikan sudah registrasi terlebih dahulu

### Data tidak muncul setelah ditambahkan
- Refresh halaman (F5)
- Cek koneksi internet
- Pastikan semua field sudah diisi dengan benar

### Grafik tidak muncul
- Pastikan sudah klik "Mulai Analisis"
- Pastikan ada minimal 1 data smartphone
- Refresh halaman

### Aplikasi lambat
- Clear cache browser
- Tutup tab browser yang tidak perlu
- Cek koneksi internet
- Coba gunakan browser lain

### Tidak bisa install PWA
- Pastikan menggunakan browser yang support PWA (Chrome, Edge, Safari)
- Pastikan menggunakan HTTPS (bukan HTTP)
- Coba clear cache dan reload

---

## 💡 Tips & Trik

### Untuk Hasil Analisis Terbaik:
1. Tambahkan minimal 5 smartphone untuk perbandingan yang akurat
2. Gunakan data harga yang up-to-date
3. Berikan nilai keunikan yang objektif
4. Bandingkan smartphone di range harga yang sama

### Untuk Pengalaman Terbaik:
1. Install sebagai PWA untuk akses lebih cepat
2. Gunakan dark mode di malam hari
3. Bookmark halaman untuk akses cepat
4. Gunakan di desktop untuk tampilan lebih luas

### Untuk Keamanan:
1. Jangan share password dengan orang lain
2. Logout setelah selesai menggunakan (di komputer umum)
3. Gunakan password yang kuat dan unik

---

## 📞 Bantuan & Support

Jika mengalami masalah atau punya pertanyaan:

1. Baca FAQ di atas
2. Cek Troubleshooting guide
3. Buka issue di GitHub repository
4. Contact developer via email

---

## 🎯 Roadmap Fitur Mendatang

Fitur yang sedang dikembangkan:
- [ ] Edit data smartphone
- [ ] Filter & search smartphone
- [ ] Export hasil analisis (PDF/Excel)
- [ ] Perbandingan 2 smartphone side-by-side
- [ ] Custom bobot kriteria
- [ ] Reset password via email
- [ ] Notifikasi push
- [ ] Multi-language support

---

**Selamat menggunakan Smartphone Finder! 🚀**

Jika aplikasi ini membantu, jangan lupa kasih ⭐ di GitHub!
