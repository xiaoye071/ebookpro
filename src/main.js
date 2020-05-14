import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import i18n from "./lang/index";
import "./assets/style/icon.css";
import "./assets/style/global.scss";
// import "./mock/index"
import './utils/boost'
import './utils/create-api'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
