<template>
    <div class="app">
      <header class="navbar navbar-default" id="header">
        <div class="container-fluid header">
          <div class="row">
            <div class="col-sm-3 col-xs-12 navbar-header header--logo">
              <h3><router-link :to="{ name: 'home'}">Lucky Airdrop</router-link></h3>
            </div>

            <div class="col-sm-6 hidden-xs header--thor-info">
              <div class="header--thor-info--wrap text-center">
                <div><strong>Account: </strong> <span><a :href="accountLink" target="_blank">{{ account }}</a></span></div> |
                <div><strong>Balance: </strong>{{ balance }} {{ tokenName }}</div>
              </div>
            </div>

          </div>
        </div>
      </header>

      <div class="container">
        <CertModal v-if="!account" />

        <div v-else>
          <div id='content-area' class='container-fluid create-form'>

            <div v-if="hasErr" class="alert envelope-alert">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </div>

            <!-- Create Form -->
            <div v-if='!created' class='container-fluid envelope-container envelope-container--create'>
              <div class='envelope--title'>
                <h4>Create Your Red Envelope</h4>
              </div>
              <hr>

              <div class='envelope--content'>
                <div class='envelope--field'>
                  <div class='envelope--input'>
                    <div class='input-group'>
                      <select v-model='tokenName' @change="onTokenChange">
                        <option value='VET' selected>VET</option>
                        <option value='VTHO'>VTHO</option>
                        <option value='OCE'>OCE</option>
                        <option value='PLA'>PLA</option>
                        <option value='TIC'>TIC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class='envelope--content'>
                <div class='envelope--field'>
                  <div class='envelope--input'>
                    <div class='input-group'>
                      <div class='input-addon'>
                        <label v-if='envelope.envelopeType == 0' for='amount'>Amount Each</label>
                        <label v-else-if='envelope.envelopeType == 1' for='amount'>Total</label>
                      </div>
                      <input
                        id='amount'
                        v-model='envelope.amount'
                        type='number'
                        min='0.006'
                        placeholder='1.0'
                        value='1.0'
                        class='right-align'
                      >
                      <div class='input-addon'>
                        <label for='amount'>{{ tokenName }}</label>
                      </div>
                    </div>
                  </div>

                  <p v-if='envelope.envelopeType == 0'>Identical Amount.
                    <a @click='togglePacketType()'>Change to Random Amount</a>
                  </p>
                  <p v-else-if='envelope.envelopeType == 1'>Random Amount.
                    <a @click='togglePacketType()'>Change to Identical Amount</a>
                  </p>

                  <div class="envelope--input--disclaimer"><p>0.5% of the total is the tip. No tip for X Node holders.</p></div>
                </div>
              </div>

              <div class='envelope--content'>
                <div class='envelope--field'>
                  <div class='envelope--input'>
                    <div class='input-group'>
                      <div class='input-addon'>
                        <label for='quantity'>Quantity</label>
                      </div>
                      <input
                        id='quantity'
                        v-model='envelope.claimers'
                        type='number'
                        step='1'
                        min='1'
                        max='100'
                        placeholder='Enter number'
                        value='1'
                        class='right-align'
                      >
                    </div>
                  </div>
                  <p>Enter the number of members between 1 and 100</p>
                </div>
              </div>

              <div class='envelope--content'>
                <div class='envelope--field'>
                  <div class='envelope--input'>
                    <div class='input-group'>
                      <textarea placeholder='Best wishes 🐶' v-model='envelope.message'></textarea>
                    </div>
                  </div>
                </div>
                <div class='envelope--field'>
                  <div class='envelope--input'>
                    <div class='input-group'>
                      <div class='input-addon'>
                        <label for='sender'>From: </label>
                      </div>
                      <input type='text' name='sender' placeholder='Anonymous' v-model='envelope.nickname'>
                    </div>
                  </div>
                </div>

                <div class="envelope--input--disclaimer">
                  <p>+ {{claimVTHO}} VTHO fee</p>
                  <p>This is used to pay for the transaction fee when your recipient claims the envelope.</p>
                </div>
              </div>

              <div class='envelope--buttons'>
                <button :disabled="isCreating" class='btn btn-create' @click='createEnvelope()'>{{isCreating ? 'Creating...' + counter : 'Create'}}</button>
              </div>

              <div class="envelope--input--disclaimer"><p><span>You understand that you are using free software, provided under <a href="https://mit-license.org/" target="_blank">MIT License</a>, at your own risk.</span></p></div>
            </div>

            <div v-else>
              <ShareCard :shareLink='shareLink' />
              <RedPacketInfo :visitor='envelope.creator' :tokenName='tokenName' :envelope='envelope' />
            </div>

          </div>
        </div>
      </div>
    </div>
    
