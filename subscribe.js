var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket('ws://localhost:8082/pss/subscribe/testtopic');
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
};
 
client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
 
client.onmessage = function(e) {
	const textEncoding = require('text-encoding')
	const td = new textEncoding.TextDecoder("utf-8")
    const string = td.decode(e.data)
	console.log(string)
};