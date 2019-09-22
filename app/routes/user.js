// user.js

const router = require('koa-router')()
const user = require('../controller/user')

router.prefix('/user')

// 登录
router.post('/login', user.login)

// 注册
router.post('/register', user.register)

// 查找用户
router.get('/find_user_by_id', user.findUserById)

// 删除用户
router.post('/delete_user_by_id', user.deleteUserById)

// 更新用户
router.post('/update_user_by_id', user.updateUserById)

router.get('/fetch_user_role_list', user.fetchUserRoleList)

router.get('/menu_list', user.getUserMenuList)
router.get('/reset_menu', user.resetMenu)

module.exports = router
