var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();
var request = require('request');
var Verify = require("../models/Verify");

var CLIENT_ID = "3MVG9ZL0ppGP5UrANnvfm8SMkzXv2sbywTaS9crIPVF4Vd_N6Ja4OmFb7eReWuFnxtjfauCMVVmyuxgLxumBn";
var CLIENT_SECRET = "4674444424899036579";
var REDIRECT_URI = "https://sf-link-app.local/verify/comp";
var TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";

router.get('/', function(req, res, next) {
	Verify.findOne({ 'user_id': 'test_nishimura' }, function(err, v){
    	console.log( v );
		if( v ){
			res.redirect('/verify/conf');
		}else{
			res.redirect("https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI);
		}
	});	
});

router.get('/to', function(req, res, next) {
	Verify.findOne({ 'user_id': 'test_nishimura' } , function(err, v){
    	if( err ) return res.redirect('/');
    	console.log( v );
    	if( v ) v.remove();
		res.redirect("https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI);
  	});
});

router.get('/conf', function(req, res, next) {
	res.render('verify/confirm', { sf_user_id: 'testttt' });
});

router.get("/comp", function(req, res, next){

	console.log( "code = " + req.query.code);

	var code = req.query.code;
	var options = {
  		uri: TOKEN_URL,
  		form: { 
			code: code,
			grant_type: "authorization_code" ,
			client_id: CLIENT_ID ,
			client_secret: CLIENT_SECRET ,
			redirect_uri: REDIRECT_URI ,
  		},
  		json: true
	};
	request.post( options,  function(error, response, body){
		console.log( body );
  		if (!error && response.statusCode == 200) {
  			Verify.findOne({ 'user_id': 'test_nishimura'}, function(err, v){
  				console.log( v );
  				if( !v ){
					var verify = new Verify;
					verify.user_id = "test_nishimura";	
					verify.access_token = body.access_token;	
					verify.signature = body.signature;	
					verify.organization_id = body.id;	
					verify.instance_url = body.instance_url;	
					verify.save( function(err){
						console.log( err );
						res.redirect('/user');
					})
  				}else{
					res.redirect('/user');
  				}
			});
  		} else {
    		console.log('error: '+ response.statusCode);
    		res.render('error', {message: error});
		}
	});	

});

module.exports = router;