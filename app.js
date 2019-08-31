// index.js

const Koa = require('koa')
const app = new Koa()
// const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const logger = require('koa-logger')
const config = require('./config')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const apiError = require('./app/middlewares/apiError')
const security = require('./app/middlewares/security')

// app.use(bodyParser())

app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制 200M，默认2M
    }
  })
)
// cors
app.use(
  cors({
    origin: ctx => ctx.header.origin,
    optionsSuccessStatus: 200,
    credentials: true // 是否带cookie
  })
)
// logger
app.use(logger())
app.use(helmet())
app.use(require('koa-static')(__dirname + '/public'))
// 接口安全
app.use(security)
// 接口异常返回处理
app.use(apiError)

// routes
require('./routesLoader')(app, __dirname + '/app/routes')

const PORT = config.SERVER_PORT

app.listen(PORT, () => {
  console.log(`server running @ http://localhost:${PORT}`)
})
