<template>
  <div class="container-fluid envelope-container envelope-container--claim">
    <div v-if="hasErr" class="alert envelope-alert">
      <b>{{ errMsg }}</b>
    </div>

    <div class="container-fluid envelope-info">
      <div class="row envelope-info--top">
        <div class="col-xs-5 left-align">{{ $t("envelope") }} #{{ envelope.id }}</div>
        <div class="col-xs-7 right-align envelop--refund">
          <span v-if="envelope.duration > 0">
            <span v-if="envelope.claimers > envelope.totalClaimers">
              Expires <time datetime="2019-03-07T15:19:30.000Z" title="2019-03-07 15:19">in {{ envelope.duration * 1000 | duration('humanize') }}</time>
            </span>
          </span>
          <span v-else>
            <span v-if="envelope.claimers > envelope.totalClaimers"><button class="btn btn-env btn-sm" @click="refund">{{ isRefunding ? 'REFUNDING...' + counter : 'REFUND' }}</button></span>
            <span v-else>{{ $t("expired") }}</span>
          </span>
        </div>
      </div>
      <div>
        <svg class="svg--icon-mouse" xmlns="http://www.w3.org/2000/svg" height="72pt" viewBox="0 -96 512 512" width="72pt">
            <path d="m400.601562 176.734375c-8.28125 0-15 6.71875-15 15 0 8.273437 6.71875 15 15 15 8.277344 0 15-6.726563 15-15 0-8.28125-6.722656-15-15-15zm0 0"/>
            <path d="m444.890625 128.78125-29.289063-24.40625v-25.109375c0-43.707031-35.5625-79.265625-79.285156-79.265625-38.757812 0-71.101562 27.964844-77.925781 64.785156-90.167969 6.890625-161.992187 82.164063-161.992187 175.132813v32.164062c0 6.039063 1.15625 11.808594 3.234374 17.117188h-27.515624c-23.710938 0-42.117188-19.339844-42.117188-42.125 0-10.957031 4.269531-21.265625 12.019531-29.019531l17.507813-17.507813c26.546875-26.519531 7.699218-72.011719-29.828125-72.011719h-14.699219c-8.285156 0-15 6.714844-15 15 0 8.28125 6.714844 15 15 15h14.699219c10.835937 0 16.292969 13.125 8.613281 20.800782l-17.511719 17.507812c-13.414062 13.425781-20.800781 31.261719-20.800781 50.238281 0 39.898438 32.300781 72.117188 72.117188 72.117188h392.765624c25.980469 0 47.117188-21.136719 47.117188-47.117188v-.023437c0-55.519532-24.460938-107.742188-67.109375-143.277344zm37.109375 143.300781c0 9.4375-7.679688 17.117188-17.117188 17.117188h-321.367187c-9.4375 0-17.117187-7.679688-17.117187-17.132813v-32.148437c0-76.269531 58.324218-138.304688 132.195312-145.03125 10.132812 50.992187 56.960938 63.648437 77.722656 63.648437h.019532c8.28125 0 14.988281-6.71875 14.988281-15 0-8.285156-6.722657-15-15.007813-15-26.75 0-49.25-21.625-49.25-49.269531 0 0 0-.003906 0-.007813 0 0 0-.003906 0-.007812 0-27.15625 22.09375-49.25 49.269532-49.25 27.164062 0 49.265624 22.101562 49.265624 49.269531v32.128907c0 4.453124 1.976563 8.675781 5.398438 11.527343l34.6875 28.902344c35.789062 29.820313 56.3125 73.640625 56.3125 120.230469zm0 0"/>
        </svg>
      </div>

      <div class="envelope-info--price">
        <h2>{{ envelope.initialBalance || 0 }} {{ tokenName }}</h2>
      </div>
      <div class="envelope-info--claim-details">
        <p>
          <span>{{ $t("claim.total_claims") }}: {{ envelope.totalClaimers || 0 }}</span>
          <span>{{ $t("claim.max_claims") }}: {{ envelope.claimers || 0 }}</span>
        </p>

      </div>

      <div class="envelope-info--message">
        <h2>{{ envelope.message || $t("create.comment_placeholder") }}</h2>
        <p>– {{ envelope.nickname || $t("create.from.placeholder") }}</p>
      </div>

      <div class="divider"><h4>-- {{ $t("claim.claim_history_title") }} --</h4></div>

      <div class="claim-history" v-if="claimHistories.length">
        <div class="row" v-for="ch in claimHistories" :key="ch._from">
          <div class="col-xs-8 left-align"><a target="_blank" :href="ch.txLink"><p>{{ch._from}}</p></a></div>
          <div class="col-xs-4 right-align"><p>{{ch._value}}</p></div>
        </div>
      </div>
      <div v-else><p>{{ $t("claim.no_cliams") }}</p></div>

    </div>
  </div>
    
