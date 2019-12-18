// GET /dashboard
export function getDashboard(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard', { title: 'Dashboard', page: 'dashboard' });
}
