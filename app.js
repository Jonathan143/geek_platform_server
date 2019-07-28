// index.js

const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const cors = require('./middlewares/koa-cors')
const config = require('./config')

app.use(bodyParser())

// logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

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

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// routes
// app.use(router.routes()).use(router.allowedMethods())
require('./routesLoader')(app, __dirname + '/routes')

const PORT = process.env.PORT || config.SERVER_PORT

app.listen(PORT, () => {
  console.log(`server running @ http://localhost:${PORT}`)
})
