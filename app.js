/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout : false, filename : __dirname + '/view/index.jade' });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'masuilab' }));
  app.use(require('express-coffee')({
    path : __dirname + '/public',
    src  : __dirname + '/public',
    live : false
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes
app.get('/', function(req, res){
  res.render('index', {});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
