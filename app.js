
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');

var index = require('./routes');
var word_lookup = require('./routes/word_lookup');
var word_reference = require('./routes/word_reference');
var definition_quiz = require('./routes/definition_quiz');
var generic_quiz = require('./routes/generic_quiz');

var vocab = require('./latin/vocabularies.js');

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(
    path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));

// Cookie handling for the vocab setting.
app.use(cookieParser());
app.use(vocab.middleware);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', index.main);

app.get('/lookup', word_lookup.main)
app.get('/reference/:id(\\d+)', word_reference.byId);
app.get('/reference', word_reference.random);

app.get('/quiz/definition', definition_quiz.main);
app.get('/quiz/verb', generic_quiz.verb);
app.get('/quiz/noun', generic_quiz.noun);
app.get('/quiz/adjective', generic_quiz.adjective);
app.get('/quiz/adverb', generic_quiz.adverb);
app.get('/quiz/pronoun', generic_quiz.pronoun);

module.exports = app
