'use strict';

var validateMessage = new Vue({
	el: '#validate_message',
	data: {
		message: '',
		can_display:  'none'
	}
});


var inputLengthValidation = function (el, len, message, check_flg) {
	if (el.length <= len && check_flg == true) {
		validateMessage.can_display = 'none';
		return true;
	}
	else {
		validateMessage.message     = message;
		validateMessage.can_display = '';
		return false;
	}
}