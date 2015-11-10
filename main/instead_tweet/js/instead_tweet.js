'use strict';


var request = window.superagent;

var initDisplay = function () {
	getTweetByInsteadID();
	getReplyToTweet();
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

var tweet_message = new Vue({
	el: '#tweet_message',
	data: {
	  twitter_user_id: ' NoName',
	  secret_nick_name: 'NoName',
	  instead_of_tweet_id: 0,
	  body: '',
	  date: ''
	}
});

var getTweetByInsteadID = function () {
	
	var current_url = location.href;
	var instead_of_tweet_id = current_url.match(/.*\/(\d{1,11})/);	
	var url = BACK_BASE_URL + "tweet/" + instead_of_tweet_id[1];
	tweet_message.instead_of_tweet_id = instead_of_tweet_id[1];

	request
	.get(url)
	.end(function(err, res){
		var parsed_tweet = JSON.parse(res.text);
		
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

	var url = BACK_BASE_URL + 'reply/' + instead_of_tweet_id;

	// validate	
	var check_flg = inputLengthValidation(secret_nick_name.value, 15, '※ニックネームは15文字以内で入力してね', true);
	check_flg = check_flg == true ? inputLengthValidation(body.value, 140, '※返信は140文字以内で入力してね', check_flg) : false;

    if ( check_flg == true ) {
		request
		.post(url)
		.type('form')
		.send({ body: body.value, secret_nick_name: secret_nick_name.value })
		.end(function(err, res){
			var parsed_reply = JSON.parse(res.text);
	
			var secret_nick_name  = parsed_reply.secret_nick_name;
			var body              = parsed_reply.body;
			var date              = timestampToDateTime(parsed_reply.created_at);
			var message = new Message(0, secret_nick_name, body, date);
	
			addMessage(message, 'post_reply');
			
			document.getElementById('tweet_body').value = '';
	
		});
	}
	
}


var getReplyToTweet = function () {
	var url = BACK_BASE_URL + 'reply/' + 
	            tweet_message.instead_of_tweet_id + "/" +
				reply_messages.start_num + "/" +
				reply_messages.length;
	
	request
	.get(url)
	.end(function(err, res){
		var parsed_reply = JSON.parse(res.text);
		if (parsed_reply.reply_message_id == 0) {
			return;
		}
		reply_messages.start_num += 10;

		for(var n in parsed_reply) {
		  if ( reply_messages.reply_message_ids.indexOf(parsed_reply[n].reply_message_id) != -1 ) continue;
		  var reply_message_id  = parsed_reply[n].reply_message_id;
		  var secret_nick_name  = parsed_reply[n].secret_nick_name;
		  var body              = parsed_reply[n].body;
		  var date              = timestampToDateTime(parsed_reply[n].created_at);
		  var message = new Message(reply_message_id, secret_nick_name, body, date);
		  
		  reply_messages.can_display = parsed_reply[n].reply_message_id;
		  
		  addMessage(message, 'fetch_reply');
		}
	});
	
}


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
		messages: [],
		reply_message_ids: []
	}
});

// メッセージオブジェクトの形式
var Message = function (reply_message_id, secret_nick_name, body, date) {
	this.reply_message_id = reply_message_id;
	this.secret_nick_name = secret_nick_name;
	this.body = body; 
	this.date = date;
};


var addMessage = function (message, add_type) {
	
	if (message.secret_nick_name == '')
	  message.secret_nick_name = 'No Name';
	
	if (add_type == 'post_reply')
	  reply_messages.messages.unshift( message );
	else if (add_type == 'fetch_reply')
	  reply_messages.messages.push( message );
	
	reply_messages.reply_message_ids.push(message.reply_message_id);
}