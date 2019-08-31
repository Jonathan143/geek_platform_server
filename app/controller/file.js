const fileUtil = require('../utils/file')
const fs = require('fs')
const moment = require('moment')
const {STATICURL, BASEPATH} = global.config

module.exports = {
  async getFile(ctx) {
    const {path} = ctx.query
    const result = await fileUtil.listDir(path)
    const publicPath = `${BASEPATH}/public`

    if (path.includes(publicPath) && result.file.length) {
      const fileBasePath = path.replace(publicPath, '')

      for (const file of result.file) {
        file['url'] = `${STATICURL}${fileBasePath}${file.name}`
      }
    }

    ctx.body = result
  },

  async uploadFile(ctx) {
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件

    // 创建可读流
    const reader = fs.createReadStream(file.path)
    const fileName = `${moment().format('YYYY-MM-DD')}_${file.name}`
    let filePath = `${BASEPATH}/pubilc/upload/${fileName}`

    // 创建可写流
    const upStream = fs.createWriteStream(filePath)

    // 可读流通过管道写入可写流
    reader.pipe(upStream)

    return (ctx.body = {
      fileName,
      path: `${STATICURL}/upload/${fileName}`
    })
  }
}
