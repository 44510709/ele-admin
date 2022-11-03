import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url=基本url+请求url
  // withCredentials:true，// 跨域请求时发送cookie
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    config.headers['client_id'] = 'webApp'
    config.headers['client_secret'] = 'webApp'

    // 这里是携带令牌的
    if (store.getters.token) {
      // 让每个请求都携带令牌
      // ['X-Token']是一个自定义的头密钥
      // 请根据实际情况修改
      config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()

    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
    *如果您想获取http信息，如标题或状态
    *请返回response=>response
  */
  /**
      *通过自定义代码确定请求状态
      *这里只是一个例子
      *您还可以通过HTTP状态代码来判断状态
  */
  response => {
    const res = response.data

    // 如果自定义代码不是200，则判断为错误。
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
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
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
