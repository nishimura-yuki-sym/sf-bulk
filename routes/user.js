var express = require('express');
var router = express.Router();
var Verify = require("../models/Verify");

router.get('/', function(req, res, next) {
	Verify.findOne( { 'user_id': 'test_nishimura' }, function(err, v){
    	console.log( v );
		var is_verify = false;
		if( v ){
			is_verify = true;
		}
		res.render('user', { 
			user_id: 'test_user' , 
			is_verify: is_verify 
		});
	});	
});

module.exports = router;