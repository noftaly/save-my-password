import path from 'path';

import bodyParser from 'body-parser';
import compression from 'compression';
import flash from 'connect-flash';
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import hbs from 'express-hbs';
import session from 'express-session';
import helpers from 'handlebars-helpers';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import nodemailer from 'nodemailer';
import passport from 'passport';

import { ensureAuthenticated, forwardAuthenticated } from './config/auth';
import passportConfig from './config/passport';
import * as aboutController from './controllers/aboutController';
import * as authController from './controllers/authController';
import * as dashboardController from './controllers/dashboardController';
import * as indexController from './controllers/indexController';

dotenvConfig();
passportConfig();

const MongoStore = connectMongo(session);
const app = express();
const port = Number(process.env.PORT) || 8000;
process.env.HOST = process.env.HOST || `http://localhost:${port}`;
const host = process.env.HOST;

// eslint-disable-next-line import/prefer-default-export
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Setting up mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  throw err;
});

// Setting up Handlebars
hbs.registerHelper(helpers.comparison());
app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, '/views/partials'),
  defaultLayout: path.join(__dirname, '/views/layouts/main.hbs'),
  layoutsDir: path.join(__dirname, '/views/layouts'),
}));
app.set('view engine', 'hbs');
// Setting up the expres app
app.set('views', path.join(__dirname, '/views'));
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 90 * 24 * 3600 * 1000, // 3 months
  },
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));
app.disable('x-powered-by');

app.use((req, res, next) => {
  // Setting flash messages
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // Setting user
  res.locals.user = req.user;
  return next();
});

app.get('/', indexController.getIndex);
app.get('/about', aboutController.getAbout);
app.get('/about/legals', aboutController.getLegals);

app.get('/login', forwardAuthenticated, authController.getLogin);
app.post('/login', forwardAuthenticated, authController.postLogin);
app.get('/login/new', forwardAuthenticated, authController.getLoginNew);
app.post('/login/new', forwardAuthenticated, authController.postLoginNew);
app.get('/register', forwardAuthenticated, authController.getRegister);
app.post('/register', forwardAuthenticated, authController.postRegister);
app.get('/logout', authController.getLogout);

app.get('/dashboard', ensureAuthenticated, dashboardController.getDashboardIndex);
app.get('/dashboard/passwords', ensureAuthenticated, dashboardController.getDashboardPasswords);
app.get('/dashboard/generator', ensureAuthenticated, dashboardController.getDashboardGenerator);
app.get('/dashboard/account', ensureAuthenticated, dashboardController.getDashboardAccount);

app.get('*', (_req, res) => {
  res.locals.code = 404;
  res.locals.message = "Désolé, mais cette page n'existe pas ou n'existe plus.";
  res.render('error', { title: 'Erreur', page: 'error' });
});

app.listen(port, () => {
  console.log('App is running at %s in %s mode', host, app.get('env'));
});
