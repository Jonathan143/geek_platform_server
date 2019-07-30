// index.js

const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const cors = require('./middlewares/koa-cors')
const logger = require('koa-logger')
const config = require('./config')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const apiError = require('./middlewares/apiError')

app.use(bodyParser())

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
    origin: function(ctx) {
      return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
)
// logger
app.use(logger())
app.use(helmet())
app.use(require('koa-static')(__dirname + '/public'))
app.use(apiError)

// routes
require('./routesLoader')(app, __dirname + '/routes')

const PORT = config.SERVER_PORT

app.listen(PORT, () => {
  console.log(`server running @ http://localhost:${PORT}`)
})