</template>

<script>
import BN from 'bignumber.js'
import IPFS from 'ipfs-mini'
import { abi, RLP } from 'thor-devkit'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export default {
  name: "RedPacketInfo",
  props: {
    visitor: String,
    tokenName: String,
    envelope: Object,
  },
  data() {
    return {
      isRefunding: false,
      counter: 20,
      cTicker: null,
      hasErr: false,
      errMsg: '',
      claimHistories: []
    }
  },
  mounted() {
    if (this.envelope.messageLink) {
      ipfs.cat(this.envelope.messageLink).then(message => {
        this.envelope.message = message
      })
    }

    this.getClaimHistories()
  },
  destroyed() {
    clearInterval(this.cTicker)
  },
  watch: {
    'envelope.messageLink': function (val, oldVal) {
      if (this.envelope.messageLink) {
        ipfs.cat(val).then(message => {
          this.envelope.message = message
        })
      }
    }
  },
  methods: {
    getClaimHistories() {
      this.claimHistories = []
      if (!this.envelope.id) return

      let eventSig = '0xc859311bc537fef52b70fbc36471c501efbf87e5a6e8fed2edf60453ddde3d5c'
      let envelopId = abi.encodeParameter('uint256', this.envelope.id)

      fetch(this.$config.providerUrl + '/blocks/best')
        .then(resp => resp.json())
        .then(block => {

          let body = {
            "range": {
              "unit": "block",
              "from": Math.min(0, block.number - 1800),
              "to": block.number
            },
            "options": {
              "offset": 0,
              "limit": 100
            },
            "criteriaSet": [
              {
                "address": this.$config.contract,
                "topic0": eventSig,
                "topic1": envelopId
              }
            ],
            "order": "desc"
          }

          return fetch(this.$config.providerUrl + '/logs/event', {
            body: JSON.stringify(body),
            headers: {'content-type': 'application/json'},
            method: 'POST',
          })
          .then(response => response.json())
          .then(logs => {
            this.claimHistories = logs.map(log => {
              let _from = abi.decodeParameter('address', log.topics[2])
              let _value = abi.decodeParameter('uint256', log.data)
              return {_from: _from, _value: (new BN(_value)).div(10**18).toFixed(2), txLink: this.$config.txBaseUrl + '/' + log.meta.txID}
            })
          })
        })
    },
    refund() {
      if (!window.connex) {
        location.href = 'https://env.vechain.org/r/#' + encodeURIComponent(location.href)
        return
      }
      this.isRefunding = true

      let contract = connex.thor.account(this.$config.contract)
      let refundABI = {"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"refundEnvelope","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
      let refundClause = contract.method(refundABI).asClause(this.envelope.id)

      let signingService = connex.vendor.sign('tx')

      this.cTicker = setInterval(this.refreshCounter, 1000)

      return signingService
        .gas(500000)
        .request([{
          comment: 'Refund the envelope',
          ...refundClause
        }])
        .then(result => {
          return this.getReceipt(result.txid).then(receipt => {
            this.isRefunding = false

            if(receipt.reverted) {
              this.errMsg = `Transaction has been reverted: TxID=${result.txid}`
              this.hasErr = true
              return
            }

            location.reload()
          })
        })
        .catch(err => {
          console.error(err)
          this.isRefunding = false
          this.errMsg = 'It seems you rejected the transaction. Try again?'
          this.hasErr = true
        })
    },
    getReceipt(txid) {
      return connex.thor.ticker().next().then(() => {
          return connex.thor.transaction(txid).getReceipt().then(receipt => {
              if (!receipt) {
                return this.getReceipt(txid)
              }
              return receipt
            })
        }).catch(err => {
          console.error(err)
          this.errMsg = `Fail to get refund transaction receipt: TxID=${txid}`
          this.hasErr = true
        })
    },
    refreshCounter() {
      if (this.counter == 0) {
        this.counter = 20
      }
      this.counter--
    }
  }
};
</script>


<style scoped>
.envelope-alert {
    width: 100%;
    max-width: 46rem;
    margin: 0 auto 2.4rem auto;
    text-align: center;
    color: #ec4331;
}
.claim-history p {
    font-family: Menlo, Arial, sans-serif
}
</style>
