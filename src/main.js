import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'


axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
//console.log(config)
config.headers.Authorization=window.sessionStorage.getItem('token')
return config

})
Vue.prototype.$http=axios
//配置请求根路径
Vue.config.productionTip = false
//使用第三方树状表格插件
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
