// app.js
require('dotenv').config();

const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const passport     = require('passport');
const cors         = require('cors');

const apiRouter    = require('./app_api/routes/index');
const indexRouter  = require('./app_server/routes/index');
const usersRouter  = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');

require('./app_api/models/db');
require('./app_api/config/passport');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use(
  '/api',
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  })
);

app.use('/api', (req, res, next) => {
  console.log(`👉 API Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', apiRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.name + ': ' + err.message });
  }
  next(err);
});

app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
