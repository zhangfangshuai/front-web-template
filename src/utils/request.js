/**
 * Author: zhangfs
 * Date: 2020-01-17
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 8000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // carry Token
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    /**
     * Desc: 这里处理的是业务Code逻辑
     * Desc:  假定接口code返回1才表示访问正常
     */
    if (res.code !== 1) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      /**
       * Desc: 登录异常统一处理
       * Desc: 如：50008: 非法Token; 50012: 第三端登录; 50014: Token已过期;
       */
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已登出，您可以关闭页面或重新登录', '确认', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  /**
   * Desc: 在这里处理HTTP Code逻辑
   */
  error => {
    console.log('err' + error) // for debug
    if (axios.isCancel(error) && !error.message) {
      return Promise.reject(error)
    }
    let msg = 'UnknownError'
    const res = error.response
    if (res) {
      msg = errorMessage.find((t) => t.code === res.status).msg || msg
      if (res.status === 401 || res.status === 403) {
        window.location.href = res.data.redirect_url
      } else {
        Message({ type: 'error', message: msg })
      }
    } else {
      Message({ type: 'error', message: error.message })
    }
    return Promise.reject(error)
  }
)

const errorMessage = [
  { code: 400, msg: '请求错误' },
  { code: 401, msg: '未授权，请登录' },
  { code: 403, msg: '拒绝访问' },
  { code: 404, msg: '请求地址出错' },
  { code: 408, msg: '请求超时' },
  { code: 500, msg: '服务器内部错误' },
  { code: 501, msg: '服务未实现' },
  { code: 502, msg: '网关错误' },
  { code: 503, msg: '服务不可用' },
  { code: 504, msg: '网关超时' },
  { code: 505, msg: 'HTTP版本不受支持' }
]

export default service
