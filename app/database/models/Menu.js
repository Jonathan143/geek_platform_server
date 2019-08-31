const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const MenuSchema = new BaseSchema({
  // svg 图标名称
  icon: {
    type: String,
    default: ''
  },
  // element-ui 中的 icon 图标名称
  fontClass: {
    type: String,
    default: ''
  },
  // 自定义图标的 url
  image: {
    type: String,
    default: ''
  },
  // 菜单栏标题
  title: String,
  // 菜单栏路由
  route: {path: String, name: String},
  // 菜单栏的二级
  children: []
})

const initData = async function() {
  const count = await this.countDocuments()

  if (!count) {
    const setting = require('../default/menu.json')
    setting.map(item => {
      if (item.children && item.children.length) {
        item.children = item.children.map(el => this(el))
      }
      return item
    })
    const data = await this.create(setting)
    console.log('[完成]', '菜单初始化', '\n', data)
  }
}

/**
 * 重新生成默认的菜单栏(用于菜单栏的更新)
 */
const reset = async function() {
  await this.remove({})
  await this.initData()
}

Object.assign(MenuSchema.statics, {initData, reset})

module.exports = mongoose.model('Menu', MenuSchema)
