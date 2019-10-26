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
  console.log(result, ctx.request.header['x-gitee-token'])
  console.log(ctx.request)

  if (result === ctx.request.header['x-gitee-token']) {
    const git = await exec('git pull')
    const noUpdate = 'Already up to date'
    if (!git.stdout.includes(noUpdate)) {
      exec('yarn && yarn pm2')
      ctx.body = 'success'
    } else {
      ctx.body = noUpdate
    }
  } else {
    ctx.throw(403, 'fail')
  }
})

module.exports = router
