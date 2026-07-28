// ─────────────────────────────────────────────────────────────
//  routes/captcha.js  –  Simple Math CAPTCHA
//
//  HOW IT WORKS:
//  1. Frontend calls GET /api/captcha  → gets a question like "3 + 7 = ?"
//  2. Backend stores the ANSWER in the session (not sent to browser)
//  3. When student submits login, they send their captcha answer
//  4. Backend compares it with session answer
//
//  This prevents bots from spamming the login endpoint.
// ─────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

// GET /api/captcha  →  generates a new math question
router.get('/', (req, res) => {
  // Generate two random numbers between 1 and 15
  const a = Math.floor(Math.random() * 15) + 1;
  const b = Math.floor(Math.random() * 15) + 1;

  // Randomly choose addition or subtraction
  // For subtraction, ensure result is always positive (a >= b)
  const ops = ['+', '-'];
  const op  = ops[Math.floor(Math.random() * ops.length)];

  let question, answer;
  if (op === '+') {
    question = `${a} + ${b}`;
    answer   = a + b;
  } else {
    // Make sure bigger number is first
    const bigger  = Math.max(a, b);
    const smaller = Math.min(a, b);
    question = `${bigger} - ${smaller}`;
    answer   = bigger - smaller;
  }

  // Store answer in server-side session (user never sees this)
  req.session.captchaAnswer = answer;

  // Send only the question to the browser
  res.json({ success: true, question: `${question} = ?` });
});

module.exports = router;
