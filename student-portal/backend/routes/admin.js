// ─────────────────────────────────────────────────────────────
//  routes/admin.js  –  All Admin API Routes
//
//  Endpoints:
//    POST /api/admin/login         – Admin login
//    POST /api/admin/logout        – Admin logout
//    GET  /api/admin/check         – Check if admin is logged in
//    POST /api/admin/add-student   – Add new student (auto-generates ID + password)
//    GET  /api/admin/students      – List all students
//    GET  /api/admin/students/:id  – Get one student's details
//    POST /api/admin/marks         – Add or update marks for a student
//    GET  /api/admin/marks/:id     – Get marks for a student
//    DELETE /api/admin/marks/:markId – Delete a single mark row
// ─────────────────────────────────────────────────────────────
const express  = require('express');
const bcrypt   = require('bcrypt');
const router   = express.Router();
const db       = require('../db');
const { requireAdminLogin } = require('../middleware/auth');

function getBodyValue(body, names, fallback = undefined) {
  if (!body) return fallback;
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(body, name) && body[name] !== undefined && body[name] !== null && body[name] !== '') {
      return body[name];
    }
  }
  return fallback;
}

function normalizeStudentRow(student) {
  if (!student) return student;
  return {
    ...student,
    student_id: student.student_id ?? student.studentId,
    studentId: student.student_id ?? student.studentId,
    class: student.class ?? student.className,
    className: student.class ?? student.className
  };
}

function normalizeMarkRow(mark) {
  if (!mark) return mark;
  return {
    ...mark,
    subject_name: mark.subject_name ?? mark.subjectName,
    subjectName: mark.subject_name ?? mark.subjectName,
    marks_obtained: mark.marks_obtained ?? mark.marksObtained,
    marksObtained: mark.marks_obtained ?? mark.marksObtained,
    max_marks: mark.max_marks ?? mark.maxMarks,
    maxMarks: mark.max_marks ?? mark.maxMarks
  };
}

// ── Helper: generate a student ID like STU-0042 ──────────────
async function generateStudentId() {
  // Find the highest existing numeric suffix
  const [rows] = await db.query(
    `SELECT student_id FROM students ORDER BY id DESC LIMIT 1`
  );
  if (rows.length === 0) return 'STU-0001';

  const last   = rows[0].student_id;            // e.g. "STU-0041"
  const num    = parseInt(last.split('-')[1]);   // 41
  const next   = String(num + 1).padStart(4, '0'); // "0042"
  return `STU-${next}`;
}

// ── Helper: generate a random password ───────────────────────
function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

// ── Helper: letter grade from percentage ─────────────────────
function getGrade(obtained, max) {
  const pct = (obtained / max) * 100;
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  return 'F';
}

