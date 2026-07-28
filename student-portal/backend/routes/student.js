// ─────────────────────────────────────────────────────────────
//  routes/student.js  –  Student Login & Dashboard API Routes
//
//  Endpoints:
//    POST /api/student/login    – Student login (with CAPTCHA check)
//    POST /api/student/logout   – Student logout
//    GET  /api/student/me       – Get logged-in student's profile
//    GET  /api/student/marks    – Get logged-in student's marks
// ─────────────────────────────────────────────────────────────
const express = require('express');
const bcrypt  = require('bcrypt');
const router  = express.Router();
const db      = require('../db');
const { requireStudentLogin } = require('../middleware/auth');

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
//  POST /api/student/login
//  Body: { student_id, password, captchaAnswer }
// ════════════════════════════════════════════
router.post('/login', async (req, res) => {
  const { student_id, password, captchaAnswer } = req.body;

  // ── Step 1: Validate input fields ────────────────────────
  if (!student_id || !password || captchaAnswer == null) {
    return res.status(400).json({
      success: false,
      message: 'Student ID, password, and CAPTCHA answer are required.'
    });
  }

  // ── Step 2: Verify CAPTCHA ────────────────────────────────
  // The correct answer was stored in session when /api/captcha was called
  const correctAnswer = req.session.captchaAnswer;

  if (correctAnswer === undefined || correctAnswer === null) {
    return res.status(400).json({
      success: false,
      message: 'CAPTCHA expired. Please refresh the CAPTCHA and try again.'
    });
  }

  if (parseInt(captchaAnswer) !== correctAnswer) {
    // Clear captcha from session so they must get a new one
    delete req.session.captchaAnswer;
    return res.status(400).json({
      success: false,
      message: 'Wrong CAPTCHA answer. Please try again.'
    });
  }

  // Clear CAPTCHA from session after use (one-time use)
  delete req.session.captchaAnswer;

  // ── Step 3: Find student in DB ────────────────────────────
  try {
    const [rows] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [student_id.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID or Password.'
      });
    }

    const student = rows[0];

    // ── Step 4: Compare password ──────────────────────────
    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID or Password.'
      });
    }

    // ── Step 5: Save to session ───────────────────────────
    req.session.student = {
      student_id: student.student_id,
      name:       student.name,
      class:      student.class
    };

    return res.json({
      success: true,
      message: `Welcome, ${student.name}!`,
      student: {
        student_id: student.student_id,
        name:       student.name,
        class:      student.class
      }
    });
  } catch (err) {
    console.error('Student login error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════
//  POST /api/student/logout
// ════════════════════════════════════════════
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

// ════════════════════════════════════════════
//  GET /api/student/me   [PROTECTED]
//  Returns logged-in student's profile info
// ════════════════════════════════════════════
router.get('/me', requireStudentLogin, (req, res) => {
  return res.json({
    success: true,
    student: req.session.student
  });
});

// ════════════════════════════════════════════
//  GET /api/student/marks   [PROTECTED]
//  Returns marks for the logged-in student
// ════════════════════════════════════════════
router.get('/marks', requireStudentLogin, async (req, res) => {
  const { student_id } = req.session.student;

  try {
    const [rows] = await db.query(
      'SELECT * FROM marks WHERE student_id = ? ORDER BY subject_name',
      [student_id]
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        marks:      [],
        totalObtained: 0,
        totalMax:      0,
        percentage:    '0.00',
        message:    'No marks entered yet. Contact your admin.'
      });
    }

    // Add grade to each row and calculate totals
    let totalObtained = 0;
    let totalMax      = 0;

    const marksWithGrade = rows.map(r => {
      totalObtained += r.marks_obtained;
      totalMax      += r.max_marks;
      return {
        id:             r.id,
        subject_name:   r.subject_name,
        marks_obtained: r.marks_obtained,
        max_marks:      r.max_marks,
        grade:          getGrade(r.marks_obtained, r.max_marks)
      };
    });

    const percentage = ((totalObtained / totalMax) * 100).toFixed(2);

    return res.json({
      success:       true,
      marks:         marksWithGrade,
      totalObtained,
      totalMax,
      percentage
    });
  } catch (err) {
    console.error('Get marks error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
