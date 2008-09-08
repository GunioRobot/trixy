
$(document).ready(function() {
	
	var viewWidth = $('#viewport').width();
	var viewHeight = $('#viewport').height();
	$('#viewport .layer.near').css({width: (viewWidth * 2.2), height: (viewHeight*1.3)});
	$('#viewport .layer.mid').css({width: (viewWidth * 1.15), height: (viewHeight*1.05)});
	$('#viewport .layer.far').css({width: (viewWidth * 1.04), height: (viewHeight*1.01)});
	jQuery('#viewport').jparallax({});
	$('#viewport').css({overflow: "hidden"});
					   
	$('input').focus(function(){
		$(this).addClass('focus');
	}).blur(function(){
		$(this).removeClass('focus');
	});
	
	$('#flyer').animate({left: "100%"},50000);
	
});




     /* =========== */
/* = Ajax Requests = */
/* =========== */

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



function ListAdd(email) {
	server.List(email, onAddSuccess);

	
	// There should be a callback for success
}

function onAddSuccess(response)
{
    $('div#add_success').show('fast');
}
