const {mkdirsSync, listDir} = require('../utils/file')
const fs = require('fs')
const moment = require('moment')
const {STATICURL, BASEPATH} = global.config
const os = require('os')

module.exports = {
  async getFile(ctx) {
    const {path, security = false} = ctx.query
    const filePath = os.homedir() + (path === '/' ? '' : path)
    const result = await listDir(security ? filePath : path)
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
    const dirPath = `/public/upload/${moment().format('YYYY-MM')}`
    // 若无目录，创建目录
    await mkdirsSync(BASEPATH + dirPath)
    const filePath = `.${dirPath}/${file.name}`
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)

    // 可读流通过管道写入可写流
    try {
      await reader.pipe(upStream)
    } catch (error) {
      return (ctx.body = {error})
    }

    return (ctx.body = {
      fileName: file.name,
      path: filePath.replace('./public', STATICURL)
    })
  }
}
