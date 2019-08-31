// user.js

const router = require('koa-router')()
const user = require('../controller/user')

router.prefix('/user')

// 登录
router.post('/login', user.login)

// 用户信息
router.get('/profile', user.profile)

router.get('/menu_list', user.getUserMenuList)

module.exports = router
