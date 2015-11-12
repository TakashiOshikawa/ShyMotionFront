'use strict';


var request = window.superagent;

var getTweet = function () {
	
	var url = BACK_BASE_URL + "reply/1/1/10";

	request
	.get(url)
	.end(function(err, res){
		console.log(res.text);//レスポンス
		//レスポンスがJSONの場合 
		console.log(res.body);//ここにparse済みのオブジェクトが入る
	});	
}


var postTweet = function () {
	
	var twitter_user_id = document.getElementById('twitter_user_id').value;
	var secret_nickname = document.getElementById('secret_nickname').value;
	var body            = document.getElementById('tweet_body').value;
	
	// validate
	var check_flg = inputLengthValidation(twitter_user_id, 15, '※ユーザーIDは15文字以内で入力してね', true);
	check_flg = check_flg == true ? inputLengthValidation(secret_nickname, 15, '※ニックネームは15文字以内で入力してね', check_flg) : false;
	check_flg = check_flg == true ? inputLengthValidation(body, 140, '※メッセージは140文字以内で入力してね', check_flg) : false;

	var url = BACK_BASE_URL + 'tweet';
	
	if ( check_flg == true ) {
		request
		.post(url)
		.type('form')
		.send({ user_id: twitter_user_id, body: body, secret_nick_name: secret_nickname })
		.end(function(err, res){
			var parsed_tweet = JSON.parse(res.text);
			// TODO URLは帰ってきた値に飛ぶ
			window.location = FRONT_BASE_URL + 'instead_tweet/' + parsed_tweet.tweet.instead_of_tweet_id;
		});
	}

}