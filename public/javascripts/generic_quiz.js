function checkAnswer(answers, index) {
  var inputDiv = document.getElementById("input" + index);
  var answerDiv = document.getElementById("answer" + index);
  var imgDiv = document.getElementById("img" + index);

  var answer = answers[index];
  var displayAnswer = displayAnswers[index];
  var guess = inputDiv.value;

  var correct = (answer == guess)

  while (answerDiv.hasChildNodes()) {
    answerDiv.removeChild(answerDiv.firstChild);
  }
  answerDiv.appendChild(document.createTextNode(displayAnswer));

  imgDiv.className = correct ? 'img-right' : 'img-wrong';

  var nextInput = document.getElementById('input' + (index + 1));
  if (nextInput) {
    nextInput.focus();
  } else {
    var submitButton = document.getElementById('submitter');
    submitButton.focus();
  }

  return false;
}
