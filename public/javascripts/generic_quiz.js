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

function checkAnswer(answers, index) {
  var inputDiv = document.getElementById("input" + index);
  var answerDiv = document.getElementById("answer" + index);
  var imgDiv = document.getElementById("img" + index);

  var answer = answers[index];
  var displayAnswer = displayAnswers[index];
  var guess = inputDiv.value;

  var correct = (answer == guess.toLowerCase())

  while (answerDiv.hasChildNodes()) {
    answerDiv.removeChild(answerDiv.firstChild);
  }
  answerDiv.appendChild(document.createTextNode(displayAnswer));

  if (correct) {
    imgDiv.classList.add('img-right');
    imgDiv.classList.remove('img-wrong');
  } else {
    imgDiv.classList.add('img-wrong');
    imgDiv.classList.remove('img-right');
  }

  var nextInput = document.getElementById('input' + (index + 1));
  if (nextInput) {
    nextInput.focus();
  } else {
    var submitButton = document.getElementById('submitter');
    submitButton.focus();
  }

  return false;
}
