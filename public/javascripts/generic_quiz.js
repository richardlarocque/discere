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
