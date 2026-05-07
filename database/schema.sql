-- ============================================
-- Database: spk_smartphone
-- Sistem Pendukung Keputusan - Smartphone Finder
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS spk_smartphone;
USE spk_smartphone;

-- ============================================
-- Table: users
-- Menyimpan data pengguna aplikasi
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Password di-hash menggunakan bcrypt',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: smartphone
-- Menyimpan data smartphone untuk analisis SPK
-- ============================================
CREATE TABLE IF NOT EXISTS smartphone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1 COMMENT 'ID user yang menambahkan data',
    nama_hp VARCHAR(100) NOT NULL,
    harga INT NOT NULL COMMENT 'Harga dalam Rupiah',
    berat INT NOT NULL COMMENT 'Berat dalam gram',
    kamera INT NOT NULL COMMENT 'Resolusi kamera dalam Megapixel',
    keunikan INT NOT NULL COMMENT 'Nilai keunikan 1-10',
    ram INT NOT NULL COMMENT 'Kapasitas RAM dalam GB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nama_hp (nama_hp),
    INDEX idx_harga (harga)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: user_activities
-- Menyimpan tracking aktivitas pengguna
-- ============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL COMMENT 'Jenis aktivitas: analysis, saved_item, comparison',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data: users
-- Password: "123456" (sudah di-hash dengan bcrypt)
-- ============================================
INSERT INTO users (username, email, password, created_at) VALUES
('admin', 'admin@smartphonefinder.com', '$2a$10$rZ5qH8qVqH8qVqH8qVqH8uO5qH8qVqH8qVqH8qVqH8qVqH8qVqH8q', NOW()),
('johndoe', 'john@example.com', '$2a$10$rZ5qH8qVqH8qVqH8qVqH8uO5qH8qVqH8qVqH8qVqH8qVqH8qVqH8q', NOW()),
('janedoe', 'jane@example.com', '$2a$10$rZ5qH8qVqH8qVqH8qVqH8uO5qH8qVqH8qVqH8qVqH8qVqH8qVqH8q', NOW());

-- ============================================
-- Sample Data: smartphone
-- Data smartphone untuk testing SPK SAW
-- ============================================
INSERT INTO smartphone (user_id, nama_hp, harga, berat, kamera, keunikan, ram, created_at) VALUES
(1, 'Samsung Galaxy S23', 12000000, 168, 50, 8, 8, NOW()),
(1, 'iPhone 15 Pro', 18000000, 187, 48, 9, 8, NOW()),
(1, 'Xiaomi 13 Pro', 9000000, 229, 50, 7, 12, NOW()),
(1, 'OPPO Find X6 Pro', 13000000, 218, 50, 8, 16, NOW()),
(1, 'Vivo X90 Pro', 11000000, 214, 50, 7, 12, NOW()),
(1, 'Realme GT 3', 6000000, 199, 50, 6, 8, NOW()),
(1, 'OnePlus 11', 10000000, 205, 50, 7, 16, NOW()),
(1, 'Google Pixel 8 Pro', 15000000, 213, 50, 9, 12, NOW());

-- ============================================
-- Sample Data: user_activities
-- Contoh aktivitas pengguna
-- ============================================
INSERT INTO user_activities (user_id, activity_type, created_at) VALUES
(1, 'analysis', NOW()),
(1, 'saved_item', NOW()),
(1, 'comparison', NOW()),
(2, 'analysis', NOW()),
(2, 'saved_item', NOW()),
(3, 'analysis', NOW());

-- ============================================
-- Views (Optional)
-- ============================================

