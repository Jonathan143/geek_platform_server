const router = require('koa-router')()
const mzitu = require('../controller/mzitu')

router.prefix('/mzitu')

// 首页
router.get('/', mzitu.getHome)

// 搜索
router.get('/search', mzitu.search)

// 获取某个专辑的所有图片链接
router.get('/album_urls', mzitu.getAllPicUrl)

router.post('/download', mzitu.downloadAll)

router.post('/download_package', mzitu.DownloadPackage)

router.get('/get_mziFromDataBase', mzitu.fetchMziFromDataBase)

router.get('/get_category_list', mzitu.getCategoryList)

module.exports = router
