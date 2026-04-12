# 🚀 Panduan Deploy Smartphone Finder

## 📋 Persiapan

### 1. Install Dependencies Backend
```bash
cd spk-backend
npm install dotenv
```

### 2. Buat Akun yang Diperlukan
- GitHub: https://github.com
- Vercel: https://vercel.com (untuk frontend)
- Railway: https://railway.app (untuk backend + database)

---

## 🔧 Deploy Backend ke Railway

### Step 1: Push Backend ke GitHub

1. Buat repository baru di GitHub (misal: `smartphone-finder-backend`)

2. Di folder backend, jalankan:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/smartphone-finder-backend.git
git push -u origin main
```

### Step 2: Deploy di Railway

1. Buka https://railway.app dan login dengan GitHub
2. Klik "New Project"
3. Pilih "Deploy from GitHub repo"
4. Pilih repository `smartphone-finder-backend`
5. Railway akan auto-detect Node.js dan deploy

### Step 3: Tambah MySQL Database

1. Di project Railway, klik "New" → "Database" → "Add MySQL"
2. Railway akan create database otomatis
3. Copy credentials yang muncul

### Step 4: Set Environment Variables

Di Railway project settings, tambahkan variables:

```
DB_HOST=<dari Railway MySQL>
DB_USER=<dari Railway MySQL>
DB_PASSWORD=<dari Railway MySQL>
DB_NAME=<dari Railway MySQL>
JWT_SECRET=your-super-secret-key-here-change-this
PORT=3001
```

### Step 5: Get Backend URL

- Railway akan generate URL seperti: `https://smartphone-finder-backend-production.up.railway.app`
- Copy URL ini untuk frontend

---

## 🎨 Deploy Frontend ke Vercel

### Step 1: Update API URL di Frontend

Di `spk-frontend/src`, ganti semua `http://localhost:3001` dengan Railway URL:

Buat file `.env` di folder `spk-frontend`:
```
VITE_API_URL=https://your-railway-url.up.railway.app
```

Update semua axios calls untuk menggunakan env variable:
```javascript
// Contoh:
axios.get(`${import.meta.env.VITE_API_URL}/profile`)
```

### Step 2: Push Frontend ke GitHub

1. Buat repository baru (misal: `smartphone-finder-frontend`)

2. Di folder `spk-frontend`:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/smartphone-finder-frontend.git
git push -u origin main
```

### Step 3: Deploy di Vercel

1. Buka https://vercel.com dan login dengan GitHub
2. Klik "Add New" → "Project"
3. Import repository `smartphone-finder-frontend`
4. Framework Preset: Vite
5. Root Directory: `./` (atau `spk-frontend` jika push dari root)
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Environment Variables:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
9. Klik "Deploy"

### Step 4: Update CORS di Backend

Di `index.js`, update CORS:
```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://your-vercel-app.vercel.app'
    ],
    credentials: true
}));
```

Push update ke GitHub, Railway akan auto-redeploy.

---

## ✅ Testing

1. Buka URL Vercel kamu
2. Test register user baru
3. Test login
4. Test tambah smartphone
5. Test analisis

---

## 🔒 Security Checklist

- ✅ Ganti JWT_SECRET dengan string random yang kuat
- ✅ Jangan commit file `.env` ke GitHub
- ✅ Set CORS hanya untuk domain yang diizinkan
- ✅ Gunakan HTTPS (Railway & Vercel sudah otomatis)

---

## 📝 Troubleshooting

### Database Connection Error
- Cek environment variables di Railway
- Pastikan MySQL service running
- Cek logs di Railway dashboard

### CORS Error
- Pastikan frontend URL sudah ditambahkan di CORS backend
- Cek Network tab di browser untuk lihat error detail

### Build Failed
- Cek logs di Vercel/Railway
- Pastikan semua dependencies ter-install
- Cek Node.js version compatibility

---

## 🎉 Selesai!

Website kamu sekarang live di:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.up.railway.app`

Setiap kali push ke GitHub, akan auto-deploy! 🚀
