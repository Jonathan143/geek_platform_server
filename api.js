/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
const axios = require('axios')
const qs = require('qs') // 根据需求导入qs模块

/**
 * 请求失败控制台log
 */
const printError = ({ method, api, param, config, error }) => {
  console.error(`${method.toUpperCase()} ["${api}"] 调用失败: ${error.message}`)
  console.log(JSON.stringify({ api, param, config }, null, 2))
}

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
  // withCredentials: true,
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
      return { params: param }
    case 'post':
      return { data: qs.stringify(param) }
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

  Object.assign(config, { url: api, method }, mParam)
  return instance(config)
    .then(data => {
      return Promise.resolve(data.data)
    })
    .catch(error => {
      if (!noNotify) {
        printError({ method, api, param, config, error })

        const message = error.response.data || error
        console.log(message)
      }
      return Promise.reject(error.message)
    })
}
