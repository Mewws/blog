import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import './assets/css/global.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import axios from 'axios'
/* axios.defaults.baseURL = 'http://127.0.0.1:3000/' */
axios.defaults.baseURL = 'http://114.215.168.200:3000/'
Vue.prototype.$http = axios

// 富文本插件
Vue.use(mavonEditor)
Vue.config.productionTip = false

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('waiGuaToken')
  if (to.path === '/login') {
    next()
  } else if (to.path === '/Imanage' || to.path === '/Imanage_index' || to.path === '/edit' || to.path === '/Imodify' || to.path === '/post' || to.path === '/Imsg_manage' || to.path === '/person_info') {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
