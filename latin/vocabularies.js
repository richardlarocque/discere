var _ = require('underscore');

var DEFAULT_ID = 'aeneid1';

var vocabularies = [
  { title: 'Aeneid - Level 1', id: 'aeneid1', weights: [[0.8, 400], [1, 1000]], },
  { title: 'Aeneid - Level 2', id: 'aeneid2', weights: [[0.4, 400], [0.9, 1500], [1,4000]] },
  { title: 'Aeneid - Level 3', id: 'aeneid3', weights: [[0.5, 2000], [1,4000]] },
  { title: 'Full Dictionary', id: 'fulldict', weights: [[1, 100000]] }
]

// NOTE: Requires cookieParser.
exports.middleware = function(req, res, next) {
  res.locals.vocabularies = vocabularies;

  if (req.cookies.vocab) {
    res.locals.vocab_value = req.cookies.vocab;
  } else {
    res.locals.vocab_value = DEFAULT_ID;
  }

  next();
};

exports.getVocabParamsFromRequest = function(req) {
  var vocab_id = req.cookies.vocab;
  var entry = (_.find(vocabularies, function(entry) { return entry.id == vocab_id })
    || _.find(vocabularies, function(entry) { return entry.id == DEFAULT_ID }));
  return entry;
}
