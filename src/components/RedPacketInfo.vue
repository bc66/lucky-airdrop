<template>
  <div class="container-fluid envelope-container envelope-container--claim">
    <div v-if="hasErr" class="alert envelope-alert">
        <b>{{ errMsg }}</b>
      </div>

    <div class="container-fluid envelope-info">
      <div class="row envelope-info--top">
        <div class="col-xs-5 left-align">Envelope #{{ envelope.id }}</div>
        <div class="col-xs-7 right-align envelop--refund">
          <span v-if="envelope.duration > 0">
            <span v-if="envelope.claimers > envelope.totalClaimers">
              Expires <time datetime="2019-03-07T15:19:30.000Z" title="2019-03-07 15:19">in {{ envelope.duration * 1000 | duration('humanize') }}</time>
            </span>
          </span>
          <span v-else>
            <span v-if="envelope.claimers > envelope.totalClaimers"><button class="btn btn-env btn-sm" @click="refund">{{ isRefunding ? 'REFUNDING...' + counter : 'REFUND' }}</button></span>
            <span v-else>Expired</span>
          </span>
        </div>
      </div>
      <div>
        <svg class="svg--icon-dog" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" xml:space="preserve">
          <circle cx="46.2" cy="35" r="3.7"></circle>
          <path d="M63.7,31.3c-3.1-8.7-11.4-15-21.2-15l-7.5,0c-6.1,0-11.3,3.6-13.7,8.8c-5.2,2.4-8.8,7.6-8.8,13.7v30H20v15h37.5V61.2l7.5,0  c12.4,0,22.5-10.1,22.5-22.5v-7.5H63.7z M65,53.7h-7.5c-4.1,0-7.5,3.4-7.5,7.5v15H27.5v-7.5c8.3,0,15-6.7,15-15v-7.5  c0-2.1-1.7-3.7-3.8-3.7S35,44.2,35,46.3v7.5c0,4.1-3.4,7.5-7.5,7.5l-7.5,0V38.8c0-4.1,3.4-7.5,7.5-7.5c0-4.1,3.4-7.5,7.5-7.5h7.5  c8.3,0,15,6.7,15,15H65h15C80,47,73.3,53.7,65,53.7z"></path>
        </svg>
      </div>

      <div class="envelope-info--price">
        <h2>{{ envelope.initialBalance || 0 }} {{ tokenName }}</h2>
      </div>
      <div class="envelope-info--claim-details">
        <p>
          <span>Total claims: {{ envelope.totalClaimers || 0 }}</span>
          <span>Max claims: {{ envelope.claimers || 0 }}</span>
        </p>

      </div>

      <div class="envelope-info--message">
        <h2>{{ envelope.message || 'Best wishes 🐶' }}</h2>
        <p>– {{ envelope.nickname || 'Anonymous' }}</p>
      </div>

      <div class="divider"><h4>-- In the past 5 hours --</h4></div>

      <div v-if="claimHistories.length">
        <div class="row" v-for="ch in claimHistories" :key="ch._from">
          <div class="col-xs-8 left-align"><a target="_blank" :href="ch.txLink"><p>{{ch._from}}</p></a></div>
          <div class="col-xs-4 right-align"><p>{{ch._value}}</p></div>
        </div>
      </div>
      <div v-else><p>No claims!</p></div>

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
  },
  destroyed() {
    clearInterval(this.cTicker)
  },
  watch: {
    'envelope.id': function (val, oldVal) {
      this.getClaimHistories()
    },
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
</style>
