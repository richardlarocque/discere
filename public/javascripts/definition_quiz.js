function highlightGuessInDefinition(guess, def) {
  var filtered_guess = guess.replace(/[^A-Za-z ]/g, '');

  if (filtered_guess.length == 0) {
    return [ document.createTextNode(def) ];
  }

  var split = def.split(filtered_guess)
  var nodes = split.map(function (x) { return document.createTextNode(x) } );

  var span = document.createElement('span');
  span.appendChild(document.createTextNode(filtered_guess));
  span.className = 'highlight';

  var result = []
  for (var i = 0; i < nodes.length -1; ++i) {
    result.push(nodes[i]);
    result.push(span.cloneNode(true));
  }
  result.push(nodes[nodes.length-1]);
  return result;
}

function processGuess(guess, defs) {
  var ol = document.createElement('ol');
  var all_wrong = true;
  for (var i = 0; i < defs.length; ++i) {
    var result = highlightGuessInDefinition(guess, defs[i]);
    all_wrong = all_wrong && result.length == 1;

    var li = document.createElement('li');
    for (var j = 0; j < result.length; ++j) {
      li.appendChild(result[j]);
    }
    ol.appendChild(li);
  }

  return { 'all_wrong': all_wrong, 'defs_node': ol };
}

    

function checkDefinition(answers, index) {
  var inputDiv = document.getElementById("input" + index);
  var answerDiv = document.getElementById("answer" + index);
  var imgDiv = document.getElementById("img" + index);

  var defs = answers[index].definitions;
  var guess = inputDiv.value;

  var x = processGuess(guess, defs);
  var all_wrong = x.all_wrong;
  var defs_node = x.defs_node;

  while (answerDiv.hasChildNodes()) {
    answerDiv.removeChild(answerDiv.firstChild);
  }
  answerDiv.appendChild(defs_node);

  imgDiv.className = all_wrong ? 'img-wrong' : 'img-right';

  var nextInput = document.getElementById('input' + (index + 1));
  if (nextInput) {
    nextInput.focus();
  } else {
    var submitButton = document.getElementById('submitter');
    submitButton.focus();
  }

  return false;
}
