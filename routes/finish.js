var express = require('express');
var logger = require('morgan');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('finish', { title: 'Express' });
});

module.exports = router;
