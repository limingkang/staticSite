import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/theme.less'
import '@/common/custom.less'
import Main from './Main.vue'
import router from './router'
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  render: h => h(Main)
})
