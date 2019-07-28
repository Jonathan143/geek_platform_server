// controller/user.js

module.exports = {
  // 登录
  login(ctx) {
    ctx.body = {
      username: ctx.request.body.username
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
