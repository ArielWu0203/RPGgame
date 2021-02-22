var express = require('express');
var router = express.Router();

/* GET problem listing. */
router.get('/', function(req, res, next) {
  res.render('problem', { title: 'Problem' });
});

module.exports = router;
