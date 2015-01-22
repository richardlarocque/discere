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
