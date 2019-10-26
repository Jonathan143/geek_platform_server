const router = require('koa-router')()
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const encryption = require('../utils/encryption')
router.get('/', async ctx => {
  ctx.body = '服务已启动'
})
router.post('/update-code', async ctx => {
  const {result} = encryption.aesEncrypt(
    global.config.SECRET_KEY,
    'df602458267e876c'
  )

  if (result === ctx.request.header['x-gitee-token']) {
    ctx.body = 'success'
    exec('git pull && yarn && yarn pm2')
  } else {
    ctx.throw(403, 'fail')
  }
})

module.exports = router
