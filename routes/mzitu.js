const router = require('koa-router')()
const mzitu = require('../controller/mzitu')

router.prefix('/mzitu')

// 首页
router.get('/', mzitu.getHome)

// 搜索
router.get('/search', mzitu.search)

// 获取某个专辑的所有图片链接
router.get('/picurl', mzitu.getAllPicUrl)

router.post('/download', mzitu.download)

module.exports = router
