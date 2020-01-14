<template>
  <div class="container-fluid envelope-wrap">
    <div class="envelope-wrap--title">
      <h2>{{ $t("claim.claimed_text") }} {{ envelope.claimed }} {{ tokenName }}.</h2>
    </div>
    <div class="container-fluid envelope-container envelope-container--claim">
      <div class="container-fluid envelope-info">
        <div class="row envelope-info--top">
          <div class="col-xs-5 left-align">{{ $t("envelope") }} #{{ envelope.id }}</div>
          <div class="col-xs-7 right-align">
            <span v-if="envelope.duration > 0">
              Expires
              <time datetime="2019-03-04T15:58:09.000Z" title="2019-03-04 15:58">in {{ envelope.duration * 1000 | duration('humanize') }}</time>
            </span>
            <span v-else>{{ $t("expired") }}</span>
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
            <span>{{ $t("claim.total_claims") }}: {{ envelope.totalClaimers || 0 }}</span>
          </p>
        </div>
        <div class="envelope-info--message">
          <h2>{{ envelope.message || $t("create.comment_placeholder") }}</h2>
          <p>– {{ envelope.nickname || $t("create.from.placeholder") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import IPFS from 'ipfs-mini'
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


export default {
    name: 'AfterClaimCard',
    props: {
      tokenName: String,
      envelope: Object
    },
    mounted() {
      if (this.envelope.messageLink) {
        ipfs.cat(this.envelope.messageLink).then(message => {
          this.envelope.message = message
        })
      }
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
    }
}
</script>

