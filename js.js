/*global safari,console*/
var base = safari.extension.settings.url;
console.log(base);
var rpc = base+'/transmission/rpc';
var ssid = null;
var rpcea = null;

function cl(cosa){
	console.log(cosa);
	//safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('message', cosa);
}


function add(torrent){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		rpcea(xhr, torrent);
	};
	xhr.open('POST', rpc);
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
	if(event.userInfo !== undefined){
		event.contextMenu.appendContextMenuItem('piroteca', 'Agregar Torrent a Piroteca');
	}
	
}, false);