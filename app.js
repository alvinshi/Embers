'use strict';
const AV = require('leanengine');
const express = require('express');
const timeout = require('connect-timeout');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cloud  = require('./cloud');

const app = express();

/*
 * Set template engine
 * Note: ejs is not actually used in any way, the site is completely
 * relying on angularJS
 */
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static('public'));

// 15s default time-out
app.use(timeout('15s'));

// leancloud middleware
app.use(AV.express());

// Not sure how this works, needed to be resolved later
// https://expressjs.com/en/guide/behind-proxies.html
app.enable('trust proxy');
// Uncomment the following line for Https request
// app.use(AV.Cloud.HttpsRedirect());

/*
 * bodyParser middleware
 * the parsed info is stored in the req.body field
 * json : This parser accepts any Unicode encoding of the body and
 *        supports automatic inflation of gzip and deflate encodings.
 * urlencoded : This parser accepts only UTF-8 encoding of the body
 *              and supports automatic inflation of gzip and deflate encodings.
 *              A new body object containing the parsed data is populated
 *              on the request object after the middleware (i.e. req.body).
 *              This object will contain key-value pairs,
 *              where the value can be a string or array (when extended is false),
 *              or any type (when extended is true).
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * cookieParser middleware
 * req.cookies and req.signedCookies
 */
app.use(cookieParser());

// Point to sub-routes;
app.use('/', require('./routes/index'));

app.use(function(req, res, next) {
  // The request is not caught by any route, throw 404
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // ignore websocket timeout, why is that?
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('Request Timeout: url=%s, timeout=%d.', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // No error msg by default
  var error = {}
  if (app.get('env') === 'development') {
    // Under development, the error info will be rendered
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
