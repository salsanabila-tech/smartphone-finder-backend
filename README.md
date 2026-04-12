# 📱 Smartphone Finder - Sistem Pendukung Keputusan

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

Sistem Pendukung Keputusan (SPK) berbasis web untuk membantu pengguna memilih smartphone terbaik menggunakan metode **Simple Additive Weighting (SAW)**. Aplikasi ini dilengkapi dengan fitur authentication, activity tracking, dan dapat diinstall sebagai Progressive Web App (PWA).

## 🌟 Demo

**Live Application:** [https://smartphone-finder-backend.vercel.app](https://smartphone-finder-backend.vercel.app)

**Backend API:** [https://smartphone-finder-backend-production.up.railway.app](https://smartphone-finder-backend-production.up.railway.app)

## ✨ Fitur Utama

### 🔐 Authentication & Authorization
- Register dengan validasi email dan password
- Login dengan JWT token
- Session management
- Protected routes

### 📊 Sistem Pendukung Keputusan (SAW)
- Input data smartphone (harga, RAM, kamera, berat, keunikan)
- Perhitungan otomatis menggunakan metode SAW
- Ranking smartphone berdasarkan score
- Visualisasi grafik perbandingan
- Top 3 ranking dengan badge

### 👤 User Profile & Activity Tracking
- Profile dinamis dengan data user
- Total analyses tracking
- Saved items counter
- Comparisons counter
- Weekly activity statistics

### 🎨 UI/UX Modern
- Design spektakuler dengan animated background
- Glassmorphism effects
- Dark/Light mode toggle
- Responsive design (mobile, tablet, desktop)
- Smooth animations dan transitions

### 📱 Progressive Web App (PWA)
- Installable di Android, iOS, dan Desktop
- Offline capability
- Fast loading dengan caching
- Full screen mode
- Custom app icon

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Icons** - Additional icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment & Hosting
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** MySQL on Railway

## 📋 Prerequisites

Sebelum memulai, pastikan kamu sudah install:

- **Node.js** (v16 atau lebih baru)
- **npm** atau **yarn**
- **MySQL** (untuk development lokal)
- **Git**

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/salsanabila-tech/smartphone-finder-backend.git
cd smartphone-finder-backend
```

### 2. Setup Backend

```bash
# Install dependencies
npm install

# Buat file .env
cp .env.example .env

# Edit .env dengan konfigurasi database kamu
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=spk_smartphone
# JWT_SECRET=your_secret_key
# PORT=3001

# Jalankan backend
npm start
```

Backend akan berjalan di `http://localhost:3001`

### 3. Setup Frontend

```bash
# Masuk ke folder frontend
cd spk-frontend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:3001

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 📁 Struktur Project

```
smartphone-finder-backend/
├── spk-frontend/              # Frontend React
│   ├── public/                # Static assets
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   ├── icon-192.png       # PWA icon
│   │   └── icon-512.png       # PWA icon
│   ├── src/
│   │   ├── App.jsx            # Main dashboard
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Register page
│   │   ├── Profile.jsx        # User profile
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env                   # Environment variables
│   └── package.json
├── index.js                   # Backend server
├── package.json               # Backend dependencies
├── .env                       # Backend environment variables
├── .gitignore
├── README.md                  # Dokumentasi utama
├── DEPLOYMENT_GUIDE.md        # Panduan deployment
└── QUICK_START.md             # Quick start guide
```

## 🎯 Cara Penggunaan

### 1. Register Akun Baru
- Buka aplikasi
- Klik "Daftar di sini"
- Isi username, email, dan password
- Klik "Daftar"

### 2. Login
- Masukkan username dan password
- Klik "Login"

### 3. Tambah Data Smartphone
- Isi form dengan data smartphone:
  - Nama HP
  - Harga (Rp)
  - RAM (GB)
  - Kamera (MP)
  - Berat (gram)
  - Keunikan (1-10)
- Klik "Simpan Data"

### 4. Analisis & Ranking
- Klik tombol "Mulai Analisis"
- Sistem akan menghitung score menggunakan metode SAW
- Lihat ranking di sidebar kanan
- Lihat grafik perbandingan di bawah

### 5. Lihat Profile & Statistik
- Klik menu (☰) di pojok kiri atas
- Pilih "Profile"
- Lihat statistik aktivitas kamu

### 6. Install sebagai App (PWA)
- **Android:** Menu → Add to Home screen
- **iOS:** Share → Add to Home Screen
- **Desktop:** Icon install di address bar

## 🔧 Konfigurasi

### Environment Variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=spk_smartphone
DB_PORT=3306
JWT_SECRET=your_secret_key_here
PORT=3001
```

**Frontend (spk-frontend/.env):**
```env
VITE_API_URL=http://localhost:3001
```

### Database Schema

Database akan dibuat otomatis saat pertama kali menjalankan backend. Tabel yang dibuat:

1. **users** - Data pengguna
2. **smartphone** - Data smartphone
3. **user_activities** - Tracking aktivitas user

## 📊 Metode SAW (Simple Additive Weighting)

### Kriteria & Bobot:
- **Harga (30%)** - Cost (semakin murah semakin baik)
- **Berat (15%)** - Cost (semakin ringan semakin baik)
- **Kamera (25%)** - Benefit (semakin tinggi semakin baik)
- **Keunikan (10%)** - Benefit (semakin unik semakin baik)
- **RAM (20%)** - Benefit (semakin besar semakin baik)

### Formula:
```
Score = (0.3 × R_harga) + (0.15 × R_berat) + (0.25 × R_kamera) + (0.1 × R_keunikan) + (0.2 × R_ram)
```

Dimana:
- R_harga = min(harga) / harga_i
- R_berat = min(berat) / berat_i
- R_kamera = kamera_i / max(kamera)
- R_keunikan = keunikan_i / max(keunikan)
- R_ram = ram_i / max(ram)

## 🚀 Deployment

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk panduan lengkap deployment ke production.

### Quick Deploy:

**Frontend (Vercel):**
```bash
# Push ke GitHub
git push origin main

# Deploy otomatis via Vercel
# Set environment variable: VITE_API_URL
```

**Backend (Railway):**
```bash
# Push ke GitHub
git push origin main

# Deploy otomatis via Railway
# Set environment variables di Railway dashboard
```

## 🧪 Testing

### Test Backend API:
```bash
# Test health check
curl http://localhost:3001/

# Test register
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'

# Test login
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

### Test Frontend:
```bash
cd spk-frontend
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan MySQL sudah running
- Cek kredensial di file `.env`
- Pastikan database sudah dibuat

### Frontend tidak bisa fetch data
- Cek apakah backend sudah running
- Cek `VITE_API_URL` di `.env`
- Cek CORS settings di backend

### PWA tidak bisa diinstall
- Pastikan menggunakan HTTPS (atau localhost)
- Cek manifest.json sudah benar
- Cek service worker terdaftar di DevTools

## 📝 API Documentation

### Authentication Endpoints

#### POST /register
Register user baru
```json
Request:
{
  "username": "string",
  "email": "string",
  "password": "string (min 6 chars)"
}

Response:
{
  "message": "Registrasi berhasil!",
  "userId": 1
}
```

#### POST /login
Login user
```json
Request:
{
  "username": "string",
  "password": "string"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

### Smartphone Endpoints

#### GET /smartphones
Get semua data smartphone

#### POST /smartphones
Tambah smartphone baru
```json
Request:
{
  "nama_hp": "string",
  "harga": number,
  "ram": number,
  "kamera": number,
  "berat": number,
  "keunikan": number
}
```

#### DELETE /smartphones/:id
Hapus smartphone

### SAW Endpoint

#### GET /saw
Get ranking hasil perhitungan SAW

### User Endpoints

#### GET /profile
Get user profile (requires JWT token)

#### GET /user-stats
Get user statistics (requires JWT token)

#### POST /track-activity
Track user activity (requires JWT token)

## 🤝 Contributing

Contributions are welcome! Silakan buat pull request atau buka issue untuk bug reports dan feature requests.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Salsanabila Tech**
- GitHub: [@salsanabila-tech](https://github.com/salsanabila-tech)

## 🙏 Acknowledgments

- Metode SAW untuk sistem pendukung keputusan
- React & Vite untuk development experience yang luar biasa
- Tailwind CSS untuk styling yang cepat dan modern
- Railway & Vercel untuk hosting yang mudah

---

**Made with ❤️ by Salsanabila Tech**

⭐ Jangan lupa kasih star kalau project ini membantu!
