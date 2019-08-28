const router = require('koa-router')()

router.get('/', async ctx => {
  ctx.body = '服务已启动'
})

module.exports = router
