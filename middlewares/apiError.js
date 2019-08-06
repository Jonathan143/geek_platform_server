module.exports = async (ctx, next) => {
  await next()
  const body = ctx.body
  if (body && body.error) {
    ctx.status = 500
    ctx.body = {
      message: body.error,
      code: ctx.status
    }
  } else if (!body) {
    ctx.status = 404
    ctx.body = {
      message: `Cannot ${ctx.method} ${ctx.path}`,
      code: ctx.status
    }
  } else {
    ctx.body = {
      data: body,
      code: ctx.status
    }
  }
}
