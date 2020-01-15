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
            <svg class="svg--icon-mouse" xmlns="http://www.w3.org/2000/svg" height="72pt" viewBox="0 -96 512 512" width="72pt">
              <path d="m400.601562 176.734375c-8.28125 0-15 6.71875-15 15 0 8.273437 6.71875 15 15 15 8.277344 0 15-6.726563 15-15 0-8.28125-6.722656-15-15-15zm0 0"/>
              <path d="m444.890625 128.78125-29.289063-24.40625v-25.109375c0-43.707031-35.5625-79.265625-79.285156-79.265625-38.757812 0-71.101562 27.964844-77.925781 64.785156-90.167969 6.890625-161.992187 82.164063-161.992187 175.132813v32.164062c0 6.039063 1.15625 11.808594 3.234374 17.117188h-27.515624c-23.710938 0-42.117188-19.339844-42.117188-42.125 0-10.957031 4.269531-21.265625 12.019531-29.019531l17.507813-17.507813c26.546875-26.519531 7.699218-72.011719-29.828125-72.011719h-14.699219c-8.285156 0-15 6.714844-15 15 0 8.28125 6.714844 15 15 15h14.699219c10.835937 0 16.292969 13.125 8.613281 20.800782l-17.511719 17.507812c-13.414062 13.425781-20.800781 31.261719-20.800781 50.238281 0 39.898438 32.300781 72.117188 72.117188 72.117188h392.765624c25.980469 0 47.117188-21.136719 47.117188-47.117188v-.023437c0-55.519532-24.460938-107.742188-67.109375-143.277344zm37.109375 143.300781c0 9.4375-7.679688 17.117188-17.117188 17.117188h-321.367187c-9.4375 0-17.117187-7.679688-17.117187-17.132813v-32.148437c0-76.269531 58.324218-138.304688 132.195312-145.03125 10.132812 50.992187 56.960938 63.648437 77.722656 63.648437h.019532c8.28125 0 14.988281-6.71875 14.988281-15 0-8.285156-6.722657-15-15.007813-15-26.75 0-49.25-21.625-49.25-49.269531 0 0 0-.003906 0-.007813 0 0 0-.003906 0-.007812 0-27.15625 22.09375-49.25 49.269532-49.25 27.164062 0 49.265624 22.101562 49.265624 49.269531v32.128907c0 4.453124 1.976563 8.675781 5.398438 11.527343l34.6875 28.902344c35.789062 29.820313 56.3125 73.640625 56.3125 120.230469zm0 0"/>
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
