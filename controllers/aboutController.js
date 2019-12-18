// GET /about
export function getAbout(_req, res) {
  res.status(200).render('about', { title: 'À propos', page: 'about' });
}

// GET /about/legals
export function getLegals(_req, res) {
  res.status(200).render('legals', { title: 'Mentions légales', page: 'legals' });
}
