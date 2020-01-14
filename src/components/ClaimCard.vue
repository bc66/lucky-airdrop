<template>
  <div class="container-fluid">

    <div v-if="!claimed" class="container-fluid envelope-wrap">
      <div class="container-fluid envelope-container envelope-container--claim envelope--verified envelope-container--red envelope-container--with-card">
        <div class="container-fluid envelope-info">
          <div class="row envelope-info--top">
            <div class="col-xs-5 left-align">
              <p>{{ $t("envelope") }} #{{ envelope.id }}</p>
            </div>
            <div class="col-xs-7 right-align">
              <p>
                <span>Expires
                  <time datetime="2019-03-07T15:19:30.000Z" title="2019-03-07 15:19">in {{ envelope.duration * 1000 | duration('humanize') }}</time>
                </span>
              </p>
            </div>
          </div>
          <div>
            <svg class="svg--icon-dog" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" xml:space="preserve">
              <circle cx="46.2" cy="35" r="3.7"></circle>
              <path d="M63.7,31.3c-3.1-8.7-11.4-15-21.2-15l-7.5,0c-6.1,0-11.3,3.6-13.7,8.8c-5.2,2.4-8.8,7.6-8.8,13.7v30H20v15h37.5V61.2l7.5,0  c12.4,0,22.5-10.1,22.5-22.5v-7.5H63.7z M65,53.7h-7.5c-4.1,0-7.5,3.4-7.5,7.5v15H27.5v-7.5c8.3,0,15-6.7,15-15v-7.5  c0-2.1-1.7-3.7-3.8-3.7S35,44.2,35,46.3v7.5c0,4.1-3.4,7.5-7.5,7.5l-7.5,0V38.8c0-4.1,3.4-7.5,7.5-7.5c0-4.1,3.4-7.5,7.5-7.5h7.5  c8.3,0,15,6.7,15,15H65h15C80,47,73.3,53.7,65,53.7z"></path>
            </svg>
          </div>
          <div class="envelope-info--message">
            <h2>{{ envelope.message || $t("create.comment_placeholder") }}</h2>
            <p>– {{ envelope.nickname || $t("create.from.placeholder") }}</p>
          </div>
        </div>

        <div class="envelope--buttons">
          <div class="envelope--input--disclaimer">
            <p>
              <span>{{ $t("claim.hint") }}</span>
            </p>
          </div>
          <p>
            <button :disabled="isClaiming"  class="btn btn-env" @click="claim">{{ isClaiming ? $t("claim.claiming_btn_text") + counter : $t("claim.claim_btn_text") }}</button>
          </p>
        </div>

      </div>
    </div>

    <AfterClaimCard v-else :envelope="envelope" :tokenName="tokenName" />
  </div>
</template>


<script>
import BN from 'bignumber.js'
import IPFS from 'ipfs-mini'
import AfterClaimCard from "@/components/AfterClaimCard.vue";
import { cry, abi, RLP, Transaction } from 'thor-devkit'

const GAS_PER_CLAIMER = 200000
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


export default {
    name: 'ClaimCard',
    components: {
      AfterClaimCard,
    },
    props: {
      visitor: String,
      tokenName: String,
      envelope: Object
    },
    data() {
      return {
        claimed: false,
        isClaiming: false,
        counter: 20,
        cTicker: null
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
      'envelope.messageLink': function (val, oldVal) {
        if (this.envelope.messageLink) {
          ipfs.cat(val).then(message => {
            this.envelope.message = message
          })
        }
      }
    },
    methods: {
      claim() {
        this.isClaiming = true
        let spk = atob(this.$route.params.code)
        let claimABI = {"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_claimerAddr","type":"address"},{"name":"_signature","type":"bytes"}],"name":"claimEnvelope","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}

        let params = [ {"name": "id", "type": "uint256"}, {"name": "claimer", "type": "address"} ]
        let text = abi.encodeParameters(params, [this.envelope.id, this.visitor])

        let signature = cry.secp256k1.sign(cry.keccak256(Buffer.from(text.slice(2), 'hex')), Buffer.from(spk.slice(2), 'hex'))
        let data = (new abi.Function(claimABI)).encode(this.envelope.id, this.visitor, '0x' + signature.toString('hex'))

        this.cTicker = setInterval(this.refreshCounter, 1000)

        fetch(this.$config.providerUrl + '/blocks/best').then(resp => resp.json())
        .then(block => {
          let blockRef = block.id.slice(0, 18)

          let body = {
            chainTag: this.$config.chainTag,
            blockRef: blockRef,
            expiration: 360, // expire in 1 hour
            clauses: [{to: this.$config.contract, value: '0x0', data: data}],
            gasPriceCoef: 0,
            gas: GAS_PER_CLAIMER,
            dependsOn: null,
            nonce: +new Date()
          }

          let tx = new Transaction(body)
          let signingHash = cry.blake2b256(tx.encode())
          tx.signature = cry.secp256k1.sign(signingHash, Buffer.from(spk.slice(2), 'hex'))
          let raw = '0x' + tx.encode().toString('hex')

          return fetch(this.$config.providerUrl + '/transactions', {
            body: JSON.stringify({ raw }),
            headers: {'content-type': 'application/json'},
            method: 'POST',
          })
          .then(response => response.json())
          .then(tx => {
            this.getReceipt(tx.id, (err, receipt) => {
              if (err) return
              this.isClaiming = false

              if (receipt.reverted) {
                //
                console.error(`claim tx failed: TxId=${tx.id}`)
              } else {
                this.claimed = true
                let events = receipt.outputs[0].events
                let claimAmount = events[events.length-1].data

                this.$set(this.envelope, 'totalClaimers', this.envelope.totalClaimers + 1)
                this.$set(this.envelope, 'claimed', (new BN(claimAmount, 16)).div(10**18).toFixed(2))

                // 
                localStorage.setItem(`claimed:${this.$config.network}_${this.envelope.id}`, this.visitor)
              }
            })
          })
         })
         .catch(err => {
           console.error(err)
           this.isClaiming = false
         })

      },
      getReceipt(txID, cb) {
        let counter = 0
        let url = this.$config.providerUrl + `/transactions/${txID}/receipt`

        function _getReceipt() {
          counter++

          fetch(url).then(resp => resp.json())
          .then(receipt => {
            console.log(receipt)

            if (receipt) {
              return cb(null, receipt)
            }
            if (counter < 7) {
              setTimeout(_getReceipt, 10000)
            } else {
              return cb(new Error('fail to get receipt'), null)
            }
          })
        }
       
       _getReceipt()
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
