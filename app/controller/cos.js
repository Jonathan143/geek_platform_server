const moment = require('moment')
const fs = require('fs')

const COS = require('cos-nodejs-sdk-v5')
const {SecretId, SecretKey} = global.config
const cos = new COS({
  SecretId,
  SecretKey
})

const p = (fn, option = null) => {
  return new Promise((resolve, reject) => {
    cos[fn](option, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

module.exports = {
  async getBucket(ctx) {
    await p('getService')
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  },

  async getFileOnBecket(ctx) {
    const {bucket, region, prefix = ''} = ctx.query

    await p('getBucket', {
      Bucket: bucket,
      Region: region,
      Prefix: prefix // 这里传入列出的文件前缀
    })
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  },

  async uploadFile(ctx) {
    const {bucket, region, path} = ctx.request.body
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件
    const Key = `${moment().format('YYYY-MM-DD')}/${file.name}`

    await p('putObject', {
      Bucket: bucket,
      Region: region,
      Key: path ? `${path}/${file.name}` : Key,
      Body: fs.createReadStream(file.path) // 这里传入前缀
    })
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  },

  async deleteFile(ctx) {
    const {bucket, region, key} = ctx.query

    await p('deleteObject', {
      Bucket: bucket,
      Region: region,
      Key: key
    })
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  }
}
