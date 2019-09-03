module.exports = async (ctx, next) => {
  await next()
  const body = ctx.body
  const status = ctx.status
  const {message, error} = body

  switch (status) {
    case 404:
      ctx.body = {
        code: status,
        message: `Cannot ${ctx.method} ${ctx.path}`
      }
      break
    case 500:
      ctx.body = {
        code: status,
        message,
        error
      }
      break
    default:
      ctx.body = {
        data: body,
        code: status,
        message: 'success'
      }

      break
  }
}
