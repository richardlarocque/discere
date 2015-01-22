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

var async = require('async');
var _ = require('underscore');

var latin = require('../latin');

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

