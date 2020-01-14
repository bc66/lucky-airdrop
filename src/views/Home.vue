<template>
  <div class="app">
    <loading-screen v-if="loading" />

    <div v-else>
      <header class="navbar navbar-default" id="header">
        <div class="container-fluid header">
          <div class="row">
            <div class="col-sm-3 col-xs-6 navbar-header header--logo">
              <h3><router-link :to="{ name: 'home'}">Lucky Airdrop</router-link></h3>
            </div>

            <div class="col-sm-offset-6 col-sm-3 col-xs-6 navbar-header locale-select">
              <h5><span><a href="#" @click="setLocale('en-US')">English</a> | <a href="#" @click="setLocale('zh-CN')">简体中文</a></span></h5>
            </div>
          </div>
        </div>
      </header>

      <div class="container">
        <div class="container-fluid page-home">
          <div class="container-fluid envelope-container">
            <div class="envelope--content page-home--intro">
              <svg id="envelope-home" data-name="Layer 1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" viewBox="0 0 300 300">
                <defs>
                    <linearGradient id="linear-gradient" x1="72.26" y1="72.8" x2="72.26" y2="168.6"
                        gradientTransform="translate(-29.32 75.52) rotate(-45)" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#f85947" />
                        <stop offset="0.34" stop-color="#f45645" />
                        <stop offset="0.64" stop-color="#ea4e41" />
                        <stop offset="0.92" stop-color="#d84039" />
                        <stop offset="1" stop-color="#d13b36" />
                    </linearGradient>
                </defs>
                <rect class="cls-1" x="54" y="44" width="187" height="212.32" rx="6.9" ry="6.9"
                    transform="translate(-62.98 148.28) rotate(-45)" />
                <path class="cls-2"
                    d="M180.69,51.12,144.25,14.67a6.92,6.92,0,0,0-9.76,0L12,137.14a6.92,6.92,0,0,0,0,9.76l35.84,35.84,92.73-38.69Z" />
                <circle class="cls-3" cx="140.5" cy="143.5" r="26.5" />
            </svg>
              <h2>
                <div>
                  <h1>{{ $t("home.title") }}</h1>
                </div>
              </h2>
              <div class="envelope-field">
                <router-link class="btn btn-create" :to="{ name: 'create'}">{{ $t("home.create_btn") }}</router-link>
              </div>
            </div>

            <div class="divider">-- {{ $t("home.works_with") }} --</div>

            <div class="works-with-logos">
              <a href="https://env.vechain.org/r/#sync" target="_blank">
                <img src="@/assets/Sync512.png" alt="Sync" height="100">
              </a>
              <a href="https://env.vechain.org/r/#comet" target="_blank">
                <img src="@/assets/comet-logo.png" alt="Comet" height="100">
              </a>
            </div>

            <div class="divider">-- {{ $t("home.faq.title") }} --</div>
            <div class="envelope-content page-home--faqs">
              <div class="envelope--field faq">
                <h3>{{ $t("home.faq.how_does_work") }}</h3>
                <span>
                  <p>
                    <strong>{{ $t("home.faq.principle1.title") }}:</strong> {{ $t("home.faq.principle1.content") }}
                  </p>
                  <p>
                    <strong>{{ $t("home.faq.principle2.title") }}:</strong> {{ $t("home.faq.principle2.content") }}
                  </p>
                  <p>
                    <strong>{{ $t("home.faq.principle3.title") }}:</strong> {{ $t("home.faq.principle3.content") }}
                  </p>
                </span>
              </div>
            </div>

            <div class="divider">-- {{ $t("home.donate.title") }} --</div>
            <div class="envelope-content page-home--faqs">
              <div class="envelope--field faq">
                <span>
                  <p> {{ $t("home.donate.content1") }} <a target="_blank" href="https://bmac.vecha.in/donate?name=lucky%20airdrop&addr=0x000000B355fED5A06FeFEE50bF51140E83b076a3&amount=500&msg=If%20you%20like%20my%20dapp,%20please%20consider%20buying%20me%20a%20coffee.%20Thank%20you%20for%20your%20support!"><strong>buy me a coffee</strong></a> {{ $t("home.donate.content2") }} 
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
  methods: {
    setLocale(lang) {
      localStorage.setItem("local", lang)
      this.$i18n.locale = lang
    }
  }
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

.btn-create {
  padding: 1rem 4rem;
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