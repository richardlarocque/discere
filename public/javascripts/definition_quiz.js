function highlightGuessInDefinition(guess, def) {
  var filtered_guess = guess.replace(/[^A-Za-z ]/g, '');

  if (filtered_guess.length == 0) {
    return [ document.createTextNode(def) ];
  }

  // Split the definition into matching an non-matching substrings.
  var matcher = new RegExp('(' + filtered_guess + ')', 'i')
  var split = def.split(matcher)
  var nodes = split.map(function (x) { return document.createTextNode(x) } );

  // Iterate the resulting array of TextNodes.
  var result = []
  for (var i = 0; i < nodes.length; ++i) {
    var nodeText = nodes[i].nodeValue;
    if (!nodeText.match(matcher)) {
      result.push(nodes[i]);
    } else {
      // Highlight matching parts as spans.
      var span = document.createElement('span');
      span.appendChild(document.createTextNode(nodeText));
      span.className = 'highlight';
      result.push(span)
    }
  }

  // Return entire pretty array.  Result has length > 1 if guess matched.
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

  if (all_wrong) {
    imgDiv.classList.add('img-wrong');
    imgDiv.classList.remove('img-right');
  } else {
    imgDiv.classList.add('img-right');
    imgDiv.classList.remove('img-wrong');
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
