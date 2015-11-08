'use strict';

var current_location = window.location.hostname;

var BASE_URL       = current_location == 'shymotion.tokyo' ? 'shymotion.tokyo' : '127.0.0.1';
var SCHEME         = 'http://';
var BACK_BASE_URL  = SCHEME + BASE_URL + ':65000/';
var FRONT_BASE_URL = SCHEME + BASE_URL + ':4000/';

var url = new Vue({
	el: '.url',
	data: {
		BACK_BASE_URL: BACK_BASE_URL,
		FRONT_BASE_URL: FRONT_BASE_URL
	}
});