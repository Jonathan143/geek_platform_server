const router = require('koa-router')()
const fileUtil = require('../utils/file')
const file = require('../controller/file')

router.prefix('/file')

router.get('/', file.getFile)

module.exports = router
