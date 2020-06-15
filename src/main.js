import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bus from './lib/bus'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title.js'
import 'echarts/lib/component/legend.js'
import 'echarts/lib/component/tooltip.js'

import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.component('chart', ECharts) //注入chart组件
Vue.config.productionTip = false
Vue.prototype.$bus = Bus //将Bus注入到Vue实例

new Vue({
  router,
	store,
	render: h => h(App)
}).$mount('#app')
