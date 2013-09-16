
var queries = require('../modules/queries');

exports.test = function(req, res){
  queries.fetchWord(10,
    function(err, result) {
      if (err) {
        console.log(err);
      }
      res.render('noun_table', { word: result });
    });
};
