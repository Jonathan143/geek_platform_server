const router = require('koa-router')()
const wechat = require('../controller/wechat')

const sha1 = require('sha1')
const wechatConfig = {
  appID: 'wxe1714bfa3824cfdc',
  appSecret: 'bb6586f9cf11555b93644c056307fc92',
  token: 'yang143'
}

router.prefix('/wechat')

router.get('/', async ctx => {
  const {signature, nonce, timestamp, echostr} = this.query
  const str = [token, timestamp, nonce].sort().join()
  const sha = sha1(str)
  this.body = sha === signature ? echostr + '' : 'failed'
})

// router.get('/read/:filename?', file.readFile)

module.exports = router
