const $callApi = require('../api')
const cheerio = require('cheerio')

const baseUrl = 'https://www.mzitu.com/'

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
  const { page, type } = ctx.query
  await $callApi({
    api: `${baseUrl}${type ? `/${type}/` : ''}${
      page === 1 ? '' : 'page/' + page
    }`,
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
      coverUrl: e.children[0].attribs.src, //封面图
      url: e.attribs.href, //图片网页的url
      date: $(e)
        .siblings('.time')
        .text()
    }
    list.push(obj) //输出目录页查询出来的所有链接地址
  })
  getAllPicUrl(list[0].url)
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
      srcList.push(`${baseSrcList[0]}${i < 10 ? '0' + i : i}.${baseSrcList[1]}`)
    }
    const picData = {
      total,
      srcList
    }
    ctx.body = picData
  })
}

const sleep = async ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

module.exports = {
  getHome,
  getAllPicUrl
}
