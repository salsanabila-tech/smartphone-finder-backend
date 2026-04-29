const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5174',
            'https://smartphone-finder-backend-production.up.railway.app',
            'https://smartphone-finder-backend.vercel.app',
            'https://smartphone-finder-backend-git-main-salsanabila-techs-projects.vercel.app',
            'https://smartphone-finder-backend-iqusm8vg1-salsanabila-techs-projects.vercel.app'
        ];
        
        // Allow all localhost origins for development
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Smartphone Finder API is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req, res) => {
    // Test database connection
    db.ping((err) => {
        if (err) {
            console.error("Health check failed:", err);
            return res.status(503).json({
                status: "ERROR",
                database: "disconnected",
                error: err.message
            });
        }
        
        res.json({
            status: "OK",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    });
});

// ======================
// KONEKSI DATABASE
// ======================
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "spk_smartphone",
    port: process.env.DB_PORT || 3306,
});

// cek koneksi
db.connect((err) => {
    if (err) {
        console.error("❌ Koneksi MySQL GAGAL!");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        console.error("Error Stack:", err.stack);
        console.error("DB Config:", {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        // Jangan exit, biarkan Railway restart otomatis
    } else {
        console.log("✅ Koneksi MySQL berhasil!");
        console.log("Connected to:", process.env.DB_HOST);
        
        // Cek apakah tabel users sudah ada
        db.query("SHOW TABLES LIKE 'users'", (err, result) => {
            if (err) {
                console.log("Error checking table:", err);
                return;
            }
            
            if (result.length === 0) {
                // Tabel belum ada, buat baru
                const createTableQuery = `
                    CREATE TABLE users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                
                db.query(createTableQuery, (err) => {
                    if (err) {
                        console.log("Error membuat tabel users:", err);
                    } else {
                        console.log("Tabel users berhasil dibuat 🔥");
                    }
                });
            } else {
                // Tabel sudah ada, cek apakah kolom email ada
                db.query("SHOW COLUMNS FROM users LIKE 'email'", (err, result) => {
                    if (err) {
                        console.log("Error checking column:", err);
                        return;
                    }
                    
                    if (result.length === 0) {
                        // Kolom email belum ada, tambahkan
                        db.query("ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE AFTER username", (err) => {
                            if (err) {
                                console.log("Error menambah kolom email:", err);
                            } else {
                                console.log("Kolom email berhasil ditambahkan 🔥");
                            }
                        });
                    }
                });
                
                // Cek apakah kolom created_at ada
                db.query("SHOW COLUMNS FROM users LIKE 'created_at'", (err, result) => {
                    if (err) {
                        console.log("Error checking created_at column:", err);
                        return;
                    }
                    
                    if (result.length === 0) {
                        // Kolom created_at belum ada, tambahkan
                        db.query("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP", (err) => {
                            if (err) {
                                console.log("Error menambah kolom created_at:", err);
                            } else {
                                console.log("Kolom created_at berhasil ditambahkan 🔥");
                            }
                        });
                    } else {
                        console.log("Tabel users sudah siap 🔥");
                    }
                });
            }
        });
        
        // Buat tabel smartphone jika belum ada
        const createSmartphoneTable = `
            CREATE TABLE IF NOT EXISTS smartphone (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT DEFAULT 1,
                nama_hp VARCHAR(100) NOT NULL,
                harga INT NOT NULL,
                berat INT NOT NULL,
                kamera INT NOT NULL,
                keunikan INT NOT NULL,
                ram INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        db.query(createSmartphoneTable, (err) => {
            if (err) {
                console.log("Error membuat tabel smartphone:", err);
            } else {
                console.log("Tabel smartphone siap 🔥");
            }
        });
        
        // Buat tabel user_activities untuk tracking
        const createActivitiesTable = `
            CREATE TABLE IF NOT EXISTS user_activities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                activity_type VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        
        db.query(createActivitiesTable, (err) => {
            if (err) {
                console.log("Error membuat tabel user_activities:", err);
            } else {
                console.log("Tabel user_activities siap 🔥");
            }
        });
    }
});

// ======================
// REGISTER
// ======================
app.post("/register", async (req, res) => {
    console.log("Register request received:", req.body);
    
    const { username, email, password } = req.body;

    // Validasi input
    if (!username || !email || !password) {
        console.log("Validation failed: missing fields");
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    if (password.length < 6) {
        console.log("Validation failed: password too short");
        return res.status(400).json({ message: "Password minimal 6 karakter!" });
    }

    // Cek apakah username sudah ada
    db.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email],
        async (err, result) => {
            if (err) {
                console.error("Database error on SELECT:", err);
                return res.status(500).json({ message: "Database error", error: err.message });
            }

            if (result.length > 0) {
                console.log("User already exists");
                return res.status(400).json({ message: "Username atau email sudah terdaftar!" });
            }

            try {
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log("Password hashed successfully");

                // Insert user baru
                db.query(
                    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                    [username, email, hashedPassword],
                    (err, result) => {
                        if (err) {
                            console.error("Database error on INSERT:", err);
                            return res.status(500).json({ message: "Gagal mendaftar", error: err.message });
                        }

                        console.log("User registered successfully:", result.insertId);
                        res.status(201).json({ 
                            message: "Registrasi berhasil!",
                            userId: result.insertId 
                        });
                    }
                );
            } catch (error) {
                console.error("Error hashing password:", error);
                res.status(500).json({ message: "Server error", error: error.message });
            }
        }
    );
});

// ======================
// LOGIN
// ======================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password harus diisi!" });
    }

    // Cek user di database
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: "Username tidak ditemukan!" });
            }

            const user = result[0];

            // Cek password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Password salah!" });
            }

            // Buat token
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET || "SECRET_KEY",
                { expiresIn: "1h" }
            );

            res.json({ 
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    );
});

// ======================
// GET USER PROFILE
// ======================
app.get("/profile", (req, res) => {
    console.log("Profile request received");
    console.log("Headers:", req.headers);
    
    // Ambil token dari header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        console.log("No authorization header");
        return res.status(401).json({ message: "Token tidak ditemukan!" });
    }

    console.log("Auth header:", authHeader);
    const token = authHeader.split(" ")[1]; // Format: "Bearer TOKEN"
    console.log("Token extracted:", token);

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
        console.log("Token decoded:", decoded);
        
        // Ambil data user dari database
        db.query(
            "SELECT id, username, email, created_at FROM users WHERE id = ?",
            [decoded.id],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Database error", error: err.message });
                }

                console.log("Query result:", result);

                if (result.length === 0) {
                    console.log("User not found");
                    return res.status(404).json({ message: "User tidak ditemukan!" });
                }

                const user = result[0];
                
                const responseData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: "User",
                    joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                    })
                };
                
                console.log("Sending response:", responseData);
                res.json(responseData);
            }
        );
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Token tidak valid!", error: error.message });
    }
});

// ======================
// GET USER STATISTICS
// ======================
app.get("/user-stats", (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Token tidak ditemukan!" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
        
        // Hitung total analyses
        db.query(
            "SELECT COUNT(*) as total FROM user_activities WHERE user_id = ? AND activity_type = 'analysis'",
            [decoded.id],
            (err, analysisResult) => {
                if (err) {
                    return res.status(500).json({ message: "Database error", error: err.message });
                }

                // Hitung saved items
                db.query(
                    "SELECT COUNT(*) as savedItems FROM user_activities WHERE user_id = ? AND activity_type = 'saved_item'",
                    [decoded.id],
                    (err, savedResult) => {
                        if (err) {
                            return res.status(500).json({ message: "Database error", error: err.message });
                        }

                        // Hitung comparisons
                        db.query(
                            "SELECT COUNT(*) as comparisons FROM user_activities WHERE user_id = ? AND activity_type = 'comparison'",
                            [decoded.id],
                            (err, comparisonResult) => {
                                if (err) {
                                    return res.status(500).json({ message: "Database error", error: err.message });
                                }

                                // Hitung analyses minggu ini
                                db.query(
                                    "SELECT COUNT(*) as thisWeek FROM user_activities WHERE user_id = ? AND activity_type = 'analysis' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
                                    [decoded.id],
                                    (err, weekResult) => {
                                        if (err) {
                                            return res.status(500).json({ message: "Database error", error: err.message });
                                        }

                                        res.json({
                                            totalAnalyses: analysisResult[0].total,
                                            savedItems: savedResult[0].savedItems,
                                            comparisons: comparisonResult[0].comparisons,
                                            thisWeek: weekResult[0].thisWeek
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        return res.status(401).json({ message: "Token tidak valid!", error: error.message });
    }
});

// ======================
// TRACK USER ACTIVITY
// ======================
app.post("/track-activity", (req, res) => {
    const authHeader = req.headers.authorization;
    const { activityType } = req.body;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Token tidak ditemukan!" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
        
        db.query(
            "INSERT INTO user_activities (user_id, activity_type) VALUES (?, ?)",
            [decoded.id, activityType],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Database error", error: err.message });
                }

                res.json({ message: "Activity tracked successfully" });
            }
        );
    } catch (error) {
        return res.status(401).json({ message: "Token tidak valid!", error: error.message });
    }
});

// ======================
// GET DATA HP
// ======================
app.get("/smartphones", (req, res) => {
    console.log("GET /smartphones request received");
    
    db.query("SELECT * FROM smartphone", (err, result) => {
        if (err) {
            console.error("Error fetching smartphones:", err);
            return res.status(500).json({ 
                error: "Database error", 
                message: err.message 
            });
        }
        
        console.log("Smartphones fetched:", result.length, "items");
        
        // Pastikan selalu return array
        const smartphones = Array.isArray(result) ? result : [];
        res.json(smartphones);
    });
});

// ======================
// TAMBAH DATA HP
// ======================
app.post("/smartphones", (req, res) => {
    console.log("POST /smartphones request received:", req.body);
    
    const { nama_hp, harga, berat, kamera, keunikan, ram } = req.body;

    // Validasi input
    if (!nama_hp || !harga || !berat || !kamera || !keunikan || !ram) {
        return res.status(400).json({ 
            error: "Validation error",
            message: "Semua field harus diisi!" 
        });
    }

    const sql = `
        INSERT INTO smartphone (user_id, nama_hp, harga, berat, kamera, keunikan, ram)
        VALUES (1, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nama_hp, harga, berat, kamera, keunikan, ram],
        (err, result) => {
            if (err) {
                console.error("Error inserting smartphone:", err);
                return res.status(500).json({ 
                    error: "Database error",
                    message: err.message 
                });
            }
            
            console.log("Smartphone added successfully, ID:", result.insertId);
            
            res.status(201).json({ 
                message: "Data berhasil ditambahkan",
                id: result.insertId,
                data: {
                    id: result.insertId,
                    nama_hp,
                    harga,
                    berat,
                    kamera,
                    keunikan,
                    ram
                }
            });
        }
    );
});

// ======================
// DELETE DATA
// ======================
app.delete("/smartphones/:id", (req, res) => {
    console.log("DELETE /smartphones request for ID:", req.params.id);
    
    db.query("DELETE FROM smartphone WHERE id=?", [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting smartphone:", err);
            return res.status(500).json({ 
                error: "Database error",
                message: err.message 
            });
        }
        
        console.log("Smartphone deleted successfully");
        res.json({ message: "Data berhasil dihapus" });
    });
});

// ======================
// SAW (PERHITUNGAN SPK)
// ======================
app.get("/saw", (req, res) => {
    console.log("GET /saw request received");
    
    db.query("SELECT * FROM smartphone", (err, data) => {
        if (err) {
            console.error("Error in SAW calculation:", err);
            return res.status(500).json({ 
                error: "Database error",
                message: err.message 
            });
        }

        console.log("SAW calculation for", data.length, "smartphones");

        if (data.length === 0) {
            console.log("No smartphones found, returning empty array");
            return res.json([]);
        }

        let minHarga = Math.min(...data.map((d) => d.harga));
        let minBerat = Math.min(...data.map((d) => d.berat));

        let maxKamera = Math.max(...data.map((d) => d.kamera));
        let maxKeunikan = Math.max(...data.map((d) => d.keunikan));
        let maxRam = Math.max(...data.map((d) => d.ram));

        let hasil = data.map((d) => {
            let rHarga = minHarga / d.harga;
            let rBerat = minBerat / d.berat;
            let rKamera = d.kamera / maxKamera;
            let rKeunikan = d.keunikan / maxKeunikan;
            let rRam = d.ram / maxRam;

            let scoreHarga = 0.3 * rHarga;
            let scoreBerat = 0.15 * rBerat;
            let scoreKamera = 0.25 * rKamera;
            let scoreKeunikan = 0.1 * rKeunikan;
            let scoreRam = 0.2 * rRam;

            let totalScore = scoreHarga + scoreBerat + scoreKamera + scoreKeunikan + scoreRam;

            return {
                id: d.id,
                nama_hp: d.nama_hp,
                score: totalScore,
                // Data asli
                data: {
                    harga: d.harga,
                    berat: d.berat,
                    kamera: d.kamera,
                    keunikan: d.keunikan,
                    ram: d.ram
                },
                // Nilai normalisasi
                normalized: {
                    harga: rHarga,
                    berat: rBerat,
                    kamera: rKamera,
                    keunikan: rKeunikan,
                    ram: rRam
                },
                // Score per kriteria
                breakdown: {
                    harga: scoreHarga,
                    berat: scoreBerat,
                    kamera: scoreKamera,
                    keunikan: scoreKeunikan,
                    ram: scoreRam
                },
                // Min/Max untuk referensi
                reference: {
                    minHarga,
                    minBerat,
                    maxKamera,
                    maxKeunikan,
                    maxRam
                }
            };
        });

        hasil.sort((a, b) => b.score - a.score);

        console.log("SAW calculation complete, top score:", hasil[0]?.score);
        res.json(hasil);
    });
});

// ======================
// JALANKAN SERVER
// ======================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT} 🔥`);
});
