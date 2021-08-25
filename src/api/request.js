import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send localStorage when cross-domain requests
  // timeout: 60000, // request timeout 1分钟超时
  // headers: {'Content-Type': 'application/json'},
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 过滤无效参数
    const {params} = config
    if (params) {
      for (const i in params) {
        if (params[i] === '' || params[i] === null || params[i] === undefined) {
          delete params[i]
        }
      }
    }

    if (store.getters.token) {
      // 登录凭证 TOKEN
      config.headers['authorization'] = 'Bearer ' + getToken()
    }

    // X-Trace-Id用于后端排错
    // config.headers['X-Trace-Id'] = +new Date() + '-' + ((Math.random() * 100000).toFixed(0) + '')

    return config
  },
  error => {
    Message({
      message: error + `，request timeout`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { config, status } = response
    const res = response.data
    const { code } = res
    // if the custom code is not 0, it is judged as an error.
    if (code !== 20000) {
      let errorMsg = (res.message || 'System error') + `，Interface：${config.url}，Code: ${res.code} ，TraceId: ${response.headers['pb-request-id']}`

      Message({
        message: errorMsg,
        type: 'error',
        duration: 5 * 1000
      })

      if (code === 40100) {
        // 清理token，返回登录页
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }

      return Promise.reject(new Error(errorMsg))
    } else {
      return res
    }
  },
  error => {
    const {response} = error
    const {status, data, config} = response || {}
    const {url} = config || {}
    const errorMsg = `；Error：${status}；Inferface${url}；TraceId: ${response.headers['pb-request-id']}`
    let message = ''

    if (status === 502 || status == 404) {
      message = `The server is a little tired ⊙﹏⊙...${errorMsg}`
    } else if (status === 403) {
      message = `Insufficient permissions, please contact administrator!${errorMsg}`
    } else {
      message = `${data.message}${errorMsg}`
    }

    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    })

    return Promise.reject(message)
  }
)

export default service
