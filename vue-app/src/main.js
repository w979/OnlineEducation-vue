// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios";
import Video from 'video.js'
import 'video.js/dist/video-js.css'


Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//每次都要添加 token
axios.interceptors.request.use(
  function(config) {
    //Token为发送到服务器请求头的键
    config.headers.Token = localStorage.getItem('token')
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
