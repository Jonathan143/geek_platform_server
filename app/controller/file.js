const {mkdirsSync, listDir} = require('../utils/file')
const fs = require('fs')
const dayjs = require('dayjs')
const {STATICURL, BASEPATH} = global.config
const os = require('os')
const mime = require('mime-types')

module.exports = {
  async getFile(ctx) {
    const {path, security = false} = ctx.query
    const filePath = os.homedir() + (path === '/' ? '' : path)
    const result = await listDir(security ? filePath : path)

    if (!result.error) {
      const publicPath = `${BASEPATH}/public`
      if (path.includes(publicPath) && result.file.length) {
        const fileBasePath = path.replace(publicPath, '')

        for (const file of result.file) {
          file['url'] = `${STATICURL}${fileBasePath}${file.name}`
        }
      }
    }

    ctx.body = result
  },

  async readFile(ctx) {
    const {path} = ctx.query
    try {
      for (const url of ['conf', 'config']) {
        if (path.includes(url)) {
          ctx.body = 'Insufficient permissions'
          return
        }
      }
      ctx.body = await fs.createReadStream(path)
      ctx.type = mime.lookup(path)
    } catch (error) {
      ctx.body = '读取文件出错'
    }
  },

  async uploadFile(ctx) {
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    const dirPath = `/public/upload/${dayjs().format('YYYY-MM')}`
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
