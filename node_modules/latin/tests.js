var latin = require('latin');

exports.testFetchLemma = function(test) {
  latin.fetchLemma(1, function(err, result) {
    test.ifError(err);
    test.equal(typeof result, 'string');
    test.done();
  });
}

exports.testFetchPartOfSpeech = function(test) {
  latin.fetchPartOfSpeech(1, function(err, result) {
    test.ifError(err);
    test.equal(typeof result, 'string');
    test.done();
  });
}

exports.testFetchHeader = function(test) {
  latin.fetchHeader(1, function(err, result) {
    test.ifError(err);
    test.equal(typeof result, 'string');
    test.done();
  });
}

exports.testFetchDefinitions = function(test) {
  latin.fetchDefinitions(1, function(err, result) {
    test.ifError(err);
    test.ok(Array.isArray(result));
    test.equal(typeof result[0], 'string');
    test.done();
  });
}

exports.testFetchWordForms = function(test) {
  latin.fetchWordForms(1, function(err, result) {
    test.ifError(err);
    test.done();
  });
}

exports.testFetchAsciiWordForms = function(test) {
  latin.fetchAsciiWordForms(1, function(err, result) {
    test.ifError(err);
    test.done();
  });
}

exports.testFetchWord = function(test) {
  latin.fetchWord(1, function(err, result) {
    test.ifError(err);
    test.equal(typeof result.lemma, 'string');
    test.equal(typeof result.part_of_speech, 'string');
    test.equal(typeof result.definitions[0], 'string');
    test.equal(typeof result.header, 'string');
    test.ok(typeof result.forms);
    test.done();
  });
}

exports.testRandomWordId = function(test) {
  latin.randomWordId(function(err, result) {
    test.ifError(err);
    test.equal(typeof result, 'number');
    test.done();
  });
}

exports.testRandomWordIdOfType = function(test) {
  latin.randomWordIdOfType('Verb', function(err, result) {
    test.ifError(err);
    test.equal(typeof result, 'number');
    test.done();
  });
}
