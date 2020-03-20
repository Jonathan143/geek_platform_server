const router = require('koa-router')()
const file = require('../controller/file')

router.prefix('/file')

router.get('/', file.getFile)

router.get('/read/:filename?', file.readFile)

router.post('/upload', file.uploadFile)

module.exports = router
