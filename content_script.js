

var port = chrome.runtime.connect();
var horde = gremlins.createHorde();
console.log('content_script loaded');
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
		console.log(request);
		switch(request.type)
		{
			case 'start_horde':
				horde.unleash();
				break;
			
			case 'stop_horde':
				horde.stop();
				break;
			
			case 'seed_horde':
				horde.seed(request.value);
				break;
			
			case 'status':
				console.log('here');
				sendResponse(horde);
				break;
		}
	});
