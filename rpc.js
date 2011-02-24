/*global safari,console*/
/*
Transmission Extension for Safari by Partido Surrealista Mexicano is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Based on a work at www.transmissionbt.com.

http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var base = safari.extension.settings.url;
var ssid = null;
var rpcea = null;

safari.extension.settings.addEventListener("change", function(event){
	if(event.key == 'url'){
		base = event.newValue;
		safari.extension.settings.url = base;
		console.log('Changing base to: '+base);
	}
}, false);

function cl(cosa){
	console.log(cosa);
	//safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('message', cosa);
}


function add(torrent){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		rpcea(xhr, torrent);
	};
	xhr.open('POST', base+'/transmission/rpc');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
	xhr.setRequestHeader("X-Transmission-Session-Id", ssid);
	xhr.send('{"method":"torrent-add","arguments":{"paused":false,"filename":"'+torrent.url+'"}}');
}

rpcea = function(myxhr, torrent){
	if(myxhr.readyState == 4){
		if(myxhr.status == 200){
			safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('pirotecado', 'true');
		} else if( myxhr.status == 409 ) {
			ssid = myxhr.getResponseHeader('X-Transmission-Session-Id');
			add(torrent);
		}
	}
};

safari.application.addEventListener("command", function(event){
	if(event.command == 'piroteca'){
		add(event.userInfo);
	}
} , false);

safari.application.addEventListener("contextmenu", function(event){
	if( typeof event.userInfo !== 'undefined'){
		event.contextMenu.appendContextMenuItem('piroteca', 'Add Torrent to Transmission');
	}
	
}, false);