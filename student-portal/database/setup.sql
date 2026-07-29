-- ============================================================
--  STUDENT PORTAL  –  Complete MySQL Setup Script
--  Run this file once to create the database and all tables.
--  Command: mysql -u root -p < setup.sql
-- ============================================================

-- 1. Create the database (skip if it already exists)
CREATE DATABASE IF NOT EXISTS student_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_portal;

-- ============================================================
-- 2. TABLE: admin
--    Stores admin login credentials.
--    An initial admin account is seeded below.
-- ============================================================
CREATE TABLE IF NOT EXISTS admin (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. TABLE: students
--    Each student gets a unique student_id (e.g. STU-0001)
--    and a bcrypt-hashed password.
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  student_id    VARCHAR(20)  NOT NULL UNIQUE,   -- e.g. STU-0001
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  class         VARCHAR(50)  NOT NULL,           -- e.g. CSE-A, MCA-2
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. TABLE: marks
--    Stores subject-wise marks for each student.
--    subject_name is free text (e.g. "Mathematics").
-- ============================================================
CREATE TABLE IF NOT EXISTS marks (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  student_id      VARCHAR(20)  NOT NULL,
  subject_name    VARCHAR(100) NOT NULL,
  marks_obtained  INT          NOT NULL DEFAULT 0,
  max_marks       INT          NOT NULL DEFAULT 100,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 5. Seed: admin account
--    Replace the placeholder hash below with your own bcrypt hash
--    before running this script in production.
--    Generate a hash: node -e "require('bcrypt').hash('YourPassword',10).then(h=>console.log(h))"
-- ============================================================
INSERT INTO admin (username, password_hash) VALUES (
  'admin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
) ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- 6. Verify everything was created
-- ============================================================
SHOW TABLES;
SELECT 'Database setup complete!' AS status;
