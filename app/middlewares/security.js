/* 安全性校验中间件 */
const jwt = require('jsonwebtoken')

whitelist = [
  {path: '/$', method: 'get'},
  {path: '/other/bing$', method: 'get'},
  {path: '/user/login$', method: 'post'},
  {path: '/file/read.+', method: 'get'},
  {path: '/user/register$', method: 'post'},
  {path: '/update-code$', method: 'post'}
]

const isInWhitelist = (path, method) => {
  const filterList = whitelist.filter(
    item =>
      new RegExp(item.path).test(path) &&
      (!item.method || method === item.method.toUpperCase())
  )
  return !!filterList.length
}

module.exports = async (ctx, next) => {
  if (isInWhitelist(ctx.path, ctx.method)) return await next()

  const auth = ctx.cookies.get('geekadmin-token')
  if (!auth) {
    return ctx.throw(
      401,
      JSON.stringify({
        code: 401,
        error: '未登录'
      })
    )
  }
  let user = {}
  try {
    user = jwt.verify(auth, global.config.SECRET_KEY)
  } catch (error) {
    return ctx.throw(
      403,
      JSON.stringify({
        code: 403,
        error: '登录过期'
      })
    )
  }
  ctx.currentUser = user
  await next()
}
