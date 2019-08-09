const router = require('koa-router')()
const mzitu = require('../controller/mzitu')

router.prefix('/mzitu')

router.get('/', mzitu.getHome)

router.get('/picurl', mzitu.getAllPicUrl)

module.exports = router
