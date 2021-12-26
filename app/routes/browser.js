const router = require('koa-router')()
const mongoose = require('mongoose')
const Browser = mongoose.model('Browser')

router.prefix('/browser')

router.get('/type_total', async ctx => {
  try {
    const data = await Browser.gerBrowesrTypeTotalList()
    ctx.body = {data, code: 200}
  } catch (error) {
    ctx.body = {cood: 500, error}
  }
})

module.exports = router
