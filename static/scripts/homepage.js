jQuery.fn.extend({
  preserveDefaultText: function(defaultValue, replaceValue) {
	$(this).focus(function(){
		if(typeof(replaceValue) == 'undefined')
			replaceValue = '';	
		if($(this).val() == defaultValue)
			$(this).val(replaceValue);
	});
	$(this).blur(function(){	  
		if(typeof(replaceValue) == 'undefined')
			replaceValue = '';	
		if($(this).val() == replaceValue)
			$(this).val(defaultValue);
	});
	return this;
  }
});

$(document).ready(function() {
	
	
	var viewWidth = $('#viewport').width();
	var viewHeight = $('#viewport').height();
	$('#viewport .layer.near').css({width: (viewWidth * 2.2), height: (viewHeight*1.3)});
	$('#viewport .layer.mid').css({width: (viewWidth * 1.15), height: (viewHeight*1.05)});
	$('#viewport .layer.far').css({width: (viewWidth * 1.04), height: (viewHeight*1.01)});
	jQuery('#viewport').jparallax({});
	$('#viewport').css({overflow: "hidden"});
	$('#flyer').animate({left: "100%"},50000);
	
	$('form#signup #email').preserveDefaultText('early@bird.com');
	
	// hover and focus fx				   
	$('input').focus(function(){
		$(this).addClass('focus');
	}).blur(function(){
		$(this).removeClass('focus');
	});
	$('#signup input[type=button]').hover(function() {
		$(this).addClass('hover');			   
	},function(){ 
		$(this).removeClass('hover');
	});
	// button click behavior
	$('#signup .button:not(.disable)').click(function() {
		var email = $('#email').val();
		server.List(email,function() {
			$('#success').show('fast');
			$('#signup input[type=button]').hide();
			//$('#signup input[type=button]').addClass('disable');
		});			   
	}).focus(function(){
		// prevents crawling ants
		$(this).blur();
	}).mousedown(function(){
		$(this).addClass('down');
	}).mouseup(function(){
		$(this).removeClass('down');
	});
	
});




/* ==================*/
/* = Ajax Requests = */
/* ==================*/

function Request(function_name, opt_argv) {

	if (!opt_argv)
		opt_argv = new Array();

	// Find if the last arg is a callback function; save it
	var callback = null;
	var len = opt_argv.length;

	if (len > 0 && typeof opt_argv[len-1] == 'function') {
		callback = opt_argv[len-1];
		opt_argv.length--;
	}

	var async = (callback != null);

	// Encode the arguments in to a URI
	var query = 'action=' + encodeURIComponent(function_name);

	for (var i = 0; i < opt_argv.length; i++) {
		var key = 'arg' + i;
		var val = JSON.stringify(opt_argv[i]);
		query += '&' + key + '=' + encodeURIComponent(val);
	}
	query += '&time=' + new Date().getTime(); // IE cache workaround

	// Create an XMLHttpRequest 'GET' request w/ an optional callback handler 
	var req = new XMLHttpRequest();
	req.open('GET', '/rpc?' + query, async);

	if (async) {
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status == 200) {
				var response = null;
				try {
					response = JSON.parse(req.responseText);
				} catch (e) {
					response = req.responseText;
				}
				callback(response);
			}
		}
	}

	// Make the actual request
	req.send(null);
}

// Adds a stub function that will pass the arguments to the AJAX call 
function InstallFunction(obj, functionName) {
	obj[functionName] = function() { 
		Request(functionName, arguments);
	}
}


// Server object that will contain the callable methods
var server = {};
var item_count = 0;

// Insert 'Add' as the name of a callable method
InstallFunction(server, 'List');
InstallFunction(server, 'Init');

