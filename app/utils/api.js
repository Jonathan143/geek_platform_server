/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
const axios = require('axios')
const qs = require('qs') // 根据需求导入qs模块

/**
 * 创建axios实例
 * 设置post请求头
 */
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3200'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://api.yang143.cn/'
}
const instance = axios.create({
  timeout: 1000 * 12,
  baseURL,
  withCredentials: true,
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
})

// dispose request parameters
const disposeParam = (method, param) => {
  switch (method) {
    case 'get':
      return {params: param}
    case 'post':
      return {data: qs.stringify(param)}
  }
  return param
}

module.exports = ({
  method = 'get',
  api,
  param = {},
  config = {},
  noNotify = false
}) => {
  const mParam = disposeParam(method, param)

  Object.assign(config, {url: api, method}, mParam)
  return instance(config)
    .then(data => {
      return Promise.resolve(data.data)
    })
    .catch(error => {
      if (!noNotify) {
        const message = error.response.data || error
        console.log(message)
      }
      return Promise.reject(error.message)
    })
}
