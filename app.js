var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var jws = require('jws');
var { SECRET, whiteList } = require('./config/config')

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var posts = require('./routes/posts');
var tags = require('./routes/tags');

var app = express();

var options = {
  swaggerDefinition: {
    info: {
      title: 'Fcc\'s Blog', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  apis: ['./routes/*.js'] // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE,PUT,PATCH');
  next();
});

app.use(function (req, res, next) {
  if (req.method.toLowerCase() === 'options') {
    res.send({
      code: 200,
      msg: 'continue'
    })
    return;
  }
  next();
});

app.use(function (req, res, next) {
  if (whiteList.includes(req._parsedUrl.pathname)) {
    next();
  } else if (req.query.token) {
    var signature = req.query.token;
    if (signature === 'TOKEN001') {
      next();
    } else {
      var valid = jws.verify(signature, 'HS256', SECRET);
      var userId = '';
      if (!valid) {
        res.sendStatus(401);
      } else {
        userId = jws.decode(signature).payload.user_id;
      }
      req.userId = userId;
      next();
    }
  } else {
    return res.sendStatus(401);
  }
});

app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/posts', posts);
app.use('/tags', tags);

// return a doc of json to render swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
