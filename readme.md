# PSS Demo

### Installation

Run using a web server eg. `npm i -g live-server`

### Example Bee Configs

```sh
bee start \
    --api-addr=:1633 \
    --debug-api-enable \
    --debug-api-addr=:1635 \
    --data-dir=/tmp/bee2 \
    --p2p-addr=:7072 \
    --swap-endpoint=https://rpc.slock.it/goerli \
    --cors-allowed-origins="*" \
    --verbosity="5" \
    --password="x"


bee start \
    --api-addr=:1733 \
    --debug-api-enable \
    --debug-api-addr=:1735 \
    --data-dir=/tmp/bee3 \
    --p2p-addr=:7073 \
    --swap-endpoint=https://rpc.slock.it/goerli \
    --cors-allowed-origins="*" \
    --verbosity="5" \
    --password="x"
```

