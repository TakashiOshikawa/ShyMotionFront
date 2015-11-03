'use strict';

var BASE_URL  = 'http://127.0.0.1:8080/';
var FRONT_URL = 'http://127.0.0.1:4000/';

var request = window.superagent;


var timestampToDateTime = function(timestamp) {
	timestamp    = new Date( timestamp );
	var month    = timestamp.getMonth()+1;
	var day      = timestamp.getDate();
	var hour     = timestamp.getHours();
	var minute   = timestamp.getMinutes();
	var datetime = month + "/" + day + " " + hour + ":" + minute;
	return datetime;
}


var search_form = new Vue({
	el: '#search_form',
	data: {
		twitter_user_id: ''
	}
});

var result_message = new Vue({
	el: '#result_message',
	data: {
		search_twitter_user_id: '',
		can_display: 'none'
	}
});

var non_result_tweet = new Vue({
	el: '#non_result_tweet',
	data: {
		is_display: 'none'
	}
});

var instead_tweets = new Vue({
	el: '#instead_tweets',
	data: {
		start_num: 1,
		length: 10,
		can_display: 'none',
		tweets: [],
		instead_tweet_ids: []
	}
});


var InsteadTweet = function (twitter_user_id, instead_of_tweet_id, secret_nick_name, body, date, instead_tweet_url) {
	this.twitter_user_id     = twitter_user_id;
	this.instead_of_tweet_id = instead_of_tweet_id;
	this.secret_nick_name    = secret_nick_name;
	this.body                = body;
	this.date                = date;
	this.instead_tweet_url   = instead_tweet_url;
}


var initTweetSearchData = function () {
	instead_tweets.start_num              = 1;
	instead_tweets.length                 = 10;
	instead_tweets.can_display            = 'none';
	instead_tweets.tweets                 = [];
	instead_tweets.instead_tweet_ids      = [];
	non_result_tweet.is_display           = 'none';
	result_message.can_display            = 'none';
}


var addInsteadTweet = function (instead_tweet, add_type) {
	
	if (instead_tweet.secret_nick_name == '')
	  instead_tweet.secret_nick_name = 'No Name';
	
	if (add_type == 'post_instead_of_tweet')
	  instead_tweets.tweets.unshift( instead_tweet );
	else if (add_type == 'fetch_instead_of_tweet')
	  instead_tweets.tweets.push( instead_tweet );
	
	instead_tweets.instead_tweet_ids.push(instead_tweet.instead_of_tweet_id);
}


var seachTweetByUserID = function (twitter_user_id, reset) {
	
	if ( reset == true ) initTweetSearchData();
	
	var url = BASE_URL + 'tweetbyuserid/' +
	                      search_form.twitter_user_id + '/' +
						  instead_tweets.start_num + '/' +
						  instead_tweets.length;

	
	request
	.get(url)
	.end(function(err, res){
		var parsed_tweets = JSON.parse(res.text);
		
		if ( parsed_tweets.instead_of_tweet_id == 0 ) {
			non_result_tweet.is_display = '';
			result_message.can_display  = 'none';
			return;
		}
		result_message.can_display  = '';

		instead_tweets.start_num += 10;
		
		for(var n in parsed_tweets) {
		  if ( instead_tweets.instead_tweet_ids.indexOf(parsed_tweets[n].instead_of_tweet_id) != -1 ) continue;
		  var twitter_user_id      = parsed_tweets[n].twitter_user_id + ' ';
		  var instead_of_tweet_id  = parsed_tweets[n].instead_of_tweet_id;
		  var secret_nick_name     = parsed_tweets[n].secret_nick_name;
		  var body                 = parsed_tweets[n].body;
		  var date                 = timestampToDateTime(parsed_tweets[n].created_at);
		  var instead_tweet_url    = FRONT_URL + 'instead_tweet/' + instead_of_tweet_id
		  var tweet = new InsteadTweet(twitter_user_id, instead_of_tweet_id, secret_nick_name, body, date, instead_tweet_url);
		  
		  result_message.search_twitter_user_id  = twitter_user_id;
		  instead_tweets.can_display = parsed_tweets[n].instead_of_tweet_id;
		  addInsteadTweet( tweet, 'fetch_instead_of_tweet' );
		
		}
	});	
}