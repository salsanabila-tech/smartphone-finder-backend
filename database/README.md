# 📊 Database Documentation - Smartphone Finder

## 📁 File Database

File ini berisi schema dan sample data untuk project Smartphone Finder.

### File yang Tersedia:

1. **schema.sql** - Schema lengkap database dengan sample data

## 🚀 Cara Import Database

### Opsi 1: Via MySQL Command Line

```bash
# Login ke MySQL
mysql -u root -p

# Import database
source /path/to/database/schema.sql

# Atau langsung
mysql -u root -p < database/schema.sql
```

### Opsi 2: Via phpMyAdmin

1. Buka phpMyAdmin
2. Klik tab "Import"
3. Pilih file `schema.sql`
4. Klik "Go"

### Opsi 3: Via MySQL Workbench

1. Buka MySQL Workbench
2. File → Run SQL Script
3. Pilih file `schema.sql`
4. Execute

## 📋 Struktur Database

### Database: `spk_smartphone`

### Tabel:

#### 1. **users**
Menyimpan data pengguna aplikasi.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| username | VARCHAR(50) | Username unik |
| email | VARCHAR(100) | Email unik |
| password | VARCHAR(255) | Password ter-hash (bcrypt) |
| created_at | TIMESTAMP | Waktu registrasi |

**Sample Data:**
- Username: `admin`, Password: `123456`
- Username: `johndoe`, Password: `123456`
- Username: `janedoe`, Password: `123456`

---

#### 2. **smartphone**
Menyimpan data smartphone untuk analisis SPK.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| user_id | INT | ID user yang menambahkan |
| nama_hp | VARCHAR(100) | Nama smartphone |
| harga | INT | Harga dalam Rupiah |
| berat | INT | Berat dalam gram |
| kamera | INT | Resolusi kamera (MP) |
| keunikan | INT | Nilai keunikan (1-10) |
| ram | INT | Kapasitas RAM (GB) |
| created_at | TIMESTAMP | Waktu ditambahkan |

**Sample Data:**
- Samsung Galaxy S23
- iPhone 15 Pro
- Xiaomi 13 Pro
- OPPO Find X6 Pro
- Vivo X90 Pro
- Realme GT 3
- OnePlus 11
- Google Pixel 8 Pro

---

#### 3. **user_activities**
Menyimpan tracking aktivitas pengguna.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| user_id | INT | Foreign key ke users |
| activity_type | VARCHAR(50) | Jenis aktivitas |
| created_at | TIMESTAMP | Waktu aktivitas |

**Activity Types:**
- `analysis` - User melakukan analisis SAW
- `saved_item` - User menambah smartphone
- `comparison` - User melihat grafik perbandingan

---

## 🔍 Views

### 1. **user_statistics**
Menampilkan statistik aktivitas per user.

```sql
SELECT * FROM user_statistics;
```

### 2. **smartphone_ranking**
Menampilkan smartphone dengan ranking berdasarkan SAW.

```sql
SELECT * FROM smartphone_ranking;
```

---

## 📊 Stored Procedures

### 1. **calculate_saw()**
Menghitung ranking menggunakan metode SAW.

```sql
CALL calculate_saw();
```

---

## 🔐 Triggers

### 1. **validate_smartphone_before_insert**
Validasi data sebelum insert ke tabel smartphone.

**Validasi:**
- Harga > 0
- RAM > 0
- Kamera > 0
- Berat > 0
- Keunikan antara 1-10

---

## 📈 Metode SAW (Simple Additive Weighting)

### Kriteria & Bobot:

| Kriteria | Bobot | Jenis |
|----------|-------|-------|
| Harga | 30% | Cost (min) |
| Kamera | 25% | Benefit (max) |
| RAM | 20% | Benefit (max) |
| Berat | 15% | Cost (min) |
| Keunikan | 10% | Benefit (max) |

### Formula:

```
Score = (0.3 × R_harga) + (0.25 × R_kamera) + (0.2 × R_ram) + (0.15 × R_berat) + (0.1 × R_keunikan)
```

**Normalisasi:**
- **Cost:** R = min(nilai) / nilai_i
- **Benefit:** R = nilai_i / max(nilai)

---

## 🧪 Query Testing

### Melihat semua smartphone dengan ranking:
```sql
SELECT * FROM smartphone_ranking ORDER BY ranking;
```

### Melihat statistik user:
```sql
SELECT * FROM user_statistics;
```

### Menghitung SAW manual:
```sql
CALL calculate_saw();
```

### Melihat aktivitas user tertentu:
```sql
SELECT * FROM user_activities 
WHERE user_id = 1 
ORDER BY created_at DESC;
```

### Melihat smartphone termurah:
```sql
SELECT * FROM smartphone 
ORDER BY harga ASC 
LIMIT 5;
```

### Melihat smartphone dengan RAM terbesar:
```sql
SELECT * FROM smartphone 
ORDER BY ram DESC 
LIMIT 5;
```

---

## 🔧 Maintenance

### Backup Database:
```bash
mysqldump -u root -p spk_smartphone > backup_$(date +%Y%m%d).sql
```

### Restore Database:
```bash
mysql -u root -p spk_smartphone < backup_20240115.sql
```

### Reset Database:
```sql
DROP DATABASE IF EXISTS spk_smartphone;
source schema.sql;
```

---

## 📝 Notes

1. **Password Default:** Semua user sample menggunakan password `123456`
2. **Charset:** Database menggunakan `utf8mb4` untuk mendukung emoji
3. **Engine:** Menggunakan InnoDB untuk mendukung foreign keys
4. **Indexes:** Sudah ditambahkan untuk optimasi query
5. **Sample Data:** Berisi 3 users dan 8 smartphones untuk testing

---

## 🆘 Troubleshooting

### Error: "Access denied for user"
```bash
# Reset password MySQL
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Error: "Database already exists"
```sql
DROP DATABASE spk_smartphone;
source schema.sql;
```

### Error: "Table already exists"
```sql
DROP TABLE IF EXISTS user_activities;
DROP TABLE IF EXISTS smartphone;
DROP TABLE IF EXISTS users;
source schema.sql;
```

---

## 📞 Support

Jika ada pertanyaan tentang database, silakan hubungi developer atau buka issue di GitHub repository.

---

**Last Updated:** January 2024
