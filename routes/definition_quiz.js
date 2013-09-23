var async = require('async');
var _ = require('underscore');

var latin = require('latin');

var fetchWords = function(vocabParams, callback) {
  async.waterfall([
    function(callback) {
      async.times(10, function(x,cb) { latin.weightedRandomWordId(vocabParams, cb); }, callback)
    },
    function(ids, callback) {
      async.map(ids,
        function(id, callback) {
          async.parallel([
              async.apply(latin.fetchDefinitions, id),
              async.apply(latin.fetchHeader, id)],
            callback);
        },
        callback);
    },
    function(result, callback) {
      var json = []
      for (var i = 0; i < result.length; ++i) {

        var pretty = {}

        pretty.definitions = result[i][0];
        pretty.header = result[i][1];
        console.log(pretty);

        json[i] = pretty;
      }
      callback(null, json);
    }],
    callback);
}

exports.main = function(req, res) {
  fetchWords(
    latin.getVocabParamsFromRequest(req),
    function(err, words) {
      if (err) {
        console.log(err);
      }
      res.render('definition_quiz', { 'words' : words } );
    });
}

