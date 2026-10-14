const jwt = require('jsonwebtoken');

if (
  !process.env.JWT_SECRET &&
  (process.env.NODE_ENV === 'production' || process.env.VERCEL)
) {
  throw new Error('JWT_SECRET must be configured in production.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_job_portal_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET,
};
