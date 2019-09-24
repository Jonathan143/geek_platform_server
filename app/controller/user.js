const mongoose = require('mongoose')
const Menu = mongoose.model('Menu')
const User = mongoose.model('User')
const Role = mongoose.model('Role')

module.exports = {
  // 登录
  async login(ctx) {
    const result = await User.login(ctx.request.body)
    ctx.body = result
  },

  // 注册
  async register(ctx) {
    const result = await User.register(ctx.request.body)
    ctx.body = result
  },

  // 用户信息
  profile(ctx) {
    ctx.body = {
      username: '相学长',
      sex: 'man',
      age: 999
    }
  },

  async findUserById(ctx) {
    const result = await User.findUserById(ctx.query)
    ctx.body = result
  },

  async deleteUserById(ctx) {
    const result = await User.deleteUserById(ctx.query)
    ctx.body = result
  },

  async updateUserById(ctx) {
    const result = await User.updateUserById(ctx.request.body)
    ctx.body = result
  },

  async fetchUserRoleList(ctx) {
    const result = await Role.fetchUserRoleList()
    ctx.body = result
  },

  async getUserMenuList(ctx) {
    const menuList = await Menu.find({}).sort({_id: 1})
    ctx.body = menuList
  },

  async resetMenu(ctx) {
    await Menu.reset()
    ctx.body = {message: '重置菜单成功！'}
  }
}
