var sqlite3 = require('sqlite3');
var async = require('async');
var _ = require('underscore');

exports.fetchLemma = function(db, id, callback) {
  var result = db.get(
      "SELECT lemma "
        + " FROM words AS W "
        + " WHERE id = ?",
      id,
      callback);
}

exports.fetchPartOfSpeech = function(db, id, callback) {
  var result = db.get(
      "SELECT P.name AS POS "
        + " FROM words AS W "
        + " JOIN parts_of_speech AS P "
        + "   ON W.part_id = P.id"
        + " WHERE W.id = ?"
        + " LIMIT 1;",
      id,
      callback);
}

exports.fetchDefinitions = function(db, id, callback) {
  var result = db.all(
      "SELECT D.definition AS definition "
        + " FROM definitions AS D"
        + " JOIN words AS W"
        + "   ON W.id = D.word_id"
        + " WHERE word_id = ?;",
      id,
      callback);
}

exports.fetchNounInflections = function(db, id, callback) {
  var result = db.all(
      "SELECT N.name AS inflection, I.value AS value" 
        + " FROM noun_inflections AS N"
        + " JOIN inflected_nouns AS I"
        + "   ON N.id == I.infl_id"
        + " WHERE I.word_id = ?;",
      id,
      callback);
}

exports.fetchAdjectiveInflections = function(db, id, callback) {
  var result = db.all(
      "SELECT A.name AS inflection, I.value AS value" 
        + " FROM adjective_inflections AS A"
        + " JOIN inflected_adjectives AS I"
        + "   ON A.id == I.infl_id"
        + " WHERE I.word_id = ?;",
      id,
      callback);
}

exports.fetchVerbConjugations = function(db, id, callback) {
  var result = db.all(
      "SELECT V.name AS conjugation, C.value AS value" 
        + " FROM verb_conjugations AS V"
        + " JOIN conjugated_verbs AS C"
        + "   ON V.id == C.conj_id"
        + " WHERE C.word_id = ?;",
      id,
      callback);
}

var makePrettyJson = function(err, results, callback) {
  if (err) {
    callback(err);
  }

  var obj = { };
  obj.lemma = results[0].lemma;
  obj.part_of_speech = results[1].POS
  console.log(results[2]);
  obj.definitions = _.map(results[2], function(x) { return x.definition; } );
  if (results[3].length != 0) {
    var inflections = {}
    for (var i = 0; i < results[3].length; ++i) {
      inflections[results[3][i].inflection] = results[3][i].value;
    }
    obj.noun_inflections = inflections
  }
  if (results[4].length != 0) {
    var inflections = {}
    for (var i = 0; i < results[4].length; ++i) {
      inflections[results[4][i].inflection] = results[4][i].value;
    }
    obj.adjective_inflections = inflections
  }
  if (results[5].length != 0) {
    var conjugations = {}
    for (var i = 0; i < results[5].length; ++i) {
      conjugations[results[5][i].conjugation] = results[5][i].value;
    }
    obj.verb_conjugations = conjugations
  }

  callback(null, obj);
}

exports.fetchWord = function(id, callback) {
  var db = new sqlite3.Database(__dirname + '/latindb.sqlite3', sqlite3.OPEN_READONLY);
  async.series([
    async.apply(exports.fetchLemma, db, id),
    async.apply(exports.fetchPartOfSpeech, db, id),
    async.apply(exports.fetchDefinitions, db, id),
    async.apply(exports.fetchNounInflections, db, id),
    async.apply(exports.fetchAdjectiveInflections, db, id),
    async.apply(exports.fetchVerbConjugations, db, id),
  ],
  function (err, results) {
    makePrettyJson(err, results, callback);
  });
}

