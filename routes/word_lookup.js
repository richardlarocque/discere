var async = require('async');
var _ = require('underscore');

var latin = require('../latin');

exports.main = function(req, res) {
  var query = req.query.q;

  latin.searchForWordForm(query, function(err, results) {
    if (err) {
      console.log(err);
    }
    if (results.length == 1) {
      var result = results[0];
      res.redirect(303, '/reference/' + result.id);
    } else {
      res.render('lookup_results', { 'query': query, 'results': results });
    }
  });
}
