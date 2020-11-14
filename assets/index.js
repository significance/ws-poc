const gatewayHTTP = 'http://localhost:8083';
const gatewayWS = 'ws://localhost:8082';
const topic = 'ws-poc';

let listen = (openCallback, messageCallback) => {
    // Create WebSocket connection.
    const socket = new WebSocket(`${gatewayWS}/pss/subscribe/${topic}`);

    // Connection opened
    socket.addEventListener('error', function (event) {
        console.log(event)
    });

    // Listen for messages
    socket.addEventListener('message', async function (event) {
        // callback(event.data);
        messageCallback(await event.data.text());
    });

    // Connection opened
    socket.addEventListener('open', function (event) {
        openCallback();
    });
};

let send = async (overlayAddress, publicKey, messageText) => {
    let prefix = overlayAddress.slice(0,4);
    let url = `${gatewayHTTP}/pss/send/${topic}/${prefix}?recipient=${publicKey}`;
    return await axios.post(url, messageText);
};

let init = async () => {

    let app = new Vue({
        el: '#app',
        data: {
            messages: [
                {message: 'Welcome'},
            ],
            overlayAddress: "918c",
            publicKey: "021fbb24ce0fb6d59d7dbbc779cd2851cbb43879b82ba7b6c6ef39e2d51f73ddf3",
            messageText: "Hello Swarm",
        },
        methods: {
            sendMessage: async function(){
                send(
                    this.overlayAddress, 
                    this.publicKey, 
                    this.messageText
                );
            }
        }
    });

    listen(console.log, (message) => {
        var b = document.getElementById("bzzAudio"); 
        b.play();
        app.messages.push({message: message});
    });

};

init();