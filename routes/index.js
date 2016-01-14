var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
	//ここにログイン処理 & リダイレクト
	req.session.user = {
		id: "test"
	};
    res.redirect('/user');
});

router.get('/logout', function(req, res, next) {
	//ここにログイン処理 & リダイレクト
	req.session.destroy();
    res.redirect('/');
});

module.exports = router;
