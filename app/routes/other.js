const router = require('koa-router')()
const callApi = require('../utils/api')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const mongoose = require('mongoose')
const BingOriginal = mongoose.model('BingOriginal')
const {unDraw, pullUnDraw} = require('../controller/other')

router.prefix('/other')

router.get('/bing', async ctx => {
  const data = await callApi({
    api: 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
  })
  const {url, enddate, startdate, copyright} = data.images[0]
  const bingUrl = `https://cn.bing.com/${url}`
  if (ctx.request.header['sec-fetch-dest'] === 'image') {
    ctx.status = 302
    ctx.redirect(bingUrl)
  } else {
    ctx.body = {
      url: bingUrl,
      enddate,
      startdate,
      title: copyright
    }
  }
})

router.get('/bing/online/:index?', async ctx => {
  const data = await callApi({
    api: 'https://bing.ioliu.cn/',
    param: {p: ctx.params.index || ''}
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
      startdate: dayjs(enddate)
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
    }) //输出目录页查询出来的所有链接地址
  })
  await BingOriginal.saveBingOriginal(list)
  ctx.body = list
})

router.get('/bing/original', async ctx => {
  try {
    ctx.body = await BingOriginal.fetchBingFromDataBase(ctx.query)
  } catch (error) {
    ctx.body = error
  }
})
router.get('/draw', unDraw)
router.get('/draw/pull/:page?', pullUnDraw)

const {sendEmail} = require('../utils/scheduleMail.js')
const utilSchedule = require('../utils/schedule')

router.get('/send-email', async ctx => {
  const {content} = ctx.query
  if (content) {
    await utilSchedule.createJob(
      '20 * * * * *',
      () =>
        sendEmail({
          to: '1439821144@qq.com', // list of receivers
          subject: 'Hello ✔', // Subject line
          text: content // plain text body
          // html: '<b>Hello world?</b>' // html body
        }),
      {name: 'email', type: 'email', isOpened: true}
    )
  }
  ctx.body = 'success'
})

module.exports = router
