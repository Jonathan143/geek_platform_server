const moment = require('moment')
const {uploadAndGetUrl} = require('./cos')
const $callApi = require('../utils/api')
const mongoose = require('mongoose')
const Bing = mongoose.model('Bing')
const Illustration = mongoose.model('Illustration')
const fs = require('fs')
const {mkdirsSync} = require('../utils/file')

const saveBingFile = async (startdate, fileName, bingStream) => {
  fileName = fileName.replace(/\//g, ' ')
  let tosUrl = ''
  const {ISMZITUUPLOADTOS, ISSAVETOLOCAL, BASEPATH} = global.config
  if (ISMZITUUPLOADTOS) {
    tosUrl = await uploadAndGetUrl({
      path: '/bing',
      filePath: `${moment(startdate).format('YYYY-MM')}/${fileName}.jpg`,
      stream: bingStream
    })
  }
  if (ISSAVETOLOCAL) {
    const dirPath = `${BASEPATH}/public/bing/${moment(startdate).format(
      'YYYY-MM'
    )}`
    await mkdirsSync(dirPath)
    // 创建可写流
    const bingWriteStream = fs.createWriteStream(`${dirPath}/${fileName}.jpg`)
    bingStream.pipe(bingWriteStream)
  }
  return tosUrl
}

const pullUnDraw = async ctx => {
  try {
    const list = await $callApi({
      api: 'https://undraw.co/api/illustrations',
      param: {
        page: ctx.params.page || 0
      }
    })
    // 保存文件&数据库
    await Illustration.saveIllustration(list.illustrations)
    ctx.body = list
  } catch (error) {
    ctx.body = error
  }
}

const unDraw = async ctx => {
  ctx.body = await Illustration.fetchIllustrationFromDataBase(ctx.query)
}

module.exports = {
  async saveBingPic() {
    const data = await $callApi({
      api: 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
    })
    const {url, startdate, copyright} = data.images[0]
    const fileName = copyright.replace(/\//g, ' ')
    const bingStream = await $callApi({
      api: `https://cn.bing.com/${url}`,
      config: {
        responseType: 'stream',
        headers: {
          Referer: 'http://cn.bing.com',
          Host: 'cn.bing.com'
        }
      }
    })

    const result = {
      url: `https://cn.bing.com/${url}`,
      date: moment(startdate).format('YYYY-MM-DD'),
      title: copyright,
      tosUrl: await saveBingFile(startdate, fileName, bingStream)
    }

    await Bing.saveBing(result)
    return result
  },
  saveBingFile,
  unDraw,
  pullUnDraw
}
