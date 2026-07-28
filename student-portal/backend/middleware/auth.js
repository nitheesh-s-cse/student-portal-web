// ─────────────────────────────────────────────────────────────
//  middleware/auth.js  –  Session Guard Middleware
//
//  Middleware = a function that runs BETWEEN the request arriving
//  and your route handler. It checks if the user is logged in.
//  If not → sends 401. If yes → calls next() to proceed.
// ─────────────────────────────────────────────────────────────

/**
 * requireStudentLogin
 * Protects routes that only a logged-in student should access.
 */
function requireStudentLogin(req, res, next) {
  if (req.session && req.session.student) {
    return next(); // user is logged in, continue
  }
  // Not logged in
  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Please login first.'
  });
}

/**
 * requireAdminLogin
 * Protects routes that only a logged-in admin should access.
 */
function requireAdminLogin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Admin login required.'
  });
}

module.exports = { requireStudentLogin, requireAdminLogin };
