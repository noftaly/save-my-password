/* eslint-disable object-curly-newline */
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/UserModel';

// Register Page
export function getRegister(_req, res) {
  res.status(200).render('register', { title: 'Inscription', page: 'register' });
}

// Register
export function postRegister(req, res) {
  const { name, firstname, username, email, password, passwordConfirm } = req.body;
  const errors = [];

  if (password !== passwordConfirm)
    errors.push({ msg: 'Les mots de passes ne correspondent pas.' });

  if (password.length <= 6)
    errors.push({ msg: 'Le mot de passe doit faire au moins 6 caractères.' });

  if (errors.length > 0) {
    res.locals = { errors, name, firstname, username, email };
    return res.status(400).render('register', { title: 'Inscription', page: 'register' });
  }

  User.findOne({ email }).then(async (existingUser) => {
    if (existingUser) {
      errors.push({ msg: 'Email already exists' });
      res.locals = { errors, name, firstname, username, email };
      return res.status(400).render('register', { title: 'Inscription', page: 'register' });
    }

    const newUser = new User({ name, firstname, username, email, password });
    const hash = await bcrypt.hash(password, 10).catch(console.error);
    newUser.password = hash;
    newUser.save()
      .then(() => {
        req.flash('success_msg', 'Vous êtes bien enregistré. Veuillez maintenant vous connecter.');
        res.redirect(301, '/login');
      }).catch(console.error);
  });
}

// Login Page
export function getLogin(_req, res) {
  res.status(200).render('login', { title: 'Connection', page: 'login' });
}

// Login
export function postLogin(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
}

// Logout
export function getLogout(req, res) {
  req.logout();
  req.flash('success_msg', 'Vous êtes bien déconnecté.');
  res.redirect('/login');
}