// ════════════════════════════════════════════
//  POST /api/admin/login
// ════════════════════════════════════════════
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required.' });
  }

  try {
    // Fetch admin record from DB
    const [rows] = await db.query(
      'SELECT * FROM admin WHERE username = ?', [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const admin = rows[0];

    // Compare entered password with stored bcrypt hash
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Save admin info in session
    req.session.admin = { id: admin.id, username: admin.username };

    return res.json({ success: true, message: 'Admin logged in successfully.' });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  POST /api/admin/logout
// ════════════════════════════════════════════
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out.' });
});

// ════════════════════════════════════════════
//  GET /api/admin/check  –  is admin logged in?
// ════════════════════════════════════════════
router.get('/check', (req, res) => {
  if (req.session && req.session.admin) {
    return res.json({ success: true, admin: req.session.admin });
  }
  return res.status(401).json({ success: false });
});

// ════════════════════════════════════════════
//  POST /api/admin/add-student   [PROTECTED]
// ════════════════════════════════════════════
router.post('/add-student', requireAdminLogin, async (req, res) => {
  const name = getBodyValue(req.body, ['name']);
  const studentClass = getBodyValue(req.body, ['class', 'className']);

  if (!name || !studentClass) {
    return res.status(400).json({ success: false, message: 'Name and class are required.' });
  }

  try {
    // Auto-generate student ID and password
    const studentId   = await generateStudentId();
    const plainPass   = generatePassword();
    const saltRounds  = 10;
    const hashedPass  = await bcrypt.hash(plainPass, saltRounds);

    // Insert into DB
    await db.query(
      'INSERT INTO students (student_id, password_hash, name, class) VALUES (?, ?, ?, ?)',
      [studentId, hashedPass, name.trim(), studentClass.trim()]
    );

    // Return the plain password ONCE so admin can share it with the student
    return res.json({
      success:    true,
      message:    'Student added successfully.',
      studentId,
      plainPassword: plainPass,   // show once — not stored anywhere plain
      name:       name.trim(),
      class:      studentClass.trim()
    });
  } catch (err) {
    console.error('Add student error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  GET /api/admin/students   [PROTECTED]
// ════════════════════════════════════════════
router.get('/students', requireAdminLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT student_id, name, class, created_at FROM students ORDER BY created_at DESC'
    );
    return res.json({ success: true, students: rows.map(normalizeStudentRow) });
  } catch (err) {
    console.error('Get students error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  GET /api/admin/students/:id   [PROTECTED]
// ════════════════════════════════════════════
router.get('/students/:id', requireAdminLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT student_id, name, class, created_at FROM students WHERE student_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    return res.json({ success: true, student: normalizeStudentRow(rows[0]) });
  } catch (err) {
    console.error('Get student error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  POST /api/admin/marks   [PROTECTED]
//  Body: { student_id, subject_name, marks_obtained, max_marks }
//  If a record for that subject+student exists → UPDATE, else INSERT
// ════════════════════════════════════════════
router.post('/marks', requireAdminLogin, async (req, res) => {
  const student_id = getBodyValue(req.body, ['student_id', 'studentId']);
  const subject_name = getBodyValue(req.body, ['subject_name', 'subjectName']);
  const marks_obtained = getBodyValue(req.body, ['marks_obtained', 'marksObtained']);
  const max_marks = getBodyValue(req.body, ['max_marks', 'maxMarks']);

  if (!student_id || !subject_name || marks_obtained == null || !max_marks) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (parseInt(marks_obtained) > parseInt(max_marks)) {
    return res.status(400).json({ success: false, message: 'Marks obtained cannot exceed max marks.' });
  }

  try {
    // Check if student exists
    const [student] = await db.query(
      'SELECT student_id FROM students WHERE student_id = ?', [student_id]
    );
    if (student.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Upsert: update if exists, insert if not
    const [existing] = await db.query(
      'SELECT id FROM marks WHERE student_id = ? AND subject_name = ?',
      [student_id, subject_name.trim()]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE marks SET marks_obtained = ?, max_marks = ? WHERE student_id = ? AND subject_name = ?',
        [marks_obtained, max_marks, student_id, subject_name.trim()]
      );
      return res.json({ success: true, message: 'Marks updated successfully.' });
    } else {
      await db.query(
        'INSERT INTO marks (student_id, subject_name, marks_obtained, max_marks) VALUES (?, ?, ?, ?)',
        [student_id, subject_name.trim(), marks_obtained, max_marks]
      );
      return res.json({ success: true, message: 'Marks added successfully.' });
    }
  } catch (err) {
    console.error('Add/update marks error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  GET /api/admin/marks/:studentId   [PROTECTED]
// ════════════════════════════════════════════
router.get('/marks/:studentId', requireAdminLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM marks WHERE student_id = ? ORDER BY subject_name',
      [req.params.studentId]
    );
    const marksWithGrade = rows.map(r => {
      const normalized = normalizeMarkRow(r);
      return {
        ...normalized,
        grade: getGrade(normalized.marks_obtained, normalized.max_marks)
      };
    });
    return res.json({ success: true, marks: marksWithGrade });
  } catch (err) {
    console.error('Get marks error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  DELETE /api/admin/marks/:markId   [PROTECTED]
// ════════════════════════════════════════════
router.delete('/marks/:markId', requireAdminLogin, async (req, res) => {
  try {
    await db.query('DELETE FROM marks WHERE id = ?', [req.params.markId]);
    return res.json({ success: true, message: 'Mark record deleted.' });
  } catch (err) {
    console.error('Delete mark error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  DELETE /api/admin/students/:id   [PROTECTED]
// ════════════════════════════════════════════
router.delete('/students/:id', requireAdminLogin, async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Student deleted.' });
  } catch (err) {
    console.error('Delete student error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
