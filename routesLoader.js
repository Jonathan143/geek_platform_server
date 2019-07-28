const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

module.exports = (app, dir) => {
  if (!app) throw new Error('koa2 app is undefined.')

  const list = fs.readdirSync(dir).map(item => path.join(dir, item))

  list.forEach(path => {
    const router = require(path)

    if (router instanceof Router) {
      app.use(router.routes(), router.allowedMethods())
    }
  })
}
