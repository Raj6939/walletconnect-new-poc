import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import {BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSweetalert2 from 'vue-sweetalert2'
import VueMeta from 'vue-meta'
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false
Vue.use(VueMeta)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
