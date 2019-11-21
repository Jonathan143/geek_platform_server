const router = require('koa-router')()
const callApi = require('../utils/api')

router.prefix('/other')

router.get('/bing', async ctx => {
  const data = await callApi({
    api: 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
  })

  const {url, enddate, startdate, copyright} = data.images[0]
  ctx.body = {
    url: `https://cn.bing.com/${url}`,
    enddate,
    startdate,
    title: copyright
  }
})

module.exports = router
