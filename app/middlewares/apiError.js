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
      // return (ctx.body = {
      //   code: 500,
      //   error: body.error
      // })
      return ctx.throw(500, {error: body.error})
    }
  }
}
