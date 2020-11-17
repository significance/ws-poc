const gatewayHTTP = 'http://localhost:8083';
const gatewayWS = 'ws://localhost:8082';
const ethScanAPIkey = ''

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
            ethAddress: '',
            publicKey: '',
            messageText: "Hello Swarm",
        },
        computed: {
            overlayAddress: function () {
                if (isEthAddress(this.ethAddress))
                    return overlayAddressFromEthereumAddress(this.ethAddress, "0x0100000000000000")
                return ""
            },
            ethAddressError: function () {
                if (!isEthAddress(this.ethAddress)) return "Invalid Ethereum address"
                return ""
            }
        },
        watch: {
            ethAddress: async function () {
                if (isEthAddress(this.ethAddress)) 
                    this.publicKey = await ethAddressToPubKey(ethScanAPIkey, this.ethAddress)
                else this.publicKey = ''
            }
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