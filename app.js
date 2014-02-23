var express = require('express');
var i18next = require('i18next');
var path = require('path');

var config = require('./config');
var db = require('./db');

var app = express();

i18next.init({
  fallbackLng: config.i18n.defaultLanguage,
  resGetPath: path.join(__dirname, 'locales/__lng__.json')
});

i18next.registerAppHelper(app);

app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(i18next.handle);
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (!module.parent) {
  db.connect(function() {
    require('./routers').setRouters(app);

    app.listen(app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));
  });
}
