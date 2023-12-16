const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-locals');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session'); // 追加

const indexRouter = require('./routes/index');
const boards = require('./routes/boards'); //追加
const register = require('./routes/register'); // 追加
const login = require('./routes/login'); // 追加
const logout = require('./routes/logout');
const setUser = require('./setUser'); // 追加
const del = require('./routes/del'); // 追加
const update = require('./routes/update'); // 追加

const app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//　session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use('/', setUser, indexRouter);
app.use('/boards', setUser, boards);　//追加
app.use('/register', register); //追加
app.use('/login', login); // 追加
app.use('/logout', logout);
app.use('/del', del);
app.use('/update', update);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
