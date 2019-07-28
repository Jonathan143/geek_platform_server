const fileUtil = require('../utils/file')

module.exports = {
  async getFile(ctx) {
    const { path } = ctx.query
    const result = await fileUtil.listDir(path)
    ctx.body = result
  }
}
