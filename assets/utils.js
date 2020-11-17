const urlBase = 'https://api-goerli.etherscan.io/api'

function stripHexPrefix(hex) {
    if (hex.startsWith('0x')) return hex.substr(2)
    return hex
}

function hexToString(hex) {
    if (!hex.match(/^[0-9a-fA-F]+$/)) {
        throw new Error('is not a hex string.');
    }
    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }
    var bytes = [];
    for (var n = 0; n < hex.length; n += 2) {
        var code = parseInt(hex.substr(n, 2), 16)
        bytes.push(code);
    }
    return bytes;
}

function isEthChecksumAddress(address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

function isEthAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isEthChecksumAddress(address);
    }
};

function isBeeNetwork(address) {
    if (/^(0x)?[0-9a-f]{16}$/i.test(address)) return true
    return false
};

function overlayAddressFromEthereumAddress(ethAddress, networkId) {
    if (!isEthAddress(ethAddress) || !isBeeNetwork(networkId)) return ''
    const data = `${stripHexPrefix(ethAddress)}${stripHexPrefix(networkId)}`
    const arrayData = hexToString(data)
    return sha3_256(arrayData)
}
  
async function txlist(apiKey, address) {
    const url = `${urlBase}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    const response = await axios.get(url)
    return response.data.result
}

async function getTransactionByHash(apiKey, hash) {
    const url = `${urlBase}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${apiKey}`
    const response = await axios.get(url)
    return response.data.result
}

async function ethAddressToPubKey(apiKey, address) {
    const result = await txlist(apiKey, address)
    const outgoingTx = result.find(tx => tx.from == address)
    const txHash = outgoingTx.hash
    const txData = await getTransactionByHash(apiKey, txHash)
    return txData.publicKey
}