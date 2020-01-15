<template>
  <div class="app">
    <header class="navbar navbar-default" id="header">
      <div class="container-fluid header">
        <div class="row">
          <div class="col-sm-3 col-xs-12 navbar-header header--logo">
            <h3><router-link :to="{ name: 'home'}">{{ $t("app_name") }}</router-link></h3>
          </div>

          <div class="col-sm-6 hidden-xs header--thor-info">
            <div class="header--thor-info--wrap">
              <div class="header--thor-info--wrap text-center">
                <div><strong>{{ $t("account_label") }}: </strong> <span><a :href="accountLink" target="_blank">{{ visitor }}</a></span></div> |
                <div><strong>{{ $t("network") }}: </strong>{{ network }}</div>
              </div>
            </div>
          </div>

          <div class="col-sm-3 col-xs-6 navbar-header locale-select">
              <h5><span><a href="#" @click="setLocale('en-US')">English</a> | <a href="#" @click="setLocale('zh-CN')">简体中文</a></span></h5>
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
              <svg class="svg--icon-mouse" xmlns="http://www.w3.org/2000/svg" height="72pt" viewBox="0 -96 512 512" width="72pt">
                <path d="m400.601562 176.734375c-8.28125 0-15 6.71875-15 15 0 8.273437 6.71875 15 15 15 8.277344 0 15-6.726563 15-15 0-8.28125-6.722656-15-15-15zm0 0"/>
                <path d="m444.890625 128.78125-29.289063-24.40625v-25.109375c0-43.707031-35.5625-79.265625-79.285156-79.265625-38.757812 0-71.101562 27.964844-77.925781 64.785156-90.167969 6.890625-161.992187 82.164063-161.992187 175.132813v32.164062c0 6.039063 1.15625 11.808594 3.234374 17.117188h-27.515624c-23.710938 0-42.117188-19.339844-42.117188-42.125 0-10.957031 4.269531-21.265625 12.019531-29.019531l17.507813-17.507813c26.546875-26.519531 7.699218-72.011719-29.828125-72.011719h-14.699219c-8.285156 0-15 6.714844-15 15 0 8.28125 6.714844 15 15 15h14.699219c10.835937 0 16.292969 13.125 8.613281 20.800782l-17.511719 17.507812c-13.414062 13.425781-20.800781 31.261719-20.800781 50.238281 0 39.898438 32.300781 72.117188 72.117188 72.117188h392.765624c25.980469 0 47.117188-21.136719 47.117188-47.117188v-.023437c0-55.519532-24.460938-107.742188-67.109375-143.277344zm37.109375 143.300781c0 9.4375-7.679688 17.117188-17.117188 17.117188h-321.367187c-9.4375 0-17.117187-7.679688-17.117187-17.132813v-32.148437c0-76.269531 58.324218-138.304688 132.195312-145.03125 10.132812 50.992187 56.960938 63.648437 77.722656 63.648437h.019532c8.28125 0 14.988281-6.71875 14.988281-15 0-8.285156-6.722657-15-15.007813-15-26.75 0-49.25-21.625-49.25-49.269531 0 0 0-.003906 0-.007813 0 0 0-.003906 0-.007812 0-27.15625 22.09375-49.25 49.269532-49.25 27.164062 0 49.265624 22.101562 49.265624 49.269531v32.128907c0 4.453124 1.976563 8.675781 5.398438 11.527343l34.6875 28.902344c35.789062 29.820313 56.3125 73.640625 56.3125 120.230469zm0 0"/>
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

              <div class="envelope--create-button--close"><button :disabled="!isAddress()" @click="handleContinue"><h4>Continue</h4></button></div>
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
  name: 'Claim',
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
      hasConnex: false,
      showInptModal: true,
      showCertModal: false,
      tokenName: 'VET',
      envelope: {},
    }
  },
  created() {
    this.network = this.$config.network
    let { packet_id, code } = this.$route.params
    this.$set(this.envelope, 'id', packet_id)

    let spk
    try { spk = atob(code).slice(2) }
    catch(err) {
      window.location.href = '#/404'
      return
    }

    let address = localStorage.getItem(`claimed:${this.network}_${packet_id}`)
    if (address && Utils.isAddress(address)) {
      this.address = address
    }
    if (window.connex) {
      this.hasConnex = true
      this.showInptModal = false
      this.showCertModal = true
    }

    this.getRevealInfo().then(() => {
      let pubKey = cry.secp256k1.derivePublicKey(Buffer.from(spk, 'hex'))
      let addr = '0x' + cry.publicKeyToAddress(pubKey).toString('hex')

      if (this.envelope.secretSigner.toLowerCase() != addr) {
        window.location.href = '#/404'
        return
      }
      if (!window.connex) {
        this.handleContinue()
        return
      }
      
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
          this.showCertModal = false
          this.setAccount(result.annex.signer)

          return this.getPacketInfo().then(() => {
            return this.setUserRole()
          })
      })
    })
  },
  methods: {
    setLocale(lang) {
      localStorage.setItem("local", lang)
      this.$i18n.locale = lang
    },
    isAddress() {
      return Utils.isAddress(this.address);
    },
    setAccount(address) {
      this.visitor = address
      this.accountLink = this.$config.accountBaseUrl + '/accounts' + this.visitor
    },
    handleContinue() {
      if (this.isAddress()) {
        this.showInptModal = false
        this.setAccount(this.address)

        this.getPacketInfo().then(() => {
          return this.setUserRole()
        })
      }
    },
    setUserRole() {
      this.role = this.envelope.creator.toLowerCase() == this.visitor.toLowerCase() ? 'creator' : 'claimer'
    },
    getPacketInfo() {
      let vm = this

      let getEnvelopeInfoABI = {"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getEnvelopeInfo","outputs":[{"name":"","type":"uint8"},{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint64"},{"name":"","type":"string"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"}
      let getClaimInfoABI = {"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_claimer","type":"address"}],"name":"getClaimInfo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}

      return Promise.all([
        this.callMethod(getEnvelopeInfoABI, [this.envelope.id]),
        this.callMethod(getClaimInfoABI, [this.envelope.id, vm.visitor]),
      ])
      .then(([info, claiminfo]) => {
        let ts = parseInt((+new Date()) / 1000)

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
      let getEnvelopeRevealABI = {"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getEnvelopeReveal","outputs":[{"name":"","type":"address"},{"name":"","type":"uint64"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}

      return this.callMethod(getEnvelopeRevealABI, [this.envelope.id]).then(reveal => {

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


<style scoped>

.locale-select {
  padding-top: 1em;
}
.locale-select h5 {
  padding: 0;
}
.locale-select a {
  color: #fff;
}
</style>