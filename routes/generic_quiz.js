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
var async = require('async');

var latin = require('../latin');

exports.noun = function(req, res) {
  handleRequest(req, res, 'Noun');
}

exports.pronoun = function(req, res) {
  handleRequest(req, res, 'Pronoun');
}


exports.verb = function(req, res) {
  handleRequest(req, res, 'Verb');
}

exports.adjective = function(req, res) {
  handleRequest(req, res, 'Adjective');
}

exports.adverb = function(req, res) {
  handleRequest(req, res, 'Adverb');
}

var handleRequest = function(req, res, partOfSpeech) {
  async.waterfall([
    async.apply(latin.weightedRandomWordIdForPartQuiz,
                partOfSpeech,
                latin.getVocabParamsFromRequest(req)),
    async.apply(makeQuiz)
  ], function(err, quiz) {
    if (err) {
      console.log(err);
      res.send(500);
      return;
    }
    res.render('generic_quiz', quiz);
  });
}

var makeQuiz = function(id, callback) {
  latin.fetchWord(id, function(err, word) {
    if (err) {
      callback(err);
      return;
    }

    randomizedFormList = makeFormList(word.part_of_speech);

    var n = 10;

    formNames = _.first(_.keys(_.pick(word.forms, randomizedFormList)), n);
    formValues = _.first(_.values(_.pick(word.forms, randomizedFormList)), n);
    formMacronlessValues = _.first(_.values(_.pick(word.unmacron_forms, randomizedFormList)), n);

    callback(null, { 'word' : word,
                     'questions': formNames,
                     'answers': formMacronlessValues,
                     'displayAnswers': formValues });
  });
}

var selectWeightMap = function(partOfSpeech) {
  if (partOfSpeech == 'Noun') {
    return nounFormWeights;
  } else if (partOfSpeech == 'Pronoun') {
    return pronounFormWeights;
  } else if (partOfSpeech == 'Verb') {
    return verbFormWeights;
  } else if (partOfSpeech == 'Adjective') {
    return adjectiveFormWeights;
  } else if (partOfSpeech == 'Adverb') {
    return adverbFormWeights;
  } else {
    return [];
  }
}

var makeFormList = function(partOfSpeech) {
  var weightMap = selectWeightMap(partOfSpeech);
  var len = weightMap.length;

  var indexArray = []
  for (var i = 0; i < len; ++i) {
    indexArray[i] = i;
  }

  var sum = _.reduce(weightMap, function (memo, entry) { return memo + entry.weight; }, 0);

  for(var i = len - 1; i > 0; --i) {
    var accum = Math.floor(Math.random() * (sum + 1));
    var j = -1;
    do {
      j++;
      accum = accum - weightMap[indexArray[j]].weight;
    } while (accum > 0);
    sum = sum - weightMap[indexArray[j]].weight;
    var tmp = indexArray[i];
    indexArray[i] = indexArray[j];
    indexArray[j] = tmp; 
  }

  var result = []
  for (var i = len - 1; i >= 0; --i) {
    result.push(weightMap[indexArray[i]].form);
  }
  return result;
}

