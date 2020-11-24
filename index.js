const gatewayHTTP = 'http://localhost:8083';
const gatewayWS = 'ws://localhost:8082';
const topic = 'ws-poc';

let listen = (openCallback, messageCallback) => {
    // Create WebSocket connection.
    const socket = new WebSocket(`${gatewayWS}/pss/subscribe/${topic}`);

    // Listen for messages
    socket.addEventListener('message', async function (event) {
        // callback(event.data);
        messageCallback(await event.data.text());
    });

    // Log errors
    socket.addEventListener('error', function (event) {
        console.log(event)
    });
};

let send = async (prefix, publicKey, messageText) => {
    var b = document.getElementById("bzzAudioSend"); 
    b.play();

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
            overlayAddress: "",
            publicKey: "",
            messageText: "",
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
        var b = document.getElementById("bzzAudioReceive"); 
        b.play();
        app.messages.push({message: message});
    });

};

init();