</template>

<script>
import BN from 'bignumber.js'
import Utils from '../utils'
import { cry } from 'thor-devkit'
import CertModal from '@/components/CertModal.vue'
import ShareCard from '@/components/ShareCard.vue'
import RedPacketInfo from '@/components/RedPacketInfo.vue'


import IPFS from 'ipfs-mini'
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


const VTHO_PER_CLAIMER = 200

export default {
  name: 'Create',
  components: {
    CertModal,
    ShareCard,
    RedPacketInfo,
  },
  beforeCreate() {
    if (!window.connex) {
      location.href = 'https://env.vechain.org/r/#' + encodeURIComponent(location.href)
    } else {
      const signingService = connex.vendor.sign('cert')

      // Generate a random string and request the identification
      let content = 'Confirm that you would like this site to access your account'
      signingService.request({
          purpose: 'identification',
          payload: {
              type: 'text',
              content: content
          }
      }).then(result => {
          this.account = result.annex.signer
          this.accountLink = this.$config.accountBaseUrl + '/accounts' + this.account

          let sig = Buffer.from(result.signature.slice(2), 'hex')
          let signMsg = `{"domain":"${result.annex.domain}","payload":{"content":"${content}","type":"text"},"purpose":"identification","signer":"${result.annex.signer}","timestamp":${result.annex.timestamp}}`

          this.accountPubK = cry.secp256k1.recover(cry.blake2b256(signMsg), sig)

          this.onTokenChange()
      })
    }
  },

  mounted() {
    this.$ticker = connex.thor.ticker()
  },
  destroyed() {
    this.$ticker = null
    clearInterval(this.cTicker)
  },
  
  data() {
    return {
      showMsg: false,
      hasErr: false,
      errors: [],
      isCreating: false,
      account: '',
      accountPubK: '',
      accountLink: '',
      tokenName: 'VET',
      balance: '',
      created: false,
      secretWallet: {},
      shareLink: '',
      counter: 20,
      cTicker: null,
      envelope: {
        id: null,
        envelopeType: 0,
        nickname: '',
        amount: 1,
        claimers: 10,
        duration: 86400,
        initialBalance: '',
        message: '',
        messageLink: '',
        tokenAddress: '0x0000000000000000000000000000000000000000',
      }
    }
  },

  computed: {
    claimVTHO() {
      return VTHO_PER_CLAIMER * this.envelope.claimers
    }
  },

  methods: {
    onTokenChange() {
      this.balance = '0' // clean up the old value first

      if (this.account) {
        // get account balance
          let tokenAddr = this.$config.tokens[this.tokenName]
          this.envelope.tokenAddress = tokenAddr
          
          if (tokenAddr) {
            let balanceOfABI = {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}

            connex.thor.account(tokenAddr).method(balanceOfABI).call(this.account).then(balance => {
              this.balance = (new BN(balance.decoded.balance)).dividedBy(10**18).toFixed(2)
            })
            .catch(err => {
              console.error(err)
              this.errors = ['fail to connect the blockchain network']
              this.hasErr = true
            })
          } else {
            // VET
            this.envelope.tokenAddress = '0x0000000000000000000000000000000000000000'

            const acc = connex.thor.account(this.account)
            acc.get().then(accInfo => {
              this.balance = (new BN(accInfo.balance, 16)).dividedBy(10**18).toFixed(2)
            })
            .catch(err => {
              console.error(err)
              this.errors = ['fail to connect the blockchain network']
              this.hasErr = true
            })
          }
      }
    },
    togglePacketType() {
      this.envelope.envelopeType = this.envelope.envelopeType == 0 ? 1 : 0
    },
    checkForm() {
      this.hasErr = false
      this.errors = []
      let envelope = this.envelope

      if (!envelope.amount) {
        this.errors.push('Amount: can not be empty')
      }
      if (this.calcAmountInEther().gt(1000000)) {
        this.errors.push('Total: must be less than 100W')
      }
      if (envelope.claimers < 0 || envelope.claimers > 100) {
        this.errors.push('Quantity: must be between 1 and 100')
      }
      if (envelope.message.length > 260) {
        this.errors.push('Message: must be less than 260 characters')
      }
      let holdBalance = (new BN(this.balance))
      if (holdBalance.isLessThanOrEqualTo(this.calcAmountInEther())) {
        this.errors.push('Balance: insufficient balance')
      }
      if (envelope.nickname.length > 64) {
        this.errors.push('Nickname: must be less than 64 characters')
      }

      this.hasErr = this.errors.length > 0
      return !this.hasErr
    },
    createEnvelope() {
      // 1. validate form
      if (!this.checkForm()) return

      this.created = false
      this.isCreating = true
      this.envelope.initialBalance = this.calcAmountInEther().toString(10)

      // 2. generate secret signer key pair
      this.secretWallet = Utils.createWallet()

      this.cTicker = setInterval(this.refreshCounter, 1000)

      // 3. upload message to the IPFS
      // 4. sign & send tx
      if (this.envelope.message) {
        ipfs.add(this.envelope.message).then(messageLink => {
          this.envelope.messageLink = messageLink
        })
        .catch(err => {
          console.error(err)
          this.errors = ['Upload message failed!']
          this.hasErr = true
        })
        .then(() => {
          return this.sendCreateTx()
        })
      } else {
        this.sendCreateTx()
      }
    },
    calcAmountInEther() {
      let amount = this.envelope.envelopeType == 0 ? (this.envelope.amount * this.envelope.claimers) : this.envelope.amount
      return new BN(amount) // in ether
    },
    buildCreateClauses() {
      let envelope = this.envelope
      let newEnvelopeABI = {"constant":false,"inputs":[{"name":"_envelopeType","type":"uint8"},{"name":"_nickname","type":"string"},{"name":"_duration","type":"uint64"},{"name":"_messageLink","type":"string"},{"name":"_maxClaims","type":"uint64"},{"name":"_secretSigner","type":"address"}],"name":"newEnvelope","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}
      let newTokenEnvelopeABI = {"constant":false,"inputs":[{"name":"_envelopeType","type":"uint8"},{"name":"_amount","type":"uint256"},{"name":"_nickname","type":"string"},{"name":"_duration","type":"uint64"},{"name":"_messageLink","type":"string"},{"name":"_maxClaims","type":"uint64"},{"name":"_secretSigner","type":"address"},{"name":"_tokenAddr","type":"address"}],"name":"newVIP180Envelope","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}

      let contract = connex.thor.account(this.$config.contract)

      let clauses = []
      let duration = 86400 // default expires in 1 day
      let amount = this.calcAmountInEther()
      let amountInWei = amount.multipliedBy(10**18)

      if (this.tokenName == 'VET') {
        let clause = contract.method(newEnvelopeABI)
                          .value(amountInWei.toString(10))
                          .asClause(
                            envelope.envelopeType,
                            envelope.nickname,
                            duration,
                            envelope.messageLink,
                            envelope.claimers,
                            this.secretWallet.address
                          )
        clauses.push({comment: 'Create Your Red Envelope', ...clause})
      } else {
        let tokenContract = connex.thor.account(this.$config.tokens[this.tokenName])
        let approveABI = {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, { "name": "_value", "type": "uint256"}],"name": "approve","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"}

        let approveClause = tokenContract.method(approveABI).asClause(this.$config.contract, amountInWei.toString(10))
        clauses.push({comment: `Approve Envelope Contract ${amount.toString(10)} ${this.tokenName}`, ...approveClause})

        let clause = contract.method(newTokenEnvelopeABI)
                            .asClause(
                              envelope.envelopeType,
                              amountInWei.toString(10),
                              envelope.nickname,
                              duration,
                              envelope.messageLink,
                              envelope.claimers,
                              this.secretWallet.address,
                              envelope.tokenAddress
                            )
        clauses.push({comment: 'Create Your Red Envelope', ...clause})
      }

      return clauses
    },
    buildEnergyClause() {
      let transferABI = {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
      let transferMethod = connex.thor.account(this.$config.tokens['VTHO']).method(transferABI)

      let amount = VTHO_PER_CLAIMER * this.envelope.claimers
      let amountInWei = (new BN(amount)).multipliedBy(10**18).toString(10)
      return {comment: `Pay ${amount} VTHO for your claimers`, ...transferMethod.asClause(this.secretWallet.address, amountInWei)}
    },
    sendCreateTx() {
      let signingService = connex.vendor.sign('tx')
      let createClauses = this.buildCreateClauses()
      let energyCluase = this.buildEnergyClause()

      return signingService
        .gas(500000)
        .signer(this.account)
        .request(createClauses.concat(energyCluase))
        .then(result => {
          return this.getReceipt(result.txid).then(receipt => {
            this.isCreating = false

            if(receipt.reverted) {
              this.errors = ['transaction has been reverted']
              this.hasErr = true
              return
            }

            let createEvent = this.findCreateEvent(receipt)
            let envelopeId = createEvent.topics[1]
            
            console.log('Red Envelope Id:', envelopeId)
            
            this.envelope.id = parseInt(envelopeId)
            this.shareLink = window.location.origin + this.$config.pathPrefix + `/#/claim/${this.envelope.id}/${btoa(this.secretWallet.privateKey)}`

            let encrypted = Utils.encrypt(this.accountPubK, this.shareLink)
            localStorage.setItem(`shareLink#${this.envelope.id}`, encrypted.toString('hex'))

            this.created = true
          })
        })
        .catch(err => {
          console.error(err)
          this.isCreating = false
          this.errors = ['It seems you rejected the transaction. Try again?']
          this.hasErr = true
        })
    },
    getReceipt(txid) {
      return this.$ticker.next().then(() => {
          return connex.thor.transaction(txid).getReceipt().then(receipt => {
              if (!receipt) {
                return this.getReceipt(txid)
              }
              return receipt
            })
        }).catch(err => {
          console.error(err)
          this.errors = ['fail to create the envelope']
          this.hasErr = true
        })
    },

    findCreateEvent(receipt) {
      for (let i = 0; i < receipt.outputs.length; i++) {
        let output = receipt.outputs[i]
        for (let j = 0; j < output.events.length; j++) {
          if (output.events[j].address == this.$config.contract) {
            return output.events[j]
          }
        }
      }
    },
    refreshCounter() {
      if (this.counter == 0) {
        this.counter = 20
      }
      this.counter--
    }
  }
  
}
</script>

<style scoped>
  .cls-1{fill:#d8d8d8;}.cls-2{fill:#e1e7ec;}.cls-3{fill:#eb423e;}.cls-4{fill:#fbb03b;}.cls-5{fill:#7ac943;}.cls-6{fill:#fff;}.cls-7{fill:none;stroke:#eb423e;stroke-miterlimit:10;stroke-width:5px;}
  .btn-create {
    padding: 1rem 10rem;
  }
</style>
