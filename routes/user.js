// user.js

const router = require('koa-router')()
const user = require('../controller/user')

router.prefix('/user')

router.get('/login', user.login)
router.get('/profile', user.profile)

module.exports = router
