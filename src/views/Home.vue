<template>
  <div class="app">
    <loading-screen v-if="loading" />

    <div v-else>
      <header class="navbar navbar-default" id="header">
        <div class="container-fluid header">
          <div class="row">
            <div class="col-sm-3 col-xs-12 navbar-header header--logo">
              <h3><router-link :to="{ name: 'home'}">Lucky Airdrop</router-link></h3>
            </div>
          </div>
        </div>
      </header>

      <div class="container">
        <div class="container-fluid page-home">
          <div class="container-fluid envelope-container">
            <div class="envelope--content page-home--intro">
              <svg class="page-home--icon" viewBox="0 0 300 300">
                <defs>
                  <linearGradient id="envelopeGradient" x1="72.26" y1="72.8" x2="72.26" y2="168.6" gradientTransform="translate(-29.32 75.52) rotate(-45)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#f85947"></stop>
                    <stop offset="0.34" stop-color="#f45645"></stop>
                    <stop offset="0.64" stop-color="#ea4e41"></stop>
                    <stop offset="0.92" stop-color="#d84039"></stop>
                    <stop offset="1" stop-color="#d13b36"></stop>
                  </linearGradient>
                </defs>
                <rect fill="#F85947" x="54" y="44" width="187" height="212.32" rx="6.9" ry="6.9" transform="translate(-62.98 148.28) rotate(-45)"></rect>
                <path fill="url(#envelopeGradient)" class="cls-2" d="M180.69,51.12,144.25,14.67a6.92,6.92,0,0,0-9.76,0L12,137.14a6.92,6.92,0,0,0,0,9.76l35.84,35.84,92.73-38.69Z"></path>
                <circle fill="#FBB03B" cx="140.5" cy="143.5" r="26.5"></circle>
              </svg>
              <h2>
                <div>
                  <h1>Send and receive lucky airdrop.</h1>
                </div>
              </h2>
              <div class="envelope-field">
                <router-link class="btn btn-create" :to="{ name: 'create'}">Create an Red Envelope</router-link>
              </div>
            </div>

            <div class="divider">-- Works with --</div>

            <div class="works-with-logos">
              <a href="https://env.vechain.org/r/#sync" target="_blank">
                <img src="@/assets/Sync512.png" alt="Sync" height="100">
              </a>
              <a href="https://env.vechain.org/r/#comet" target="_blank">
                <img src="@/assets/comet-logo.png" alt="Comet" height="100">
              </a>
            </div>

            <div class="divider">-- FAQ --</div>
            <div class="envelope-content page-home--faqs">
              <div class="envelope--field faq">
                <h3>How does Lucky Airdrop work?</h3>
                <span>
                  <p>
                    <strong>Create and send an envelope:</strong> Go to
                    <router-link :to="{ name: 'create'}">Create</router-link> to create an envelope. Once the envelope is created, send the URL or QRCode to everyone you want to gift.
                  </p>
                  <p>
                    <strong>Claim an envelope:</strong> Go to the URL you received (don't have to install any plugins to open). Click on CLAIM to reveal the amount and claim.
                  </p>
                  <p>
                    <strong>Refund an envelope:</strong> Once your envelope has expired, you can refund the unclaimed amount back into your account. Go to the URL and click on REFUND.
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  name: "home",
  components: {
    LoadingScreen
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  data() {
    return {
      loading: false
    }
  },
};
</script>


<style scoped>
.cls-1 {
  fill: #f85947;
}
.cls-2 {
  fill: url(#linear-gradient);
}
.cls-3 {
  fill: #fbb03b;
}

.content {
  padding: 0 50px;
  width: 100%;
}
@media (max-width: 768px) {
  .content {
    padding: 0;
  }
}

.container-envelope {
  text-align: center;
  margin: auto;
  width: 40em;
  min-height: 50px;
}
@media (max-width: 768px) {
  .container-envelope {
    width: 100%;
    padding-bottom: 12px;
  }
  .container-envelope .btn-create,
  .container-envelope h3 {
    display: none;
  }
}
</style>