var async = require('async');
var _ = require('underscore');

var latin = require('latin');

exports.main = function(req, res) {
  var query = req.query.q;

  latin.searchForWordForm(query, function(err, results) {
    if (err) {
      console.log(err);
    }
    res.render('lookup_results', { 'query': query, 'results': results });
  });
}
