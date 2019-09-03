// user.js

const router = require('koa-router')()
const user = require('../controller/user')

router.prefix('/user')

// 登录
router.post('/login', user.login)

// 查找用户
router.get('/find_user', user.findUserById)

router.get('/menu_list', user.getUserMenuList)

module.exports = router
