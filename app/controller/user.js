const config = require('../../config')
const jwt = require('jsonwebtoken')

module.exports = {
  // 登录
  login(ctx) {
    const {username, password} = ctx.request.body
    if (username === 'jonathan') {
      const id = 1
      const token = jwt.sign({id}, config.SECRET_KEY, {
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

  getUserMenuList(ctx) {
    ctx.body = [
      {
        id: 0,
        route: {
          name: 'home'
        },
        fontClass: 'el-icon-s-data',
        title: '概览'
      },
      {
        id: 1,
        route: {
          name: 'mzitu'
        },
        fontClass: 'el-icon-picture',
        title: '妹子图'
      },
      {
        id: 2,
        route: {
          name: 'file'
        },
        icon: 'xiangmuguanli',
        title: '文件'
      },
      {
        id: 3,
        route: {
          name: 'reptile'
        },
        icon: 'crawler',
        title: '爬虫'
      }
    ]
  }
}
