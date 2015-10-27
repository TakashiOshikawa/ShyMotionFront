'use strict';

var BASE_URL = 'http://127.0.0.1:8080/';

var request = window.superagent;

var getTweetByInsteadID = function (instead_of_tweet_id) {
	
	var url = BASE_URL + "tweet/" + instead_of_tweet_id;

	request
	.get(url)
	.end(function(err, res){
		console.log(res.text);
	});	
}