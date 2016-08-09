var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

var routeParser = require('./routeParser');


module.exports = function(context){
  var app = express();

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  if(context.viewEngine){
    app.set('view engine', context.viewEngine);
    app.use(express.static(context.publicDirectory));
    app.set('views', context.publicDirectory + "/views");
  }

  app.use(function(req, res, next){
    context.events.onRequest.call(context.globals.get(), req, res, next);
  })

  app.use('/', routeParser(context));

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
      res.json({
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });

  return app;

}
