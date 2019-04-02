import { cry } from 'thor-devkit'
import crypto from 'crypto'
import keccak from 'keccak'
import secp256k1 from 'secp256k1'
const assert = require('assert')

export default {
    randomBytes: crypto.randomBytes,

    generatePrivateKey() {
        // generate privKey
        let privKey
        do {
            privKey = crypto.randomBytes(32)
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
        return addr.length == 42 && /^0x[0-9a-fA-F]{40}/.test(addr)
    },

    encrypt(publicKey, message) {
        let ecdh = crypto.createECDH('secp256k1')
        // R
        let R = ecdh.generateKeys(null)
        // S
        let sharedSecret = ecdh.computeSecret(publicKey)

        // uses KDF to derive a symmetric encryption and a MAC keys:
        // Ke || Km = KDF(S || S1)
        let s1 = new Buffer([])
        let s2 = new Buffer([])
        let hash = cry.blake2b256(Buffer.concat([sharedSecret, s1], sharedSecret.length))

        // Ke
        let encryptionKey = hash.slice(0, hash.length / 2)
        // Km
        let macKey = hash.slice(hash.length / 2)

        // encrypts the message:
        // c = E(Ke; m);
        let cipherText = symmetricEncrypt(encryptionKey, message)

        // computes the tag of encrypted message and S2:
        // d = MAC(Km; c || S2)
        let tag = macMessage(macKey, Buffer.concat([cipherText, s2], cipherText.length))
        // outputs R || c || d
        return Buffer.concat([R, cipherText, tag]);
    },

    decrypt(privateKey, message) {
        let ecdh = crypto.createECDH('secp256k1')
        ecdh.setPrivateKey(privateKey)

        let publicKeyLength = ecdh.getPublicKey(null).length;
        // R
        let R = message.slice(0, publicKeyLength);
        // c
        let cipherText = message.slice(publicKeyLength, message.length - 32);
        // d
        let messageTag = message.slice(message.length - 32);
        // S
        let sharedSecret = ecdh.computeSecret(R)

        // derives keys the same way as Alice did:
        // Ke || Km = KDF(S || S1)
        let s1 = new Buffer([])
        let s2 = new Buffer([])
        let hash = cry.blake2b256(Buffer.concat([sharedSecret, s1], sharedSecret.length))

        // Ke
        let encryptionKey = hash.slice(0, hash.length / 2);
        // Km
        let macKey = hash.slice(hash.length / 2);

        // uses MAC to check the tag
        let keyTag = macMessage(macKey, Buffer.concat([cipherText, s2], cipherText.length))

        // outputs failed if d != MAC(Km; c || S2);
        assert(equalConstTime(messageTag, keyTag), "Bad MAC")

        // uses symmetric encryption scheme to decrypt the message
        // m = E-1(Ke; c)
        return symmetricDecrypt(encryptionKey, cipherText)
    }

}


// E
function symmetricEncrypt(key, plaintext) {
    var cipher
    cipher = crypto.createCipher('aes-256-ecb', key)
    var firstChunk = cipher.update(plaintext)
    var secondChunk = cipher.final()
    return Buffer.concat([firstChunk, secondChunk])
}

// E-1
function symmetricDecrypt(key, ciphertext) {
    var cipher
    cipher = crypto.createDecipher('aes-256-ecb', key)
    var firstChunk = cipher.update(ciphertext)
    var secondChunk = cipher.final()
    return Buffer.concat([firstChunk, secondChunk])
}

// MAC
function macMessage(key, message) {
    return crypto.createHmac('sha256', key).update(message).digest()
}

// Compare two buffers in constant time to prevent timing attacks.
function equalConstTime(b1, b2) {
    if (b1.length !== b2.length) {
        return false
    }
    let result = 0
    for (let i = 0; i < b1.length; i++) {
        result |= b1[i] ^ b2[i]  // jshint ignore:line
    }
    return result === 0
}