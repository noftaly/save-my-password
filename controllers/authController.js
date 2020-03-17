/* eslint-disable object-curly-newline */
import bcrypt from 'bcrypt';
import passport from 'passport';
import { transporter } from '../app';
import User from '../models/user';

// Register Page
export function getRegister(_req, res) {
  res.status(200).render('register', { title: 'Inscription', page: 'register' });
}

// Register
export async function postRegister(req, res) {
  const { name, firstname, username, email, password, passwordConfirm } = req.body;
  const errors = [];

  if (password !== passwordConfirm)
    errors.push({ msg: 'Les mots de passes ne correspondent pas.' });

  if (password.length <= 6)
    errors.push({ msg: 'Le mot de passe doit faire au moins 6 caractères.' });

  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    errors.push({ msg: 'Cet email est déjà associé à un compte.' });

  const existingUsername = await User.findOne({ username });
  if (existingUsername)
    errors.push({ msg: "Ce nom d'utilisateur est déjà utilisé." });

  if (errors.length > 0) {
    res.locals = { errors, name, firstname, username, email };
    return res.status(400).render('register', { title: 'Inscription', page: 'register' });
  }

  // 6-digits random code (between 100000 and 999999)
  const code = Math.floor(Math.random() * 900000) + 100000;

  const newUser = new User({
    name,
    firstname,
    username,
    email,
    password,
    emailVerificationCode: code,
    emailVerified: false,
  });
  const hash = await bcrypt.hash(password, 10).catch(console.error);
  newUser.password = hash;
  await newUser.save().catch(console.error);

  const info = await transporter.sendMail({
    to: email,
    subject: 'Save My Password : Création de votre compte',
    html: `
      <p>
        Bonjour ${firstname},
        <br>Merci d'avoir créé un compte sur Save My Password ! Pour finaliser cette procédure, entre le code ci-dessous sur la
        <br>page de connection qui est affichée sur ton navigateur (ou clique <a href="http://localhost:8000/login/new}">ici</a> ).

        <p style="font-size: 24px">
          ${code}
        </p>
      </p>
      <p>
        En esperant vous revoir bientôt,
        <br>L'équipe de Save My Password
      </p>`,
  }).catch(err => void console.error(err));

  if (!info || info.rejected.includes(email)) {
    errors.push({ msg: "Une erreur est survenue : il est impossible d'envoyer l'email." });
    res.locals = { errors, name, firstname, username, email };
    return res.status(500).render('register', { title: 'Inscription', page: 'register' });
  }

  req.flash('success_msg', `Merci de confirmer votre compte en copiant le code qui vient de vous être envoyé à l'adresse mail : <strong>${email}</strong>.`);
  res.redirect(301, `/login/new?email=${encodeURIComponent(email)}`);
}

// Login New Page (right after registering, with the field for the code)
export function getLoginNew(req, res) {
  res.locals = { email: decodeURIComponent(req.query.email) };
  res.status(200).render('loginNew', { title: 'Connection', page: 'login' });
}

// Login New
export async function postLoginNew(req, res, next) {
  const { email, code } = req.body;
  const user = User.findOne({ email });

  if (!user.emailVerified) {
    if (code === user.emailVerificationCode) {
      user.emailVerified = true;
      user.emailVerificationToken = null;
      await user.save();
    } else {
      req.flash('error_msg', "Le code de confirmation est incorrect. Nous vous l'avons envoyé par email.");
      return res.redirect(301, '/login/new');
    }
  }
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login/new',
    failureFlash: true,
  })(req, res, next);
}

// Login Page
export function getLogin(_req, res) {
  res.status(200).render('login', { title: 'Connection', page: 'login' });
}

// Login
export async function postLogin(req, res, next) {
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
