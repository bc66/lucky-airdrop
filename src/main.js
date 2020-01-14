import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from '@/locale'
import store from './store'
import ConfigMixin from './mixins/config'

import config from './config'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(ConfigMixin, config)
Vue.use(require('vue-moment'))

// init

import "./assets/app.css"

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
