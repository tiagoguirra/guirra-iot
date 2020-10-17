import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import socket from './plugins/socket'
import './config/toast'
import './config/sweetalert'
import './config/vuelidate'
import i18n from './i18n'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  i18n,

  created() {
    Vue.use(socket, this.$store)
  }
}).$mount('#app')
