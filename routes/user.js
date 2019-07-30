// user.js

const router = require('koa-router')()
const user = require('../controller/user')

router.prefix('/user')

// 登录
router.get('/login', user.login)

// 用户信息
router.get('/profile', user.profile)

module.exports = router
