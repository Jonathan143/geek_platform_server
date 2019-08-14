const fileUtil = require('../utils/file')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

module.exports = {
  async getFile(ctx) {
    const { path } = ctx.query
    const result = await fileUtil.listDir(path)
    ctx.body = result
  },

  async uploadFile(ctx) {
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件

    // 创建可读流
    const reader = fs.createReadStream(file.path)
    const fileName = `${moment().format('YYYY-MM-DD')}_${file.name}`
    let filePath = path.join(__dirname, '../public/upload/') + fileName

    // 创建可写流
    const upStream = fs.createWriteStream(filePath)

    // 可读流通过管道写入可写流
    reader.pipe(upStream)

    const { SERVER_PORT, localhost } = require('../config')
    return (ctx.body = {
      fileName,
      path: `http://${localhost}:${SERVER_PORT}/upload/${fileName}`
    })
  }
}
