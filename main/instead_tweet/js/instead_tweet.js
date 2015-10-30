'use strict';

var BASE_URL = 'http://127.0.0.1:8080/';

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


var getTweetByInsteadID = function () {
	
	var current_url = location.href;
	var instead_of_tweet_id = current_url.match(/.*\/(\d{1,11})/);	
	var url = BASE_URL + "tweet/" + instead_of_tweet_id[1];

	request
	.get(url)
	.end(function(err, res){
		var parsed_tweet = JSON.parse(res.text);
		
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
		
	});
}



var postReplyToTweet = function (instead_of_tweet_id) {
	
	var body = document.getElementById('tweet_body');
	var secret_nick_name = document.getElementById('secret_nick_name');

	var url = BASE_URL + 'reply/' + instead_of_tweet_id; 

	request
	.post(url)
	.type('form')
	.send({ body: body.value, secret_nick_name: secret_nick_name.value })
	.end(function(err, res){
		var parsed_reply = JSON.parse(res.text);

		var secret_nick_name  = parsed_reply.secret_nick_name;
		var body              = parsed_reply.body;
		var date              = timestampToDateTime(parsed_reply.created_at);
		var message = new Message(secret_nick_name, body, date);

		addMessage(message);

	});
	
}

// TODO replyのコンポーネントを作成
/*
イメージ的に
返信が0件の場合jade側のコンポーネントも非表示する
1〜10件の場合は初期表示で読み込んでそれ以降はdataのリストに追加していく感じ
*/
var reply_messages = new Vue({
	el: '#reply_messages',
	data: {
		start_num: 1,
		length: 10,
		can_display: 'none',
		messages: []
	}
});

// メッセージオブジェクトの形式
var Message = function (secret_nick_name, body, date) {
	this.secret_nick_name = secret_nick_name;
	this.body = body; 
	this.date = date;
};


var addMessage = function (message) {
	
	if (message.secret_nick_name == '')
	  message.secret_nick_name = 'No Name';
	
	reply_messages.messages.unshift( message );
	
}