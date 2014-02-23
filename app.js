var express = require('express');
var path = require('path');
var i18next = require('i18next');

var app = express();

i18next.init();
i18next.registerAppHelper(app);

app.set('port', process.env.PORT || 3000);
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
  require("./db");

  require('./routers').setRouters(app);

  app.listen(app.get('port'));
  console.log('Express server listening on port ' + app.get('port'));
}
