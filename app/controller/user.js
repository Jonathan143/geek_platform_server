const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Menu = mongoose.model('Menu')

module.exports = {
  // 登录
  login(ctx) {
    const {username, password} = ctx.request.body
    if (username === 'jonathan') {
      const id = 1
      const token = jwt.sign({id}, global.config.SECRET_KEY, {
        expiresIn: '5 days'
      })
      ctx.body = {
        id,
        username,
        token
      }
    } else {
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
  },

  async getUserMenuList(ctx) {
    const menuList = await Menu.find({}).sort({_id: 1})
    ctx.body = menuList
  }
}
