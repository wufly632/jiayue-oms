import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/css/index.scss' // global css


import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters
import './utils/checkWebp'

import VueUeditorWrap from 'vue-ueditor-wrap';

// 或者在 main.js 里将它注册为全局组件
Vue.component('vue-ueditor-wrap', VueUeditorWrap);

Vue.use(Element, {
  size: localStorage.getItem('size') || 'medium',
  locale: enLang // 如果使用中文，无需设置，请删除
})

// 记录 localStorage
// param type 1 localStorage - setItem
Vue.prototype.$addStorageEvent = function(type, key, data) {
  if (type === 1) {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function(k, val) {
        localStorage.setItem(k, val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, data)
  }
}

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
