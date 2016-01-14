var express = require('express');
var fs  = require('fs');
var multer  = require('multer');
var logger = require('morgan');
var router = express.Router();
var request = require('request');
var Verify = require("../models/Verify");
var parser = require('xml2json');

var upload = multer({ dest: 'uploads/' });

router.get('/', function(req, res, next) {
	res.render('import', { user_id: 'test_user' });
});

router.post('/', upload.single('input_file'), function(req, res, next) {

	console.log(req.file);
	//res.render('import', { user_id: 'test_user' });
   	Verify.findOne({ 'user_id': 'test_nishimura' }, function(err, v){
   		if(!v) return res.redirect('/user');
   		console.log( v.access_token);
		fs.readFile('./config/create.xml', 'utf8', function (err, text) {
	  		var options = {
		  		uri: v.instance_url + '/services/async/35.0/job',
		  		headers: {
			 		'content-type': 'application/xml',
			 		'X-SFDC-Session': v.access_token
				},
		 		body: text
			};
			request.post( options,  function(error, response, body){
				console.log( 'responseee' );
				console.log( body );
				var json = parser.toJson(body, {object: true});
				console.log( json );
				fs.readFile( './uploads/' + req.file.filename, 'utf8', function( err, text){
				  	var options = {
				  		uri: v.instance_url + '/services/async/35.0/job/' + json.jobInfo.id + '/batch',
				  		headers: {
					 		'content-type': 'text/csv',
					 		'X-SFDC-Session': v.access_token
						},
				 		body: text
					};
					request.post( options,  function(error, response, body){
						console.log( 'responseee2' );
						console.log( body );
						res.render('import', { user_id: 'test_user' });
					});					
				});
			});		
		});
  	});

});

module.exports = router;