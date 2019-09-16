module.exports = async (ctx, next) => {
  await next()
  const body = ctx.body
  const status = ctx.status

  if (status === 404) {
    return (ctx.body = {
      code: status,
      message: `Cannot ${ctx.method} ${ctx.path}`
    })
  }

  if (body) {
    if (body.error) {
      return ctx.throw(400, JSON.stringify({error: body.error}))
    }
  }
}
