# 📚 API Documentation

Dokumentasi lengkap untuk Smartphone Finder Backend API.

**Base URL:** `https://smartphone-finder-backend-production.up.railway.app`

**Local Development:** `http://localhost:3001`

## 📋 Table of Contents

- [Authentication](#authentication)
- [Smartphones](#smartphones)
- [SAW Algorithm](#saw-algorithm)
- [User Profile](#user-profile)
- [Activity Tracking](#activity-tracking)
- [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register User

Mendaftarkan user baru ke sistem.

**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `username`: Required, unique
- `email`: Required, unique, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "message": "Registrasi berhasil!",
  "userId": 1
}
```

**Error Responses:**

400 - Validation Error:
```json
{
  "message": "Semua field harus diisi!"
}
```

400 - User Already Exists:
```json
{
  "message": "Username atau email sudah terdaftar!"
}
```

**Example:**
```bash
curl -X POST https://smartphone-finder-backend-production.up.railway.app/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### Login User

Login dan mendapatkan JWT token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

401 - Invalid Credentials:
```json
{
  "message": "Username tidak ditemukan!"
}
```

401 - Wrong Password:
```json
{
  "message": "Password salah!"
}
```

**Example:**
```bash
curl -X POST https://smartphone-finder-backend-production.up.railway.app/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

---

## 📱 Smartphones

### Get All Smartphones

Mendapatkan semua data smartphone.

**Endpoint:** `GET /smartphones`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "nama_hp": "Samsung Galaxy S23",
    "harga": 12000000,
    "ram": 8,
    "kamera": 50,
    "berat": 168,
    "keunikan": 8,
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "nama_hp": "iPhone 15 Pro",
    "harga": 18000000,
    "ram": 8,
    "kamera": 48,
    "berat": 187,
    "keunikan": 9,
    "created_at": "2024-01-15T11:00:00.000Z"
  }
]
```

**Example:**
```bash
curl https://smartphone-finder-backend-production.up.railway.app/smartphones
```

---

### Add Smartphone

Menambahkan smartphone baru.

**Endpoint:** `POST /smartphones`

**Request Body:**
```json
{
  "nama_hp": "Samsung Galaxy S23",
  "harga": 12000000,
  "ram": 8,
  "kamera": 50,
  "berat": 168,
  "keunikan": 8
}
```

**Field Descriptions:**
- `nama_hp`: Nama smartphone (string)
- `harga`: Harga dalam Rupiah (number, > 0)
- `ram`: Kapasitas RAM dalam GB (number, > 0)
- `kamera`: Resolusi kamera dalam MP (number, > 0)
- `berat`: Berat dalam gram (number, > 0)
- `keunikan`: Nilai keunikan 1-10 (number, > 0)

**Success Response (201):**
```json
{
  "message": "Data berhasil ditambahkan",
  "id": 1,
  "data": {
    "id": 1,
    "nama_hp": "Samsung Galaxy S23",
    "harga": 12000000,
    "ram": 8,
    "kamera": 50,
    "berat": 168,
    "keunikan": 8
  }
}
```

**Error Response (400):**
```json
{
  "error": "Validation error",
  "message": "Semua field harus diisi!"
}
```

**Example:**
```bash
curl -X POST https://smartphone-finder-backend-production.up.railway.app/smartphones \
  -H "Content-Type: application/json" \
  -d '{
    "nama_hp": "Samsung Galaxy S23",
    "harga": 12000000,
    "ram": 8,
    "kamera": 50,
    "berat": 168,
    "keunikan": 8
  }'
```

---

### Delete Smartphone

Menghapus smartphone berdasarkan ID.

**Endpoint:** `DELETE /smartphones/:id`

**URL Parameters:**
- `id`: ID smartphone (number)

**Success Response (200):**
```json
{
  "message": "Data berhasil dihapus"
}
```

**Example:**
```bash
curl -X DELETE https://smartphone-finder-backend-production.up.railway.app/smartphones/1
```

---

## 📊 SAW Algorithm

### Get Ranking

Mendapatkan ranking smartphone berdasarkan perhitungan SAW.

**Endpoint:** `GET /saw`

**Algorithm:**
Menggunakan metode Simple Additive Weighting (SAW) dengan kriteria:
- Harga (30%) - Cost
- Berat (15%) - Cost
- Kamera (25%) - Benefit
- Keunikan (10%) - Benefit
- RAM (20%) - Benefit

**Success Response (200):**
```json
[
  {
    "id": 1,
    "nama_hp": "Samsung Galaxy S23",
    "score": 0.8523
  },
  {
    "id": 2,
    "nama_hp": "iPhone 15 Pro",
    "score": 0.7891
  },
  {
    "id": 3,
    "nama_hp": "Xiaomi 13 Pro",
    "score": 0.7234
  }
]
```

**Note:** 
- Data diurutkan dari score tertinggi ke terendah
- Score berkisar antara 0-1
- Jika tidak ada data smartphone, return empty array `[]`

**Example:**
```bash
curl https://smartphone-finder-backend-production.up.railway.app/saw
```

---

## 👤 User Profile

### Get User Profile

Mendapatkan data profile user yang sedang login.

**Endpoint:** `GET /profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "User",
  "joinDate": "January 2024"
}
```

**Error Responses:**

401 - No Token:
```json
{
  "message": "Token tidak ditemukan!"
}
```

401 - Invalid Token:
```json
{
  "message": "Token tidak valid!"
}
```

404 - User Not Found:
```json
{
  "message": "User tidak ditemukan!"
}
```

**Example:**
```bash
curl https://smartphone-finder-backend-production.up.railway.app/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Get User Statistics

Mendapatkan statistik aktivitas user.

**Endpoint:** `GET /user-stats`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "totalAnalyses": 15,
  "savedItems": 8,
  "comparisons": 12,
  "thisWeek": 5
}
```

**Field Descriptions:**
- `totalAnalyses`: Total klik "Mulai Analisis"
- `savedItems`: Total smartphone yang ditambahkan
- `comparisons`: Total kali melihat grafik
- `thisWeek`: Total analyses dalam 7 hari terakhir

**Example:**
```bash
curl https://smartphone-finder-backend-production.up.railway.app/user-stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📈 Activity Tracking

### Track User Activity

Mencatat aktivitas user.

**Endpoint:** `POST /track-activity`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "activityType": "analysis"
}
```

**Activity Types:**
- `analysis`: Ketika user klik "Mulai Analisis"
- `saved_item`: Ketika user menambah smartphone
- `comparison`: Ketika user melihat grafik

**Success Response (200):**
```json
{
  "message": "Activity tracked successfully"
}
```

**Example:**
```bash
curl -X POST https://smartphone-finder-backend-production.up.railway.app/track-activity \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "activityType": "analysis"
  }'
```

---

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

### Common Errors

**Database Connection Error:**
```json
{
  "error": "Database error",
  "message": "Connection failed"
}
```

**JWT Token Expired:**
```json
{
  "message": "Token tidak valid!",
  "error": "jwt expired"
}
```

**CORS Error:**
Pastikan origin sudah ditambahkan di backend CORS configuration.

---

## 🔒 Security

### JWT Token
- Token expires dalam 1 jam
- Token harus disimpan di localStorage
- Kirim token di header: `Authorization: Bearer <token>`

### Password
- Minimum 6 karakter
- Di-hash menggunakan bcrypt dengan salt rounds 10
- Tidak pernah di-return dalam response

### CORS
Allowed origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `https://smartphone-finder-backend.vercel.app`
- `https://smartphone-finder-backend-production.up.railway.app`

---

## 📝 Rate Limiting

Saat ini tidak ada rate limiting. Untuk production, disarankan menambahkan:
- Rate limiting per IP
- Request throttling
- API key untuk external access

---

## 🧪 Testing

### Postman Collection

Import collection ini ke Postman untuk testing:

```json
{
  "info": {
    "name": "Smartphone Finder API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\"\n}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"password\": \"123456\"\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://smartphone-finder-backend-production.up.railway.app"
    }
  ]
}
```

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan buka issue di GitHub repository.

---

**Last Updated:** January 2024
