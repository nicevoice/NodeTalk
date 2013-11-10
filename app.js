
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var i18next = require('i18next');
var routes = require('./routes');
var user = require('./routes/user');

var app = express();

i18next.init({
    lng: 'zh_CN',
    saveMissing: true,
    debug: true
});
i18next.registerAppHelper(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(i18next.handle);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
