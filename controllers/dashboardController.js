// GET /dashboard
// eslint-disable-next-line import/prefer-default-export
export function getDashboard(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard', { title: 'Dashboard', page: 'dashboard' });
}
