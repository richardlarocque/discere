var queries = require('../modules/queries');

exports.byId = function(req, res){
  queries.fetchWord(req.params.id,
    function(err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.render('word', { word: result });
    });
};
