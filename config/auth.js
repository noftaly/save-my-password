export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error_msg', 'Veuillez vous connecter pour acceder à votre espace client');
  res.redirect('/login');
}
export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/dashboard');
}