var verbFormWeights = [
     { form: 'Indicative Active Present Singular First', weight: 20 },
     { form: 'Indicative Active Present Singular Second', weight: 20 },
     { form: 'Indicative Active Present Singular Third', weight: 20 },
     { form: 'Indicative Active Present Plural First', weight: 20 },
     { form: 'Indicative Active Present Plural Second', weight: 20 },
     { form: 'Indicative Active Present Plural Third', weight: 20 },
     { form: 'Indicative Active Imperfect Singular First', weight: 20 },
     { form: 'Indicative Active Imperfect Singular Second', weight: 20 },
     { form: 'Indicative Active Imperfect Singular Third', weight: 20 },
     { form: 'Indicative Active Imperfect Plural First', weight: 20 },
     { form: 'Indicative Active Imperfect Plural Second', weight: 20 },
     { form: 'Indicative Active Imperfect Plural Third', weight: 20 },
     { form: 'Indicative Active Future Singular First', weight: 20 },
     { form: 'Indicative Active Future Singular Second', weight: 20 },
     { form: 'Indicative Active Future Singular Third', weight: 20 },
     { form: 'Indicative Active Future Plural First', weight: 20 },
     { form: 'Indicative Active Future Plural Second', weight: 20 },
     { form: 'Indicative Active Future Plural Third', weight: 20 },
     { form: 'Indicative Active Perfect Singular First', weight: 20 },
     { form: 'Indicative Active Perfect Singular Second', weight: 20 },
     { form: 'Indicative Active Perfect Singular Third', weight: 20 },
     { form: 'Indicative Active Perfect Plural First', weight: 20 },
     { form: 'Indicative Active Perfect Plural Second', weight: 20 },
     { form: 'Indicative Active Perfect Plural Third', weight: 20 },
     { form: 'Indicative Active Pluperfect Singular First', weight: 20 },
     { form: 'Indicative Active Pluperfect Singular Second', weight: 20 },
     { form: 'Indicative Active Pluperfect Singular Third', weight: 20 },
     { form: 'Indicative Active Pluperfect Plural First', weight: 20 },
     { form: 'Indicative Active Pluperfect Plural Second', weight: 20 },
     { form: 'Indicative Active Pluperfect Plural Third', weight: 20 },
     { form: 'Indicative Active FuturePerfect Singular First', weight: 20 },
     { form: 'Indicative Active FuturePerfect Singular Second', weight: 20 },
     { form: 'Indicative Active FuturePerfect Singular Third', weight: 20 },
     { form: 'Indicative Active FuturePerfect Plural First', weight: 20 },
     { form: 'Indicative Active FuturePerfect Plural Second', weight: 20 },
     { form: 'Indicative Active FuturePerfect Plural Third', weight: 20 },
     { form: 'Indicative Passive Present Singular First', weight: 20 },
     { form: 'Indicative Passive Present Singular Second', weight: 20 },
     { form: 'Indicative Passive Present Singular Third', weight: 20 },
     { form: 'Indicative Passive Present Plural First', weight: 20 },
     { form: 'Indicative Passive Present Plural Second', weight: 20 },
     { form: 'Indicative Passive Present Plural Third', weight: 20 },
     { form: 'Indicative Passive Imperfect Singular First', weight: 20 },
     { form: 'Indicative Passive Imperfect Singular Second', weight: 20 },
     { form: 'Indicative Passive Imperfect Singular Third', weight: 20 },
     { form: 'Indicative Passive Imperfect Plural First', weight: 20 },
     { form: 'Indicative Passive Imperfect Plural Second', weight: 20 },
     { form: 'Indicative Passive Imperfect Plural Third', weight: 20 },
     { form: 'Indicative Passive Future Singular First', weight: 20 },
     { form: 'Indicative Passive Future Singular Second', weight: 20 },
     { form: 'Indicative Passive Future Singular Third', weight: 20 },
     { form: 'Indicative Passive Future Plural First', weight: 20 },
     { form: 'Indicative Passive Future Plural Second', weight: 20 },
     { form: 'Indicative Passive Future Plural Third', weight: 20 },
     { form: 'Indicative Passive Perfect Singular First', weight: 20 },
     { form: 'Indicative Passive Perfect Singular Second', weight: 20 },
     { form: 'Indicative Passive Perfect Singular Third', weight: 20 },
     { form: 'Indicative Passive Perfect Plural First', weight: 20 },
     { form: 'Indicative Passive Perfect Plural Second', weight: 20 },
     { form: 'Indicative Passive Perfect Plural Third', weight: 20 },
     { form: 'Indicative Passive Pluperfect Singular First', weight: 20 },
     { form: 'Indicative Passive Pluperfect Singular Second', weight: 20 },
     { form: 'Indicative Passive Pluperfect Singular Third', weight: 20 },
     { form: 'Indicative Passive Pluperfect Plural First', weight: 20 },
     { form: 'Indicative Passive Pluperfect Plural Second', weight: 20 },
     { form: 'Indicative Passive Pluperfect Plural Third', weight: 20 },
     { form: 'Indicative Passive FuturePerfect Singular First', weight: 20 },
     { form: 'Indicative Passive FuturePerfect Singular Second', weight: 20 },
     { form: 'Indicative Passive FuturePerfect Singular Third', weight: 20 },
     { form: 'Indicative Passive FuturePerfect Plural First', weight: 20 },
     { form: 'Indicative Passive FuturePerfect Plural Second', weight: 20 },
     { form: 'Indicative Passive FuturePerfect Plural Third', weight: 20 },
     { form: 'Subjunctive Active Present Singular First', weight: 20 },
     { form: 'Subjunctive Active Present Singular Second', weight: 20 },
     { form: 'Subjunctive Active Present Singular Third', weight: 20 },
     { form: 'Subjunctive Active Present Plural First', weight: 20 },
     { form: 'Subjunctive Active Present Plural Second', weight: 20 },
     { form: 'Subjunctive Active Present Plural Third', weight: 20 },
     { form: 'Subjunctive Active Imperfect Singular First', weight: 20 },
     { form: 'Subjunctive Active Imperfect Singular Second', weight: 20 },
     { form: 'Subjunctive Active Imperfect Singular Third', weight: 20 },
     { form: 'Subjunctive Active Imperfect Plural First', weight: 20 },
     { form: 'Subjunctive Active Imperfect Plural Second', weight: 20 },
     { form: 'Subjunctive Active Imperfect Plural Third', weight: 20 },
     { form: 'Subjunctive Active Perfect Singular First', weight: 20 },
     { form: 'Subjunctive Active Perfect Singular Second', weight: 20 },
     { form: 'Subjunctive Active Perfect Singular Third', weight: 20 },
     { form: 'Subjunctive Active Perfect Plural First', weight: 20 },
     { form: 'Subjunctive Active Perfect Plural Second', weight: 20 },
     { form: 'Subjunctive Active Perfect Plural Third', weight: 20 },
     { form: 'Subjunctive Active Pluperfect Singular First', weight: 20 },
     { form: 'Subjunctive Active Pluperfect Singular Second', weight: 20 },
     { form: 'Subjunctive Active Pluperfect Singular Third', weight: 20 },
     { form: 'Subjunctive Active Pluperfect Plural First', weight: 20 },
     { form: 'Subjunctive Active Pluperfect Plural Second', weight: 20 },
     { form: 'Subjunctive Active Pluperfect Plural Third', weight: 20 },
     { form: 'Subjunctive Passive Present Singular First', weight: 20 },
     { form: 'Subjunctive Passive Present Singular Second', weight: 20 },
     { form: 'Subjunctive Passive Present Singular Third', weight: 20 },
     { form: 'Subjunctive Passive Present Plural First', weight: 20 },
     { form: 'Subjunctive Passive Present Plural Second', weight: 20 },
     { form: 'Subjunctive Passive Present Plural Third', weight: 20 },
     { form: 'Subjunctive Passive Imperfect Singular First', weight: 20 },
     { form: 'Subjunctive Passive Imperfect Singular Second', weight: 20 },
     { form: 'Subjunctive Passive Imperfect Singular Third', weight: 20 },
     { form: 'Subjunctive Passive Imperfect Plural First', weight: 20 },
     { form: 'Subjunctive Passive Imperfect Plural Second', weight: 20 },
     { form: 'Subjunctive Passive Imperfect Plural Third', weight: 20 },
     { form: 'Subjunctive Passive Perfect Singular First', weight: 20 },
     { form: 'Subjunctive Passive Perfect Singular Second', weight: 20 },
     { form: 'Subjunctive Passive Perfect Singular Third', weight: 20 },
     { form: 'Subjunctive Passive Perfect Plural First', weight: 20 },
     { form: 'Subjunctive Passive Perfect Plural Second', weight: 20 },
     { form: 'Subjunctive Passive Perfect Plural Third', weight: 20 },
     { form: 'Subjunctive Passive Pluperfect Singular First', weight: 20 },
     { form: 'Subjunctive Passive Pluperfect Singular Second', weight: 20 },
     { form: 'Subjunctive Passive Pluperfect Singular Third', weight: 20 },
     { form: 'Subjunctive Passive Pluperfect Plural First', weight: 20 },
     { form: 'Subjunctive Passive Pluperfect Plural Second', weight: 20 },
     { form: 'Subjunctive Passive Pluperfect Plural Third', weight: 20 },
     { form: 'Imperative Singular', weight: 60 },
     { form: 'Imperative Plural', weight: 60 },
     { form: 'Active Present Infinitive', weight: 50 },
     { form: 'Active Perfect Infinitive', weight: 50 },
     { form: 'Active Future Infinitive', weight: 50 },
     { form: 'Passive Present Infinitive', weight: 50 },
     { form: 'Passive Perfect Infinitive', weight: 50 },
     { form: 'Passive Future Infinitive', weight: 50 },
     { form: 'Nominative Singular Masculine Active Present Participle', weight: 1 },
     { form: 'Nominative Singular Feminine Active Present Participle', weight: 1 },
     { form: 'Nominative Singular Neuter Active Present Participle', weight: 1 },
     { form: 'Nominative Plural Masculine Active Present Participle', weight: 1 },
     { form: 'Nominative Plural Feminine Active Present Participle', weight: 1 },
     { form: 'Nominative Plural Neuter Active Present Participle', weight: 1 },
     { form: 'Genitive Singular Masculine Active Present Participle', weight: 1 },
     { form: 'Genitive Singular Feminine Active Present Participle', weight: 1 },
     { form: 'Genitive Singular Neuter Active Present Participle', weight: 1 },
     { form: 'Genitive Plural Masculine Active Present Participle', weight: 1 },
     { form: 'Genitive Plural Feminine Active Present Participle', weight: 1 },
     { form: 'Genitive Plural Neuter Active Present Participle', weight: 1 },
     { form: 'Dative Singular Masculine Active Present Participle', weight: 1 },
     { form: 'Dative Singular Feminine Active Present Participle', weight: 1 },
     { form: 'Dative Singular Neuter Active Present Participle', weight: 1 },
     { form: 'Dative Plural Masculine Active Present Participle', weight: 1 },
     { form: 'Dative Plural Feminine Active Present Participle', weight: 1 },
     { form: 'Dative Plural Neuter Active Present Participle', weight: 1 },
     { form: 'Nominative Singular Masculine Active Perfect Participle', weight: 1 },
     { form: 'Nominative Singular Feminine Active Perfect Participle', weight: 1 },
     { form: 'Nominative Singular Neuter Active Perfect Participle', weight: 1 },
     { form: 'Nominative Plural Masculine Active Perfect Participle', weight: 1 },
     { form: 'Nominative Plural Feminine Active Perfect Participle', weight: 1 },
     { form: 'Nominative Plural Neuter Active Perfect Participle', weight: 1 },
     { form: 'Genitive Singular Masculine Active Perfect Participle', weight: 1 },
     { form: 'Genitive Singular Feminine Active Perfect Participle', weight: 1 },
     { form: 'Genitive Singular Neuter Active Perfect Participle', weight: 1 },
     { form: 'Genitive Plural Masculine Active Perfect Participle', weight: 1 },
     { form: 'Genitive Plural Feminine Active Perfect Participle', weight: 1 },
     { form: 'Genitive Plural Neuter Active Perfect Participle', weight: 1 },
     { form: 'Dative Singular Masculine Active Perfect Participle', weight: 1 },
     { form: 'Dative Singular Feminine Active Perfect Participle', weight: 1 },
     { form: 'Dative Singular Neuter Active Perfect Participle', weight: 1 },
     { form: 'Dative Plural Masculine Active Perfect Participle', weight: 1 },
     { form: 'Dative Plural Feminine Active Perfect Participle', weight: 1 },
     { form: 'Dative Plural Neuter Active Perfect Participle', weight: 1 },
     { form: 'Accusative Singular Masculine Active Perfect Participle', weight: 1 },
     { form: 'Accusative Singular Feminine Active Perfect Participle', weight: 1 },
     { form: 'Accusative Singular Neuter Active Perfect Participle', weight: 1 },
     { form: 'Accusative Plural Masculine Active Perfect Participle', weight: 1 },
     { form: 'Accusative Plural Feminine Active Perfect Participle', weight: 1 },
     { form: 'Accusative Plural Neuter Active Perfect Participle', weight: 1 },
     { form: 'Ablative Singular Masculine Active Perfect Participle', weight: 1 },
     { form: 'Ablative Singular Feminine Active Perfect Participle', weight: 1 },
     { form: 'Ablative Singular Neuter Active Perfect Participle', weight: 1 },
     { form: 'Ablative Plural Masculine Active Perfect Participle', weight: 1 },
     { form: 'Ablative Plural Feminine Active Perfect Participle', weight: 1 },
     { form: 'Ablative Plural Neuter Active Perfect Participle', weight: 1 },
     { form: 'Nominative Singular Masculine Active Future Participle', weight: 1 },
     { form: 'Nominative Singular Feminine Active Future Participle', weight: 1 },
     { form: 'Nominative Singular Neuter Active Future Participle', weight: 1 },
     { form: 'Nominative Plural Masculine Active Future Participle', weight: 1 },
     { form: 'Nominative Plural Feminine Active Future Participle', weight: 1 },
     { form: 'Nominative Plural Neuter Active Future Participle', weight: 1 },
     { form: 'Genitive Singular Masculine Active Future Participle', weight: 1 },
     { form: 'Genitive Singular Feminine Active Future Participle', weight: 1 },
     { form: 'Genitive Singular Neuter Active Future Participle', weight: 1 },
     { form: 'Genitive Plural Masculine Active Future Participle', weight: 1 },
     { form: 'Genitive Plural Feminine Active Future Participle', weight: 1 },
     { form: 'Genitive Plural Neuter Active Future Participle', weight: 1 },
     { form: 'Dative Singular Masculine Active Future Participle', weight: 1 },
     { form: 'Dative Singular Feminine Active Future Participle', weight: 1 },
     { form: 'Dative Singular Neuter Active Future Participle', weight: 1 },
     { form: 'Dative Plural Masculine Active Future Participle', weight: 1 },
     { form: 'Dative Plural Feminine Active Future Participle', weight: 1 },
     { form: 'Dative Plural Neuter Active Future Participle', weight: 1 },
     { form: 'Accusative Singular Masculine Active Future Participle', weight: 1 },
     { form: 'Accusative Singular Feminine Active Future Participle', weight: 1 },
     { form: 'Accusative Singular Neuter Active Future Participle', weight: 1 },
     { form: 'Accusative Plural Masculine Active Future Participle', weight: 1 },
     { form: 'Accusative Plural Feminine Active Future Participle', weight: 1 },
     { form: 'Accusative Plural Neuter Active Future Participle', weight: 1 },
     { form: 'Ablative Singular Masculine Active Future Participle', weight: 1 },
     { form: 'Ablative Singular Feminine Active Future Participle', weight: 1 },
     { form: 'Ablative Singular Neuter Active Future Participle', weight: 1 },
     { form: 'Ablative Plural Masculine Active Future Participle', weight: 1 },
     { form: 'Ablative Plural Feminine Active Future Participle', weight: 1 },
     { form: 'Ablative Plural Neuter Active Future Participle', weight: 1 },
     { form: 'Nominative Singular Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Nominative Singular Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Nominative Singular Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Nominative Plural Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Nominative Plural Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Nominative Plural Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Genitive Singular Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Genitive Singular Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Genitive Singular Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Genitive Plural Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Genitive Plural Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Genitive Plural Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Dative Singular Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Dative Singular Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Dative Singular Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Dative Plural Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Dative Plural Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Dative Plural Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Accusative Singular Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Accusative Singular Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Accusative Singular Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Accusative Plural Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Accusative Plural Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Accusative Plural Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Ablative Singular Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Ablative Singular Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Ablative Singular Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Ablative Plural Masculine Passive Perfect Participle', weight: 1 },
     { form: 'Ablative Plural Feminine Passive Perfect Participle', weight: 1 },
     { form: 'Ablative Plural Neuter Passive Perfect Participle', weight: 1 },
     { form: 'Nominative Singular Masculine Passive Future Participle', weight: 1 },
     { form: 'Nominative Singular Feminine Passive Future Participle', weight: 1 },
     { form: 'Nominative Singular Neuter Passive Future Participle', weight: 1 },
     { form: 'Nominative Plural Masculine Passive Future Participle', weight: 1 },
     { form: 'Nominative Plural Feminine Passive Future Participle', weight: 1 },
     { form: 'Nominative Plural Neuter Passive Future Participle', weight: 1 },
     { form: 'Genitive Singular Masculine Passive Future Participle', weight: 1 },
     { form: 'Genitive Singular Feminine Passive Future Participle', weight: 1 },
     { form: 'Genitive Singular Neuter Passive Future Participle', weight: 1 },
     { form: 'Genitive Plural Masculine Passive Future Participle', weight: 1 },
     { form: 'Genitive Plural Feminine Passive Future Participle', weight: 1 },
     { form: 'Genitive Plural Neuter Passive Future Participle', weight: 1 },
     { form: 'Dative Singular Masculine Passive Future Participle', weight: 1 },
     { form: 'Dative Singular Feminine Passive Future Participle', weight: 1 },
     { form: 'Dative Singular Neuter Passive Future Participle', weight: 1 },
     { form: 'Dative Plural Masculine Passive Future Participle', weight: 1 },
     { form: 'Dative Plural Feminine Passive Future Participle', weight: 1 },
     { form: 'Dative Plural Neuter Passive Future Participle', weight: 1 },
     { form: 'Accusative Singular Masculine Passive Future Participle', weight: 1 },
     { form: 'Accusative Singular Feminine Passive Future Participle', weight: 1 },
     { form: 'Accusative Singular Neuter Passive Future Participle', weight: 1 },
     { form: 'Accusative Plural Masculine Passive Future Participle', weight: 1 },
     { form: 'Accusative Plural Feminine Passive Future Participle', weight: 1 },
     { form: 'Accusative Plural Neuter Passive Future Participle', weight: 1 },
     { form: 'Ablative Singular Masculine Passive Future Participle', weight: 1 },
     { form: 'Ablative Singular Feminine Passive Future Participle', weight: 1 },
     { form: 'Ablative Singular Neuter Passive Future Participle', weight: 1 },
     { form: 'Ablative Plural Masculine Passive Future Participle', weight: 1 },
     { form: 'Ablative Plural Feminine Passive Future Participle', weight: 1 },
     { form: 'Ablative Plural Neuter Passive Future Participle', weight: 1 }
]

