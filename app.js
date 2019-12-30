import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import hbs from 'express-hbs';
import morgan from 'morgan';

import * as indexController from './controllers/indexController';
import * as aboutController from './controllers/aboutController';
import * as authController from './controllers/authController';
import * as dashboardController from './controllers/dashboardController';
import { ensureAuthenticated, forwardAuthenticated } from './config/auth';

require('dotenv').config();
require('./config/passport').config();

const MongoStore = connectMongo(session);

const app = express();
const port = Number(process.env.PORT) || 8000;
process.env.HOST = process.env.HOST || `http://localhost:${port}`;
const host = process.env.HOST;

// Setting up mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// Setting up Handlebars
hbs.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and: (...args) => Array.prototype.slice.call(args).every(Boolean),
  or: (...args) => Array.prototype.slice.call(args, 0, -1).some(Boolean),
});
app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, '/views/partials'),
  defaultLayout: path.join(__dirname, '/views/layout/main.hbs'),
  layoutsDir: path.join(__dirname, '/views/layout'),
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
  return next();
});

app.get('/', indexController.getIndex);
app.get('/about', aboutController.getAbout);
app.get('/about/legals', aboutController.getLegals);

app.get('/login', forwardAuthenticated, authController.getLogin);
app.post('/login', forwardAuthenticated, authController.postLogin);
app.get('/register', forwardAuthenticated, authController.getRegister);
app.post('/register', forwardAuthenticated, authController.postRegister);
app.get('/logout', authController.getLogout);

app.get('/dashboard', ensureAuthenticated, dashboardController.getDashboard);

app.get('*', (req, res) => {
  res.locals.code = 404;
  res.locals.message = "Désolé, mais cette page n'existe pas ou n'existe plus.";
  res.render('_error', { title: 'Erreur', page: 'error' });
});

app.listen(port, () => {
  console.log('App is running at %s in %s mode', host, app.get('env'));
});
