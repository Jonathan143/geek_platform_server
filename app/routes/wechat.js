const router = require('koa-router')()
const sha1 = require('sha1')
const {Wechat, MongoStore} = require('wechat-jssdk')
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser({explicitArray: false})
const builder = new xml2js.Builder({
  cdata: true,
  rootName: 'xml',
  headless: true
})

const wx = new Wechat({
  //第一个为设置网页授权回调地址
  wechatRedirectUrl: '',
  wechatToken: '', //第一次在微信控制台保存开发者配置信息时使用
  appId: '',
  appSecret: '',
  card: false, //开启卡券支持，默认关闭
  payment: false, //开启支付支持，默认关闭
  merchantId: '', //商户ID
  store: new MongoStore({
    //dbName: 'myWechat', //default wechat
    dbAddress: `${global.config.MONGODB_HOST}/geek_platform`, //set the whole connection uri by yourself
    dbOptions: {
      authSource: 'admin',
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    } //set mongoose connection config
  })
})

router.prefix('/wechat')

router.get('/', async ctx => {
  const {signature, nonce, timestamp, echostr} = ctx.request.query
  const str = ['yangSir143', timestamp, nonce].sort().join('')
  const sha = sha1(str)
  ctx.body = sha === signature ? echostr + '' : 'failed'
})

router.post('/', async ctx => {
  const {xml = {}} = await xmlParser.parseStringPromise(ctx.request.body)
  console.log(xml)
  const {
    MsgType,
    Event,
    FromUserName,
    ToUserName,
    MediaId,
    Content,
    CreateTime
  } = xml

  const baseReply = {
    MsgType,
    CreateTime,
    ToUserName: FromUserName,
    FromUserName: ToUserName
  }

  switch (MsgType) {
    /**
     * 关注/取消关注事件
     * Event subscribe(订阅)、unsubscribe(取消订阅)
     * */

    case 'event':
      console.log(
        Event === 'subscribe'
          ? `${FromUserName}用户订阅`
          : `${FromUserName}取消订阅`
      )
      ctx.body = 'success'
      break
    case 'image':
      ctx.body = builder.buildObject({
        ...baseReply,
        Image: {MediaId}
      })
      break

    default:
      ctx.body = builder.buildObject({
        ...baseReply,
        MsgType: 'text',
        Content: Content || '我不知道你在说什么'
      })
      break
  }
})

router.get('/get-signature', async ctx => {
  ctx.body = await wx.jssdk.getSignature(ctx.request.query.url)
})

router.get('/oauth-callback', async ctx => {
  const code = ctx.request.query.code
  ctx.body = await wx.oauth.getUserInfo(code)
})

module.exports = router