var nounFormWeights = [
    { form: 'Nominative Singular', weight: 10 },
    { form: 'Nominative Plural', weight: 10 },
    { form: 'Genitive Singular', weight: 10 },
    { form: 'Genitive Plural', weight: 10 },
    { form: 'Dative Singular', weight: 10 },
    { form: 'Dative Plural', weight: 10 },
    { form: 'Accusative Singular', weight: 10 },
    { form: 'Accusative Plural', weight: 10 },
    { form: 'Ablative Singular', weight: 10 },
    { form: 'Ablative Plural', weight: 10 },
    { form: 'Vocative Singular', weight: 5 },
    { form: 'Vocative Plural', weight: 5 },
    { form: 'Locative Singular', weight: 2 },
    { form: 'Locative Plural', weight: 2 }
]

var adjectiveFormWeights = [
    { form: 'Nominative Singular Masculine', weight: 10 },
    { form: 'Nominative Singular Feminine', weight: 10 },
    { form: 'Nominative Singular Neuter', weight: 10 },
    { form: 'Nominative Plural Masculine', weight: 10 },
    { form: 'Nominative Plural Feminine', weight: 10 },
    { form: 'Nominative Plural Neuter', weight: 10 },
    { form: 'Genitive Singular Masculine', weight: 10 },
    { form: 'Genitive Singular Feminine', weight: 10 },
    { form: 'Genitive Singular Neuter', weight: 10 },
    { form: 'Genitive Plural Masculine', weight: 10 },
    { form: 'Genitive Plural Feminine', weight: 10 },
    { form: 'Genitive Plural Neuter', weight: 10 },
    { form: 'Dative Singular Masculine', weight: 10 },
    { form: 'Dative Singular Feminine', weight: 10 },
    { form: 'Dative Singular Neuter', weight: 10 },
    { form: 'Dative Plural Masculine', weight: 10 },
    { form: 'Dative Plural Feminine', weight: 10 },
    { form: 'Dative Plural Neuter', weight: 10 },
    { form: 'Accusative Singular Masculine', weight: 10 },
    { form: 'Accusative Singular Feminine', weight: 10 },
    { form: 'Accusative Singular Neuter', weight: 10 },
    { form: 'Accusative Plural Masculine', weight: 10 },
    { form: 'Accusative Plural Feminine', weight: 10 },
    { form: 'Accusative Plural Neuter', weight: 10 },
    { form: 'Ablative Singular Masculine', weight: 10 },
    { form: 'Ablative Singular Feminine', weight: 10 },
    { form: 'Ablative Singular Neuter', weight: 10 },
    { form: 'Ablative Plural Masculine', weight: 10 },
    { form: 'Ablative Plural Feminine', weight: 10 },
    { form: 'Ablative Plural Neuter', weight: 10 },
    { form: 'Vocative Singular Masculine', weight: 3 },
    { form: 'Vocative Singular Feminine', weight: 3 },
    { form: 'Vocative Singular Neuter', weight: 3 },
    { form: 'Vocative Plural Masculine', weight: 3 },
    { form: 'Vocative Plural Feminine', weight: 3 },
    { form: 'Vocative Plural Neuter', weight: 3 },
]

