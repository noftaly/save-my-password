// GET /
export function getIndex(_req, res) {
  res.status(200).render('index', { title: 'Accueil', page: 'home' });
}
