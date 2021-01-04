import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.less'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css' // elementui样式需要单独导入
import './assets/icon/iconfont.css' // 导入字体图标
// 配置axios
import axios from 'axios';
// axios.defaults.baseURL = 'http://rambuild.cn:8888/api/private/v1'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 为请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为所有请求设置请求头对象，添加token验证的Authorizaion字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios;
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')