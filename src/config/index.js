
const MainConfig = require('./mainnet')
const TestConfig = require('./testnet')
const LocalConfig = require('./local')

const MAINNET_ID = '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
const TESTNET_ID = '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'



export default (function () {
    if (!window.connex) return MainConfig // defaul mainnet
    let genesisId = window.connex.thor.genesis.id
    return genesisId == MAINNET_ID ? MainConfig : (genesisId == TESTNET_ID ? TestConfig : LocalConfig)
})()

