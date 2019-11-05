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
const instance = axios.create({
  timeout: 1000 * 12,
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

module.exports = ({method = 'get', api, param = {}, config = {}}) => {
  const mParam = disposeParam(method, param)

  Object.assign(config, {url: api, method}, mParam)
  return instance(config)
    .then(data => {
      return Promise.resolve(data.data)
    })
    .catch(error => {
      return Promise.reject(error.message)
    })
}
