'use strict';

var BASE_URL = 'http://127.0.0.1:8080/';

var request = window.superagent;

/* 
reply_tweet: {
		
}
*/


/**
 * Vue.js データ start
 */


/**
 * Vue.js データ end
 */

var getTweetByInsteadID = function () {
	
	var current_url = location.href;
	var instead_of_tweet_id = current_url.match(/.*\/(\d{1,11})/);	
	var url = BASE_URL + "tweet/" + instead_of_tweet_id[1];

	request
	.get(url)
	.end(function(err, res){
		var parsed_tweet = JSON.parse(res.text);
		console.log(parsed_tweet);
		
		
		var tweet_message = new Vue({
		  el: '#tweet_message',
		  data: {
		    twitter_user_id: ' NoName',
		    secret_nick_name: 'NoName',
		    body: '',
		    date: ''
		  }
		});
		var tweet_form = new Vue({
		  el: '#tweet_form',
		  data: {
		    instead_of_tweet_id: instead_of_tweet_id[1],
			can_submit: 'none'
		  }
		});
		
		tweet_message.twitter_user_id  = parsed_tweet[0].twitter_user_id + ' ';
		tweet_message.secret_nick_name = parsed_tweet[0].secret_nick_name;
		tweet_message.body             = parsed_tweet[0].body;
		tweet_message.date             = timestampToDateTime( parsed_tweet[0].created_at );
		
		tweet_form.can_submit          = parsed_tweet[0].instead_of_tweet_id;
		
		window.self.tweet_json_data = res.text;
	});
}


var timestampToDateTime = function(timestamp) {
	timestamp    = new Date( timestamp );
	var month    = timestamp.getMonth()+1;
	var day      = timestamp.getDate();
	var hour     = timestamp.getHours();
	var minute   = timestamp.getMinutes();
	var datetime = month + "/" + day + " " + hour + ":" + minute;
	return datetime;
}


var postReplyToTweet = function (instead_of_tweet_id) {
	
	var body = document.getElementById('tweet_body');
	alert(instead_of_tweet_id + body.value);
	
}