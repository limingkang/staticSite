import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/common/theme.less'
import '@/common/custom.less'
import elementUi from '@/plugins/element-ui'
import Main from './Main.vue'
import router from './router'

Vue.use(elementUi)

new Vue({
  el: '#app',
  router,
  render: h => h(Main)
})
