import { randomBytes } from 'crypto'
import { default as keccak } from 'keccak'
import { default as secp256k1 } from 'secp256k1'


export default {
    randomBytes: randomBytes,

    generatePrivateKey() {
        // generate privKey
        let privKey
        do {
            privKey = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(privKey))

        return privKey
    },


    privateToAddress(privKey) {
        const publicKey = secp256k1.publicKeyCreate(privKey, false).slice(1)
        return keccak('keccak256').update(publicKey).digest().slice(-20)
    },

    createWallet() {
        const privKey = this.generatePrivateKey()
        const address = this.privateToAddress(privKey)

        return {
            address: '0x' + address.toString('hex'),
            privateKey: '0x' + privKey.toString('hex')
        }
    },

    isAddress(addr) {
        if (typeof addr !== 'string') {
            return false
        }
        return addr.length == 42 && /^0x[0-9a-fA-F]{40}/.test(addr);
    }

}