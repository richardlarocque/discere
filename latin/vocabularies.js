/*
 * Part of the Discere grammar and language quiz site.
 * Copyright (C) 2014 Richard Larocque
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA
 */

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
