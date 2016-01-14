var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);

var routes = require('./routes/index');
var user = require('./routes/user');
var verify = require('./routes/verify');
var import_ = require('./routes/import');

var app = express();

mongoose.connect("mongodb://localhost/test");

// view engine setu
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    store: new MongoStore({
        url: 'mongodb://localhost/test',
        clear_interval: 60 * 60
    }),
    cookie: {
        httpOnly: true,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    }
}));
app.use(express.static(path.join(__dirname, 'public')));


var unless = function(p, middleware) {
    return function(req, res, next) {
        if (p === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

app.use('/', routes);
app.use(unless('/', function(req, res, next){
  console.log( req.session.user );
  if( req.session.user == null){
    res.redirect('/');
  }else{
    return next();
  }
}));
app.use('/user', user);
app.use('/verify', verify);
app.use('/import', import_);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
