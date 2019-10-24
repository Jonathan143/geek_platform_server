const $callApi = require('../utils/api')
const cheerio = require('cheerio')
const fs = require('fs')
const {mkdirsSync} = require('../utils/file')
const qs = require('querystring')
const baseUrl = 'https://www.mzitu.com'
const {STATICURL, BASEPATH, ISMZITUUPLOADTOS} = global.config
const staticUrl = `${STATICURL}/mzitu/`
const moment = require('moment')
const {uploadAndGetUrl} = require('./cos')
const mongoose = require('mongoose')
const Mzitu = mongoose.model('Mzitu')
/**
 *
 * @param {String} type
 * type 入参  空为最新
 * @hot 最热
 * @xinggan 性感
 * @best 推荐
 * @japan 日本
 * @taiwan 台湾
 * @mm 清纯
 * @zipai 自拍
 * @jiepai 街拍
 */
const getHome = async ctx => {
  const {page, type, content} = ctx.query
  const apiUrl = `${baseUrl}${
    content === undefined || content === ''
      ? type
        ? `/${type}/`
        : ''
      : `/search/${qs.escape(content)}/`
  }${setPage(page)}`

  await $callApi({
    api: apiUrl,
    param: {}
  }).then(async data => {
    ctx.body = await getCoverList(data, apiUrl)
  })
}

const getCategoryList = async ctx => {
  ctx.body = [
    {value: '', label: '最新'},
    {value: 'hot', label: '最热'},
    {value: 'best', label: '推荐'},
    {value: 'xinggan', label: '性感妹子'},
    {value: 'japan', label: '日本妹子'},
    {value: 'taiwan', label: '台湾妹子'},
    {value: 'mm', label: '清纯妹子'},
    {value: 'zipai', label: '妹子自拍'},
    {value: 'jiepai', label: '妹子街拍'}
  ]
}

/**
 *
 * @param {String} content 搜索内容
 */
const search = async ctx => {
  const {content, page} = ctx.query
  const apiUrl = `${baseUrl}${
    content === undefined ? '' : `/search/${content}`
  }${setPage(page)}`

  await $callApi({
    api: apiUrl,
    param: {}
  }).then(async data => {
    ctx.body = await getCoverList(data, apiUrl)
  })
}

const getCoverList = async (data, apiUrl) => {
  const $ = cheerio.load(data)
  let list = []

  $('#pins li>a').each((i, e) => {
    const cAttribs = e.children[0].attribs
    let obj = {
      name: cAttribs.alt, //标题
      coverUrl: cAttribs['data-original'], //封面图
      sourceUrl: e.attribs.href, //图片网页的url
      date: $(e)
        .siblings('.time')
        .text()
    }
    list.push(obj) //输出目录页查询出来的所有链接地址
  })
  if (!list.length) {
    $('#content>.placeholder>.place-padding figure').each((i, e) => {
      const cAttribs = $(e).find($('img'))['0'].attribs
      let obj = {
        name: cAttribs.alt, //标题
        coverUrl: cAttribs['data-original'], //封面图
        sourceUrl: $(e).find($('a'))['0'].attribs.href, //图片网页的url
        date: $(e)
          .siblings('.post-meta')
          .find($('.time'))
          .text()
      }

      list.push(obj) //输出目录页查询出来的所有链接地址
    })
  }
  for (const i of list) {
    i.coverUrl = await download({apiUrl, ...i})
  }
  return list
}

const getAllPicUrl = async ctx => {
  const {url} = ctx.query
  await $callApi({
    api: url,
    param: {}
  }).then(async data => {
    const $ = cheerio.load(data)
    let srcList = [],
      total = 0,
      baseSrcList = []
    try {
      const page = $('div.pagenavi > a > span')
      baseSrcList = $('.main-image > p > a > img')[0].attribs.src.split('01.')

      total = $(page[page.length - 2]).text()
    } catch (error) {
      total = $('.prev-next-page')
        .text()
        .replace(/[1\/,页]/g, '')
      baseSrcList = $('.place-padding>figure a img')['0'].attribs.src.split(
        '01.'
      )
    }

    for (let i = 1; i <= total; i++) {
      srcList.push({
        pageUrl: `${url}/${i}`,
        imageUrl: `${baseSrcList[0]}${i < 10 ? '0' + i : i}.${baseSrcList[1]}`
      })
    }
    const picData = {
      total,
      srcList
    }
    ctx.body = picData
  })
}

const setPage = page =>
  page === undefined || page === '1' ? '' : `/page/${page}/`

const formatDate = date => {
  return moment(date).format('YYYY-MM')
}

const download = async ({coverUrl, name, date, apiUrl, sourceUrl}) => {
  const mzituCover = await Mzitu.findOneByTitle({title: name})
  const basePath = `cover/${formatDate(date)}`
  const dirPath = `${BASEPATH}/public/mzitu/${basePath}`
  const fileName = name + coverUrl.match(/\.(\w+)$/)[0]
  let mzituUrl = `${staticUrl}${basePath}/${fileName}`

  if (!mzituCover) {
    const data = await downloadApi({imageUrl: coverUrl, pageUrl: apiUrl})

    if (ISMZITUUPLOADTOS) {
      mzituUrl = await uploadAndGetUrl({
        filePath: `${basePath}/${fileName}`,
        stream: data
      })
    } else {
      await mkdirsSync(dirPath)
      const filePath = `${dirPath}/${fileName}`
      const writeStream = fs.createWriteStream(filePath)
      await data.pipe(writeStream)
    }

    Mzitu.addCover({title: name, date, coverUrl: mzituUrl, sourceUrl})
  } else {
    mzituUrl = mzituCover.coverUrl
  }

  return mzituUrl
}

const downloadAll = async ctx => {
  let {urls, name, date} = ctx.request.body
  const mzituCover = await Mzitu.findOneByTitle({title: name})
  let list = []
  const fDate = formatDate(date)
  const dirPath = `${BASEPATH}/public/mzitu/${fDate}/${name}`

  if (mzituCover.isDownload) {
    list = mzituCover.children
  } else {
    await mkdirsSync(dirPath)
    for (const url of urls) {
      const fileName = url.imageUrl.match('[^/]+(?!.*/)')[0]
      const filePath = `${dirPath}/${fileName}`
      let mzituUrl = `${staticUrl}${fDate}/${name}/${fileName}`

      const data = await downloadApi(url)
      if (ISMZITUUPLOADTOS) {
        mzituUrl = await uploadAndGetUrl({
          filePath: `${fDate}/${name}/${fileName}`,
          stream: data
        })
      } else {
        const writeStream = fs.createWriteStream(filePath)
        await data.pipe(writeStream)
      }

      list.push(mzituUrl)
    }

    await Mzitu.addCoverChilden({
      title: name,
      urls: list,
      isUploadTos: ISMZITUUPLOADTOS
    })
  }

  ctx.body = list
}

const downloadApi = ({imageUrl, pageUrl}) => {
  return $callApi({
    api: imageUrl,
    config: {
      responseType: 'stream',
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        Host: 'i5.meizitu.net',
        Pragma: 'no-cache',
        'Proxy-Connection': 'keep-alive',
        Referer: pageUrl,
        'Upgrade-Insecure-Requests': 1,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36'
      }
    } //反防盗链
  })
}

const fetchMziFromDataBase = async ctx => {
  ctx.body = await Mzitu.fetchMziFromDataBase(ctx.query)
}

module.exports = {
  getHome,
  getAllPicUrl,
  search,
  downloadAll,
  getCategoryList,
  fetchMziFromDataBase
}
