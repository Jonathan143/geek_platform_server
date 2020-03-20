const router = require('koa-router')()
const callApi = require('../utils/api')
const cheerio = require('cheerio')
const moment = require('moment')

router.prefix('/other')

router.get('/bing', async ctx => {
  const data = await callApi({
    api: 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
  })
  const {url, enddate, startdate, copyright} = data.images[0]

  if (ctx.request.header['sec-fetch-dest'] === 'image') {
    ctx.body = await callApi({
      api: url,
      config: {responseType: 'stream'}
    })
  } else {
    ctx.body = {
      url: `https://cn.bing.com/${url}`,
      enddate,
      startdate,
      title: copyright
    }
  }
})

router.get('/bing/online', async ctx => {
  const data = await callApi({
    api: 'https://bing.ioliu.cn/'
  })
  let list = []
  const $ = cheerio.load(data) //将html转换为可操作的节点
  $('.container .item .card').each(async (i, e) => {
    const enddate = e.children[2].children[1].children[1].children[0].data
    const urls = e.children[0].attribs.src.split('/')
    list.push({
      url: `https://cn.bing.com/th?id=OHR.${urls
        .splice(urls.length - 1, 1)
        .toString()
        .replace(/\?.+/, '')}`,
      ioliuUrl: e.children[0].attribs.src.replace(/\?.+/, ''),
      // ioliuUrl拼接上?imagesilm 为压缩图片
      title: e.children[2].children[0].children[0].data,
      enddate,
      startdate: moment(enddate)
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
    }) //输出目录页查询出来的所有链接地址
  })
  ctx.body = list
})

module.exports = router
