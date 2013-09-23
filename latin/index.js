var sqlite3 = require('sqlite3');

var async = require('async');
var _ = require('underscore');
var vocab = require ('latin/vocabularies.js');

var getDB = function() {
  return new sqlite3.Database(__dirname + '/latin-db.sqlite3',
                              sqlite3.OPEN_READONLY);
}

exports.getVocabParamsFromRequest = vocab.getVocabParamsFromRequest;

exports.fetchLemma = function(id, callback) {
  var db = getDB();
  async.waterfall([
      function(callback) {
        db.get(
          "SELECT lemma "
            + " FROM words AS W "
            + " WHERE id = ?",
          id, callback);
      },
      function(result, callback) {
        callback(null, result.lemma);
      }],
    callback);
}

exports.fetchPartOfSpeech = function(id, callback) {
  var db = getDB();
  async.waterfall([
      function(callback) {
        db.get(
          "SELECT P.name AS pos "
            + " FROM words AS W "
            + " JOIN parts_of_speech AS P "
            + "   ON W.part_id = P.id"
            + " WHERE W.id = ?"
            + " LIMIT 1;",
          id,
          callback);
      },
      function(result, callback) {
        callback(null, result.pos);
      }],
    callback);
}

exports.fetchHeader = function(id, callback) {
  var db = getDB();
  async.waterfall([
      function(callback) {
        db.get(
          "SELECT header "
            + " FROM words"
            + " WHERE id = ?"
            + " LIMIT 1;",
          id,
          callback);
      },
      function(result, callback) {
        callback(null, result.header);
      }],
    callback);
}

exports.fetchDefinitions = function(id, callback) {
  var db = getDB();
  async.waterfall([
      function(callback) {
        db.all(
          "SELECT D.definition AS definition "
            + " FROM definitions AS D"
            + " JOIN words AS W"
            + "   ON W.id = D.word_id"
            + " WHERE word_id = ?;",
          id,
          callback);
      },
      function(result, callback) {
        callback(null, _.pluck(result, 'definition'));
      }],
    callback);
}

exports.fetchWordForms = function(id, callback) {
  var db = getDB();
  async.waterfall([
      function(callback) {
        db.all(
          "SELECT N.name AS form, F.value"
            + " FROM word_form_names AS N"
            + " JOIN word_forms AS F"
            + "   ON F.form_id == N.form_id"
            + "     AND F.part_id == N.part_id"
            + " WHERE F.word_id = ?;",
        id,
        callback);
      },
      function(result, callback) {
        callback(null, _.object(_.pluck(result, 'form'),
                                _.pluck(result, 'value')));
      }],
    callback);
}

exports.fetchAsciiWordForms = function(id, callback) {
  var db = getDB();
  async.waterfall([
      function(callback) {
        db.all(
          "SELECT N.name AS form, F.norm_value"
            + " FROM word_form_names AS N"
            + " JOIN word_forms AS F"
            + "   ON F.form_id == N.form_id"
            + "     AND F.part_id == N.part_id"
            + " WHERE F.word_id = ?;",
        id,
        callback);
      },
      function(result, callback) {
        callback(null, _.object(_.pluck(result, 'form'),
                                _.pluck(result, 'norm_value')));
      }],
    callback);
}

exports.fetchWord = function(id, callback) {
  async.series([
    async.apply(exports.fetchLemma, id),
    async.apply(exports.fetchPartOfSpeech, id),
    async.apply(exports.fetchDefinitions, id),
    async.apply(exports.fetchHeader, id),
    async.apply(exports.fetchWordForms, id),
    async.apply(exports.fetchAsciiWordForms, id),
  ],
  function (err, results) {
    if (err) {
      callback(err);
      return;
    }

    var obj = { };
    obj.id = id;
    obj.lemma = results[0];
    obj.part_of_speech = results[1];
    obj.definitions = results[2];
    obj.header = results[3];
    obj.forms = results[4];
    obj.unmacron_forms = results[5];

    callback(null, obj);
  });
}

var chooseRankRange = function(rankWeights) {
  var rand = Math.random();
  for (i = 0; i < rankWeights.length; ++i) {
    if (rand < rankWeights[i][0]) {
      return rankWeights[i][1];
    }
  }
  // If the function is called right, this should be unreachable.
  return Math.pow(2, 53);
}

exports.weightedRandomWordId = function(vocabParams, callback) {
  var db = getDB();

  // Figure out which rank range we're willing to allow with a dice roll.
  var rankWeights = vocabParams.weights;
  var maxRank = chooseRankRange(rankWeights);

  // Select only items with rank < maxRank.
  async.waterfall([
    function(callback) {
      db.get("SELECT word_id AS id"
               + " FROM word_popularity"
               + " WHERE rank < ?"
               + " ORDER BY RANDOM()"
               + " LIMIT 1;",
             maxRank, callback);
    },
    function(result, callback) {
      callback(null, result.id);
    }],
  callback);
}

exports.weightedRandomWordIdForPartQuiz = function(partName, vocabParams, callback) {
  var db = getDB();

  // Figure out which rank range we're willing to allow with a dice roll.
  var rankWeights = vocabParams.weights;
  var maxRank = chooseRankRange(rankWeights);

  // Select only items with rank < maxRank.
  async.waterfall([
    function(callback) {
      db.get("SELECT W.id AS id, COUNT(WF.part_id) AS C"
               + " FROM word_popularity AS WP"
               + " JOIN words AS W ON WP.word_id = W.id"
               + " JOIN parts_of_speech AS PS ON W.part_id = PS.id"
               + " JOIN word_forms AS WF ON WF.word_id = W.id"
               + " WHERE PS.name = ?"
               + " AND rank < ?"
               + " GROUP BY W.id"
               + " HAVING C > 1"
               + " ORDER BY RANDOM()"
               + " LIMIT 1;",
             partName, maxRank, callback);
    },
    function(result, callback) {
      callback(null, result.id);
    }],
  callback);
}

exports.searchForWordForm = function(form, callback) {
  var db = getDB();
  db.all(
    "SELECT W.id AS word_id, W.header, N.name as form_name, P.name AS part_name, P.id AS part_id"
      + " FROM words AS W"
      + " JOIN word_forms AS F ON W.id == F.word_id"
      + " JOIN word_form_names AS N ON N.part_id == F.part_id"
      + "                              AND N.form_id == F.form_id"
      + " JOIN parts_of_speech AS P ON F.part_id == P.id"
      + " WHERE F.norm_value == ?",
    form,
    function(err, rows) {
      console.log(err);
      if (err) {
        callback(err);
        return;
      }
    
      var json = [ ]
      var grouped = _.pairs(_.groupBy(rows, 'word_id'));
      for (var i = 0; i < grouped.length; ++i) {
        var word_obj = {};
        word_obj.id = grouped[i][0];
        word_obj.header = grouped[i][1][0].header;
        word_obj.part_of_speech = grouped[i][1][0].part_name;
        word_obj.part_of_speech_id = grouped[i][1][0].part_id;

        var matching_forms = grouped[i][1];
        word_obj.matching_forms = _.pluck(matching_forms, 'form_name');

        json.push(word_obj);
      }

      callback(null, json);
    });
}