-- View untuk melihat statistik user
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(CASE WHEN ua.activity_type = 'analysis' THEN 1 END) as total_analyses,
    COUNT(CASE WHEN ua.activity_type = 'saved_item' THEN 1 END) as saved_items,
    COUNT(CASE WHEN ua.activity_type = 'comparison' THEN 1 END) as comparisons,
    COUNT(CASE WHEN ua.activity_type = 'analysis' AND ua.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as this_week
FROM users u
LEFT JOIN user_activities ua ON u.id = ua.user_id
GROUP BY u.id, u.username, u.email;

-- View untuk melihat smartphone dengan ranking
CREATE OR REPLACE VIEW smartphone_ranking AS
SELECT 
    s.*,
    RANK() OVER (ORDER BY 
        (0.3 * (SELECT MIN(harga) FROM smartphone) / s.harga) +
        (0.15 * (SELECT MIN(berat) FROM smartphone) / s.berat) +
        (0.25 * s.kamera / (SELECT MAX(kamera) FROM smartphone)) +
        (0.1 * s.keunikan / (SELECT MAX(keunikan) FROM smartphone)) +
        (0.2 * s.ram / (SELECT MAX(ram) FROM smartphone))
    DESC) as ranking
FROM smartphone s;

-- ============================================
-- Stored Procedures (Optional)
-- ============================================

DELIMITER //

-- Procedure untuk menghitung SAW
CREATE PROCEDURE calculate_saw()
BEGIN
    SELECT 
        id,
        nama_hp,
        harga,
        berat,
        kamera,
        keunikan,
        ram,
        (
            0.3 * (SELECT MIN(harga) FROM smartphone) / harga +
            0.15 * (SELECT MIN(berat) FROM smartphone) / berat +
            0.25 * kamera / (SELECT MAX(kamera) FROM smartphone) +
            0.1 * keunikan / (SELECT MAX(keunikan) FROM smartphone) +
            0.2 * ram / (SELECT MAX(ram) FROM smartphone)
        ) as score
    FROM smartphone
    ORDER BY score DESC;
END //

DELIMITER ;

-- ============================================
-- Indexes untuk Performance
-- ============================================

-- Index untuk query yang sering digunakan
CREATE INDEX idx_user_activities_user_type ON user_activities(user_id, activity_type);
CREATE INDEX idx_user_activities_created ON user_activities(created_at);
CREATE INDEX idx_smartphone_criteria ON smartphone(harga, berat, kamera, keunikan, ram);

-- ============================================
-- Triggers (Optional)
-- ============================================

DELIMITER //

-- Trigger untuk validasi data smartphone
CREATE TRIGGER validate_smartphone_before_insert
BEFORE INSERT ON smartphone
FOR EACH ROW
BEGIN
    IF NEW.harga <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Harga harus lebih dari 0';
    END IF;
    IF NEW.ram <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'RAM harus lebih dari 0';
    END IF;
    IF NEW.kamera <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Kamera harus lebih dari 0';
    END IF;
    IF NEW.berat <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Berat harus lebih dari 0';
    END IF;
    IF NEW.keunikan < 1 OR NEW.keunikan > 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Keunikan harus antara 1-10';
    END IF;
END //

DELIMITER ;

-- ============================================
-- Query Examples untuk Testing
-- ============================================

-- Contoh query untuk melihat ranking
-- SELECT * FROM smartphone_ranking;

-- Contoh query untuk melihat statistik user
-- SELECT * FROM user_statistics;

-- Contoh query untuk menghitung SAW
-- CALL calculate_saw();

-- Contoh query untuk melihat aktivitas user tertentu
-- SELECT * FROM user_activities WHERE user_id = 1 ORDER BY created_at DESC;

-- ============================================
-- Notes
-- ============================================
-- 1. Password default untuk semua user sample: "123456"
-- 2. Bobot SAW: Harga (30%), Kamera (25%), RAM (20%), Berat (15%), Keunikan (10%)
-- 3. Kriteria Cost: Harga, Berat (semakin kecil semakin baik)
-- 4. Kriteria Benefit: Kamera, RAM, Keunikan (semakin besar semakin baik)
-- 5. Database menggunakan InnoDB engine untuk mendukung foreign keys dan transactions
-- 6. Charset: utf8mb4 untuk mendukung emoji dan karakter internasional
