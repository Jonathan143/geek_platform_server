const router = require('koa-router')()
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const encryption = require('../utils/encryption')
const parser = require('ua-parser-js')

router.get('/', async ctx => {
  ctx.body = '服务已启动'
})

// 获取用户浏览器信息
const moment = require('moment')
const mongoose = require('mongoose')
const Browser = mongoose.model('Browser')
router.get('/ua', async ctx => {
  const {browser, os} = parser(ctx.request.header['user-agent'])
  await Browser.saveBrowserInfo({
    name: browser.name,
    major: browser.major,
    osName: os.name,
    osVersion: os.version,
    time: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  ctx.body = 'success'
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
