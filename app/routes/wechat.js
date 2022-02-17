const router = require('koa-router')()
const sha1 = require('sha1')
const {Wechat} = require('wechat-jssdk')
const wx = new Wechat({
  //第一个为设置网页授权回调地址
  wechatRedirectUrl: '',
  wechatToken: '', //第一次在微信控制台保存开发者配置信息时使用
  appId: '',
  appSecret: '',
  card: false, //开启卡券支持，默认关闭
  payment: false, //开启支付支持，默认关闭
  merchantId: '' //商户ID
})

router.prefix('/wechat')

router.get('/', async ctx => {
  const {signature, nonce, timestamp, echostr} = ctx.request.query
  const str = ['yangSir143', timestamp, nonce].sort().join('')
  const sha = sha1(str)
  console.log(str)
  ctx.body = sha === signature ? echostr : 'failed'
})

router.get('/get-signature', async ctx => {
  ctx.body = await wx.jssdk.getSignature(ctx.request.query.url)
})
router.get('/oauth-callback', async ctx => {
  console.log(ctx.request)
  ctx.body = 'success'
})

module.exports = router
