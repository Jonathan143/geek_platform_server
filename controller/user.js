const config = require('../config')
const jwt = require('jsonwebtoken')

module.exports = {
  // 登录
  login(ctx) {
    const { username, password } = ctx.request.body
    if (username === 'ad') {
      const id = 1
      const token = jwt.sign({ id }, config.SECRET_KEY, {
        expiresIn: '5 days'
      })
      ctx.body = {
        id,
        username,
        token
      }
    } else {
      ctx.status = 401
      ctx.body = {
        error: 'password is wrong.'
      }
    }
  },

  // 用户信息
  profile(ctx) {
    ctx.body = {
      username: '相学长',
      sex: 'man',
      age: 999
    }
  }
}
