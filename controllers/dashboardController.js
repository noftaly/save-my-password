// GET /dashboard

export function getDashboardIndex(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/index', { title: 'Dashboard', page: 'dashboard-index' });
}

export function getDashboardPasswords(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/passwords', { title: 'Mes mots de passe', page: 'dashboard-passwords' });
}

export function getDashboardGenerator(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/generator', { title: 'Générateur', page: 'dashboard-generator' });
}

export function getDashboardAccount(req, res) {
  res.locals.user = req.user;
  res.status(200).render('dashboard/account', { title: 'Mon compte', page: 'dashboard-account' });
}
