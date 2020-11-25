import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import routeOpen from '@/utils/allapply';
Vue.prototype.$routeOpen = routeOpen

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import loading from '@/components/Model/loading'
import nodata from '@/components/Model/noData'
import apartChart from '@/components/Model/apartChart'
import halfChart from '@/components/Model/halfChart'
import fullChart from '@/components/Model/fullChart'
import datePointPicker from '@/components/Model/datePointPicker'
import dateRangePicker from '@/components/Model/dateRangePicker'
import annotationPop from '@/components/localComponents/AnnotationPop'
import moduletitle from '@/components/localComponents/moduleTitle'

Vue.component('vLoading', loading)
Vue.component('vNodata', nodata)
Vue.component('vApartChart', apartChart)
Vue.component('vHalfChart', halfChart)
Vue.component('vFullChart', fullChart)
Vue.component('vDatePointPicker', datePointPicker)
Vue.component('vDateRangePicker', dateRangePicker)
Vue.component('vAnnotationPop', annotationPop)
Vue.component('moduletitle', moduletitle)

import * as filters from '@/utils/filter'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import downloadImg from '@/utils/downloadImg'
Vue.prototype.$downloadImg = downloadImg
import { downloadExcel } from '@/utils/downloadExcel'
Vue.prototype.$downloadExcel = downloadExcel

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
