
/**
 * Module dependencies.
 */

var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();


// deprecated express methods
// app.use(express.favicon());
// app.use(express.logger('dev'));

app.set('views', __dirname);
app.set('view engine', 'jade');
app.enable('strict routing');

// load main

var main = fs.readdirSync(__dirname).filter(function(file){
  return fs.statSync(__dirname + '/' + file).isDirectory();
});

// routes

/**
 * GET page.js
 */

app.get('/page.js', function(req, res){
  res.sendFile(join(__dirname, '..', 'page.js'));
});

/**
 * GET test libraries.
 */

app.get(/^\/(mocha|chai)\.(css|js)$/i, function(req, res){
  res.sendFile(join(__dirname, '../test/', req.params.join('.')));
});

/**
 * GET list of main.
 */

app.get('/', function(req, res){
  res.render('top', { main: main });
});

/**
 * GET /:main -> /:main/
 */

app.get('/:main', function(req, res){
  res.redirect('/' + req.params.main + '/');
});

/**
 * GET /:main/* as a file if it exists.
 */

app.get('/:main/:file(*)', function(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.main;
  var path = join(__dirname, name, file);
  fs.stat(path, function(err, stat){
    if (err) return next();
    res.sendFile(path);
  });
});

/**
 * GET /:main/* as index.html
 */

app.get('/:main/*', function(req, res){
  var name = req.params.main;
  // res.sendFile(join(__dirname, name, 'index.jade'));
  res.render(name, { name: 'index.jade' });
});

app.listen(4000);
console.log('main server listening on port 4000');
