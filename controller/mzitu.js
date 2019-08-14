const $callApi = require('../utils/api')
const cheerio = require('cheerio')
const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const { mkdirsSync } = require('../utils/file')
const qs = require('querystring')
const fileUtil = require('../utils/file')
const baseUrl = 'https://www.mzitu.com'
const { STATICURL } = require('../config')
const staticUrl = `${STATICURL}/mzitu/`

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
  const { page, type, content } = ctx.query
  console.log(content)

  await $callApi({
    api: `${baseUrl}${
      content === undefined || content === ''
        ? type
          ? `/${type}`
          : ''
        : `/search/${qs.escape(content)}`
    }${setPage(page)}`,
    param: {}
  }).then(async data => {
    ctx.body = await getCoverList(data)
  })
}

const getCategoryList = async ctx => {
  ctx.body = [
    { value: '', label: '最新' },
    { value: 'hot', label: '最热' },
    { value: 'best', label: '推荐' },
    { value: 'xinggan', label: '性感妹子' },
    { value: 'japan', label: '日本妹子' },
    { value: 'taiwan', label: '台湾妹子' },
    { value: 'mm', label: '清纯妹子' },
    { value: 'zipai', label: '妹子自拍' },
    { value: 'jiepai', label: '妹子街拍' }
  ]
}

/**
 *
 * @param {String} content 搜索内容
 */
const search = async ctx => {
  const { content, page } = ctx.query
  await $callApi({
    api: `${baseUrl}${
      content === undefined ? '' : `/search/${content}`
    }${setPage(page)}`,
    param: {}
  }).then(async data => {
    ctx.body = await getCoverList(data)
  })
}

const getCoverList = async data => {
  const $ = cheerio.load(data)
  let list = []
  $('#pins li>a').each(async (i, e) => {
    let obj = {
      name: e.children[0].attribs.alt, //标题
      coverUrl: e.children[0].attribs['data-original'], //封面图
      url: e.attribs.href, //图片网页的url
      date: $(e)
        .siblings('.time')
        .text()
    }
    list.push(obj) //输出目录页查询出来的所有链接地址
  })
  return list
}

const getAllPicUrl = async ctx => {
  const { url } = ctx.query
  await $callApi({
    api: url,
    param: {}
  }).then(async data => {
    const $ = cheerio.load(data),
      page = $('div.pagenavi > a > span'),
      baseSrcList = $('.main-image > p > a > img')[0].attribs.src.split('01.')

    let srcList = [],
      total = $(page[page.length - 2]).text()

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
  page === undefined || page === 1 ? '' : `/page/${page}`

const sleep = async ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

const download = async ctx => {
  let { urls, name } = ctx.request.body
  await mkdirsSync(path.join(__dirname, `../public/mzitu/${name}`))
  ctx.body = await downloadAll(urls, name)
}

const downloadAll = async (urlList, name) => {
  let list = []
  for (const url of urlList) {
    const fileName = url.imageUrl.match('[^/]+(?!.*/)')[0]
    const filePath = `/public/mzitu/${name}/${fileName}`

    if (!fs.existsSync(path.join(__dirname, `..${filePath}`))) {
      const writeStream = fs.createWriteStream(`.${filePath}`)

      await downloadApi(url).then(async data => {
        await data.pipe(writeStream)
      })
    }
    list.push(`${staticUrl}${name}/${fileName}`)
  }

  return list
}

const downloadApi = url => {
  return $callApi({
    api: url.imageUrl,
    config: {
      responseType: 'stream',
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        Host: 'i.meizitu.net',
        Pragma: 'no-cache',
        'Proxy-Connection': 'keep-alive',
        Referer: url.pageUrl,
        'Upgrade-Insecure-Requests': 1,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36'
      }
    } //反防盗链
  })
}

const getAllDownloadFile = async ctx => {
  const { filePath } = ctx.query
  const result = await fileUtil.listDir(
    path.join(__dirname, `../public/mzitu/${filePath ? filePath : ''}`)
  )
  ctx.body = result
}

module.exports = {
  getHome,
  getAllPicUrl,
  search,
  download,
  getCategoryList,
  getAllDownloadFile
}
