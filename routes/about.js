import express from 'express';

const router = express.Router();

router.get('/about', (_req, res) => {
  res.status(200).render('about', { title: 'À propos' });
});

router.get('/about/legals', (_req, res) => {
  res.status(200).render('legals', { title: 'Mentions légales' });
});

export default router;
