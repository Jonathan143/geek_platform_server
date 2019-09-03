const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const RoleSchema = new BaseSchema({
  name: String,
  tag: String,
  isRequired: {
    type: Boolean,
    default: false
  },
  menuList: []
})

const initData = async function() {
  const count = await this.countDocuments({})
  if (!count) {
    const role = require('../default/role.json')
    const data = await this.create(role)
    console.log('[完成]', '权限初始化', '\n', data)
  }
}

Object.assign(RoleSchema.statics, {initData})

module.exports = mongoose.model('Role', RoleSchema)
