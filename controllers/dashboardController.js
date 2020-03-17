// GET /dashboard

export function getDashboardIndex(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/index', { title: 'Dashboard', page: 'dashboard' });
}

export function getDashboardPasswords(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/passwords', { title: 'Dashboard', page: 'dashboard' });
}

export function getDashboardGenerator(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/generator', { title: 'Dashboard', page: 'dashboard' });
}

export function getDashboardAccount(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/account', { title: 'Dashboard', page: 'dashboard' });
}
