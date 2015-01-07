var async = require('async');
var latin = require('../latin');

exports.byId = function(req, res) {
  latin.fetchWord(req.params.id,
    function(err, result) {
      if (err) {
        console.log(err);
      }
      res.render('word_reference', { word: result });
    });
};

exports.random = function(req, res) {
  async.waterfall([
    async.apply(latin.weightedRandomWordId, latin.getVocabParamsFromRequest(req)),
  ],
  function(err, id, callback) {
    res.redirect('./reference/' + id)
  });
}
