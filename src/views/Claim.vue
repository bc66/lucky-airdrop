<template>
  <div class="app">
    <header class="navbar navbar-default" id="header">
      <div class="container-fluid header">
        <div class="row">
          <div class="col-sm-3 col-xs-12 navbar-header header--logo">
            <h3><router-link :to="{ name: 'home'}">Lucky Airdrop</router-link></h3>
          </div>

          <div class="col-sm-6 hidden-xs header--thor-info">
            <div class="header--thor-info--wrap">
              <div class="header--thor-info--wrap text-center">
                <div><strong>Your Account: </strong> <span><a :href="accountLink" target="_blank">{{ visitor }}</a></span></div> |
                <div><strong>Network: </strong>{{ network }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="container">
      <!-- 输入钱包地址 -->
      <div v-if="showInptModal" class="alert envelope--modal">
        <div class="envelope--modal--container">
          <div class="envelope--modal--loading">
            <span class="animated">
              <svg class="svg--icon-dog" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" xml:space="preserve">
                <circle cx="46.2" cy="35" r="3.7"></circle>
                <path d="M63.7,31.3c-3.1-8.7-11.4-15-21.2-15l-7.5,0c-6.1,0-11.3,3.6-13.7,8.8c-5.2,2.4-8.8,7.6-8.8,13.7v30H20v15h37.5V61.2l7.5,0  c12.4,0,22.5-10.1,22.5-22.5v-7.5H63.7z M65,53.7h-7.5c-4.1,0-7.5,3.4-7.5,7.5v15H27.5v-7.5c8.3,0,15-6.7,15-15v-7.5  c0-2.1-1.7-3.7-3.8-3.7S35,44.2,35,46.3v7.5c0,4.1-3.4,7.5-7.5,7.5l-7.5,0V38.8c0-4.1,3.4-7.5,7.5-7.5c0-4.1,3.4-7.5,7.5-7.5h7.5  c8.3,0,15,6.7,15,15H65h15C80,47,73.3,53.7,65,53.7z"></path>
              </svg>
            </span>
          </div>

          <div class="envelope--modal--details">
            <div class="container-fluid">
              <div class="envelope--field">
                <h3>Input your address</h3>
                <h4><span>Please input your wallet address to catch your luck.</span><br></h4>
                <div class="envelope--input">
                  <div class="input-group">
                    <input v-bind:class="{'has-error': !isAddress()}" type="text" placeholder="0x" v-model="address">
                  </div>
                </div>
              </div>

              <div class="envelope--create-button--close"><button :disabled="!isAddress()" @click="handleClose"><h4>Continue</h4></button></div>
            </div>
          </div>
        </div>
      </div>

      <ShareCard :shareLink='shareLink' />

      <RedPacketInfo v-if="role=='creator'" :visitor="visitor" :envelope="envelope" :tokenName="tokenName" />
      <ClaimCard v-else-if="role=='claimer' && envelope.claimed == '0.00' && envelope.status != '2'" :visitor="visitor" :envelope="envelope" :tokenName="tokenName" />
      <AfterClaimCard v-else-if="role=='claimer' && envelope.claimed != '0.00'" :envelope="envelope" :tokenName="tokenName" />
      <RedPacketInfo v-else :visitor="visitor" :envelope="envelope" :tokenName="tokenName" />
      
      <CertModal v-show="showCertModal" />
    </div>
  </div>
  
</template>


<script>
import Utils from '../utils'
import BN from 'bignumber.js'
import CertModal from '@/components/CertModal.vue'
import RedPacketInfo from "@/components/RedPacketInfo.vue";
import ClaimCard from "@/components/ClaimCard.vue";
import AfterClaimCard from "@/components/AfterClaimCard.vue";
import ShareCard from '@/components/ShareCard.vue'

import { cry, abi, RLP } from 'thor-devkit'

const roles = {creator: 'creator', 'claimer': 'claimer'}

export default {
  name: "Claim",
  components: {
    CertModal,
    ShareCard,
    RedPacketInfo,
    ClaimCard,
    AfterClaimCard,
  },
  data() {
    return {
      network: 'unkonwn',
      address: '',
      visitor: '',
      shareLink: window.location.href,
      accountLink: '',
      role: '',
      isCreator: false,
      showInptModal: false,
      showCertModal: false,
      hasConnex: true,
      tokenName: 'VET',
      envelope: {},
    }
  },
  created() {
    this.network = this.$config.network

    let spk
    try { spk = atob(this.$route.params.code).slice(2) }
    catch(err) {
      window.location.href = '#/404'
      return
    }

    if (!window.connex) {
      this.hasConnex = false
      this.showInptModal = true
    }

    this.getRevealInfo().then(() => {
      let pubKey = cry.secp256k1.derivePublicKey(Buffer.from(spk, 'hex'))
      let addr = '0x' + cry.publicKeyToAddress(pubKey).toString('hex')

      if (this.envelope.secretSigner.toLowerCase() != addr) {
        window.location.href = '#/404'
        return
      }
      if (!window.connex) {
        return
      }
      
      this.showCertModal = true
      const signingService = connex.vendor.sign("cert")

      // Generate a random string and request the identification
      signingService
      .request({
          purpose: "identification",
          payload: {
            type: "text",
            content: "Confirm that you would like this site to access your account"
          }
      })
      .then(result => {
          this.visitor = result.annex.signer
          this.showCertModal = false
          this.accountLink = this.$config.accountBaseUrl + '/accounts' + this.visitor

          return this.getPacketInfo().then(() => {
            return this.checkUserRole()
          })
      })
    })
  },
  methods: {
    isAddress() {
      return Utils.isAddress(this.address);
    },
    handleClose() {
      if (this.isAddress()) {
        this.visitor = this.address
        this.showInptModal = false
        this.accountLink = this.$config.accountBaseUrl + '/accounts' + this.visitor

        this.getPacketInfo().then(() => {
          return this.checkUserRole()
        })
      }
    },
    checkUserRole() {
      if (this.envelope.id) {
        this.role = this.envelope.creator.toLowerCase() == this.visitor.toLowerCase() ? 'creator' : 'claimer'
      } else {
        this.getPacketInfo().then(() => {
          this.role = this.envelope.creator.toLowerCase() == this.visitor.toLowerCase() ? 'creator' : 'claimer'
        })
      }
    },
    getPacketInfo() {
      let vm = this
      let packetId = vm.$route.params.packet_id

      let getEnvelopeInfoABI = {"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getEnvelopeInfo","outputs":[{"name":"","type":"uint8"},{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"string"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"}
      let getClaimInfoABI = {"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_claimer","type":"address"}],"name":"getClaimInfo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}

      return Promise.all([
        this.callMethod(getEnvelopeInfoABI, [packetId]),
        this.callMethod(getClaimInfoABI, [packetId, vm.visitor]),
      ])
      .then(([info, claiminfo]) => {
        let ts = parseInt((+new Date()) / 1000)

        this.$set(vm.envelope, 'id', packetId)
        this.$set(vm.envelope, 'type', info[0])
        this.$set(vm.envelope, 'status', info[1])
        this.$set(vm.envelope, 'creator', info[2])
        this.$set(vm.envelope, 'nickname', info[3])
        this.$set(vm.envelope, 'expireAt', info[4])
        this.$set(vm.envelope, 'duration', parseInt(info[4]) - ts)
        this.$set(vm.envelope, 'message', '')
        this.$set(vm.envelope, 'messageLink', info[5])
        this.$set(vm.envelope, 'claimed', (new BN(claiminfo[0])).div(10**18).toFixed(2))

        vm.tokenName = vm.getTokenNameByAddress(vm.envelope.tokenAddress)
      })
    },
    getRevealInfo() {
      let packetId = this.$route.params.packet_id
      let getEnvelopeRevealABI = {"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getEnvelopeReveal","outputs":[{"name":"","type":"address"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}

      return this.callMethod(getEnvelopeRevealABI, [packetId]).then(reveal => {

        this.$set(this.envelope, 'tokenAddress', reveal[0])
        this.$set(this.envelope, 'claimers', parseInt(reveal[1]))
        this.$set(this.envelope, 'totalClaimers', parseInt(reveal[2]))
        this.$set(this.envelope, 'initialBalance', (new BN(reveal[3])).div(10**18).toFixed(2))
        this.$set(this.envelope, 'remaining', (new BN(reveal[4])).div(10**18).toFixed(2))
        this.$set(this.envelope, 'secretSigner', reveal[5])
      })
    },
    getTokenNameByAddress(tokenAddress) {
      let tokenName = 'VET'
      if (tokenAddress == '0x0000000000000000000000000000000000000000') {
        return tokenName
      }
      Object.keys(this.$config.tokens).forEach(name => {
        if (this.$config.tokens[name].toLowerCase() == tokenAddress.toLowerCase()) {
          tokenName = name
          return
        }
      })
      return tokenName
    },

    callMethod(_abi, _values) {
      let fn = new abi.Function(_abi)
      let data = fn.encode(..._values)

      let payload = { data: data, value: '0x0' }
      if (this.visitor) {
        payload.caller = this.visitor
      }

      return fetch(this.$config.providerUrl + `/accounts/${this.$config.contract}`, {
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
        method: 'POST',
      })
      .then(response => response.json())
      .then(body => {
        let decoded = abi.decodeParameters(_abi.outputs, body.data)
        return decoded
      })
    }
  }
};
</script>
