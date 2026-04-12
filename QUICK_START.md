# ⚡ Quick Start - Deploy dalam 10 Menit!

## 🎯 Ringkasan Cepat

1. **Backend** → Railway (gratis $5/bulan)
2. **Frontend** → Vercel (gratis unlimited)
3. **Database** → Railway MySQL (included)

---

## 📦 Langkah Cepat

### 1️⃣ Persiapan (2 menit)
```bash
# Install dotenv di backend
cd spk-backend
npm install dotenv
cd ..
```

### 2️⃣ Backend ke Railway (3 menit)

1. Push backend ke GitHub:
```bash
# Di folder root project
git init
git add .
git commit -m "Ready for deployment"
git push
```

2. Buka https://railway.app
3. "New Project" → "Deploy from GitHub"
4. Pilih repo → Auto deploy!
5. "New" → "Database" → "MySQL"
6. Set environment variables (copy dari Railway MySQL):
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET=ganti-dengan-string-random`

7. Copy Railway URL (contoh: `https://xxx.up.railway.app`)

### 3️⃣ Frontend ke Vercel (3 menit)

1. Buat `.env` di `spk-frontend`:
```
VITE_API_URL=https://your-railway-url.up.railway.app
```

2. Update semua `http://localhost:3001` di code dengan `import.meta.env.VITE_API_URL`

3. Push ke GitHub

4. Buka https://vercel.com
5. "New Project" → Import repo
6. Framework: Vite
7. Add environment variable: `VITE_API_URL`
8. Deploy!

### 4️⃣ Update CORS (1 menit)

Di `index.js`, ganti:
```javascript
app.use(cors());
```

Dengan:
```javascript
app.use(cors({
    origin: ['https://your-vercel-app.vercel.app'],
    credentials: true
}));
```

Push ke GitHub → Railway auto-redeploy!

### 5️⃣ Test (1 menit)

Buka Vercel URL → Register → Login → Test fitur!

---

## 🎉 Done!

Website live di:
- 🌐 Frontend: `https://your-app.vercel.app`
- ⚙️ Backend: `https://your-backend.up.railway.app`

Auto-deploy setiap push ke GitHub! 🚀

---

## 💡 Tips

- Railway: $5 credit gratis/bulan (cukup untuk project kecil)
- Vercel: Unlimited gratis
- Custom domain: Bisa ditambahkan gratis di Vercel
- Monitoring: Cek logs di Railway/Vercel dashboard

## ❓ Butuh Bantuan?

Lihat `DEPLOYMENT_GUIDE.md` untuk panduan lengkap!
