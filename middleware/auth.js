function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login.html');
}

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  res.status(403).send('Admins only');
}
module.exports = { ensureAuthenticated, ensureAdmin };