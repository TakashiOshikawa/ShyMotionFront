'use strict';


var BASE_URL = 'http://127.0.0.1:8080/';
var request = window.superagent;

var getTweet = function () {
	
	var url = BASE_URL + "reply/1/1/10";

	request
	.get(url)
	.end(function(err, res){
		console.log(res.text);//レスポンス
		//レスポンスがJSONの場合 
		console.log(res.body);//ここにparse済みのオブジェクトが入る
	});	
}


var postTweet = function() {
	
	var twitter_user_id = document.getElementById('twitter_user_id').value;
	var body            = document.getElementById('tweet_body').value;
	// TODO secret_nick_nameを入力させる
	var secret_nick_name = 'test nick name';
	
	var url = BASE_URL + 'tweet';
	
	request
	.post(url)
	.type('form')
	.send({ user_id: twitter_user_id, body: body, secret_nick_name: secret_nick_name })
	.end(function(err, res){
		console.log(res.text);//レスポンス
		//レスポンスがJSONの場合 
		console.log(res.body);//ここにparse済みのオブジェクトが入る
	});

}