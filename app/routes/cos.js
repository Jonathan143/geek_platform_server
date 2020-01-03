const router = require('koa-router')()
const cos = require('../controller/cos')

router.prefix('/cos')

// 获取临时密钥
router.get('/credential', cos.credential)

// 查询存储桶列表
router.get('/bucket', cos.getBucket)

// 根据存储桶查询文件
router.get('/file', cos.getFileOnBecket)

// 上传文件
router.post('/upload', cos.uploadFile)

// 删除文件
router.get('/delete', cos.deleteFile)

module.exports = router