var adverbFormWeights = [
    { form: 'Positive', weight: 1 },
    { form: 'Comparative', weight: 1 },
    { form: 'Superlative', weight: 1 },
]

var pronounFormWeights = [
    { form: 'Nominative Singular Masculine', weight: 10 },
    { form: 'Nominative Singular Feminine', weight: 10 },
    { form: 'Nominative Singular Neuter', weight: 10 },
    { form: 'Nominative Plural Masculine', weight: 10 },
    { form: 'Nominative Plural Feminine', weight: 10 },
    { form: 'Nominative Plural Neuter', weight: 10 },
    { form: 'Genitive Singular Masculine', weight: 10 },
    { form: 'Genitive Singular Feminine', weight: 10 },
    { form: 'Genitive Singular Neuter', weight: 10 },
    { form: 'Genitive Plural Masculine', weight: 10 },
    { form: 'Genitive Plural Feminine', weight: 10 },
    { form: 'Genitive Plural Neuter', weight: 10 },
    { form: 'Dative Singular Masculine', weight: 10 },
    { form: 'Dative Singular Feminine', weight: 10 },
    { form: 'Dative Singular Neuter', weight: 10 },
    { form: 'Dative Plural Masculine', weight: 10 },
    { form: 'Dative Plural Feminine', weight: 10 },
    { form: 'Dative Plural Neuter', weight: 10 },
    { form: 'Accusative Singular Masculine', weight: 10 },
    { form: 'Accusative Singular Feminine', weight: 10 },
    { form: 'Accusative Singular Neuter', weight: 10 },
    { form: 'Accusative Plural Masculine', weight: 10 },
    { form: 'Accusative Plural Feminine', weight: 10 },
    { form: 'Accusative Plural Neuter', weight: 10 },
    { form: 'Ablative Singular Masculine', weight: 10 },
    { form: 'Ablative Singular Feminine', weight: 10 },
    { form: 'Ablative Singular Neuter', weight: 10 },
    { form: 'Ablative Plural Masculine', weight: 10 },
    { form: 'Ablative Plural Feminine', weight: 10 },
    { form: 'Ablative Plural Neuter', weight: 10 },
    { form: 'Nominative Singular', weight: 10 },
    { form: 'Nominative Plural', weight: 10 },
    { form: 'Genitive Singular', weight: 10 },
    { form: 'Genitive Plural', weight: 10 },
    { form: 'Dative Singular', weight: 10 },
    { form: 'Dative Plural', weight: 10 },
    { form: 'Accusative Singular', weight: 10 },
    { form: 'Accusative Plural', weight: 10 },
    { form: 'Ablative Singular', weight: 10 },
    { form: 'Ablative Plural', weight: 10 }
]
