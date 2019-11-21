const moment = require('moment')
const {uploadAndGetUrl} = require('./cos')
const $callApi = require('../utils/api')
const mongoose = require('mongoose')
const Bing = mongoose.model('Bing')
const fs = require('fs')
const {mkdirsSync} = require('../utils/file')

module.exports = {
  async saveBingPic() {
    const data = await $callApi({
      api: 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
    })
    const {url, startdate, copyright} = data.images[0]
    const fileName = copyright.replace(/\//g, ' ')
    let tosUrl = ''

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
    if (global.config.ISMZITUUPLOADTOS) {
      tosUrl = await uploadAndGetUrl({
        filePath: `bing/${fileName}.jpg`,
        stream: bingStream
      })
    } else {
      const dirPath = `${global.config.BASEPATH}/public/bing/`
      await mkdirsSync(dirPath)
      // 创建可写流
      const bingWriteStream = fs.createWriteStream(`${dirPath}${fileName}.jpg`)
      bingStream.pipe(bingWriteStream)
    }

    const result = {
      url: `https://cn.bing.com/${url}`,
      date: moment(startdate).format('YYYY-MM-DD'),
      title: copyright,
      tosUrl
    }

    await Bing.saveBing(result)
    return result
  }
}
