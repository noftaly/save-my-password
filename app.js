import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import hbs from 'express-hbs';
import morgan from 'morgan';

require('dotenv').config();
const MongoStore = require('connect-mongo')(session);

import routes from './routes/router';

const app = express();
const port = Number(process.env.PORT) || 8000;
process.env.HOST = process.env.HOST || `http://localhost:${port}`;
const host = process.env.HOST;

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

hbs.registerHelper({
  eq(v1, v2) { return v1 === v2; },
  ne(v1, v2) { return v1 !== v2; },
  lt(v1, v2) { return v1 < v2; },
  gt(v1, v2) { return v1 > v2; },
  lte(v1, v2) { return v1 <= v2; },
  gte(v1, v2) { return v1 >= v2; },
  and(...args) { return Array.prototype.slice.call(args).every(Boolean); },
  or(...args) { return Array.prototype.slice.call(args, 0, -1).some(Boolean); },
});
app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, '/views/partials'),
  defaultLayout: path.join(__dirname, '/views/layout/main.hbs'),
  layoutsDir: path.join(__dirname, '/views/layout'),
}));
app.set('view engine', 'hbs');
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
    maxAge: 90 * 24 * 3600 * 1000,
  },
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  }),
}));
app.use(morgan('dev'));
app.disable('x-powered-by');

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/about/legals', routes.legals);

app.listen(port, () => {
  console.log('App is running at %s in %s mode', host, app.get('env'));
});
