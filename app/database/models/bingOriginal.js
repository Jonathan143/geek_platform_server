const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const {saveBingFile} = require('../../controller/other')
const callApi = require('../../utils/api')

const BingOriginalSchema = new BaseSchema({
  title: String,
  url: String,
  ioliuUrl: String,
  startdate: String,
  enddate: String
})

const saveBingOriginal = async function(list) {
  try {
    for (const item of list) {
      const {startdate, title, url} = item
      const bing = await this.findOne({startdate})
      if (!bing) {
        console.log('开始下载' + title)
        const bingStream = await callApi({
          api: url,
          config: {responseType: 'stream'}
        })
        await this.create(item)
        saveBingFile(startdate, title, bingStream)
      }
    }
  } catch (error) {
    console.log(error)

    return {error}
  }
}

const fetchBingFromDataBase = async function({
  nameLike,
  id,
  pageSize,
  pageIndex
}) {
  let findBy = []
  nameLike ? findBy.push({title: eval(`/${nameLike}/`)}) : ''
  id ? findBy.push({_id: id}) : ''
  pageSize = Number(pageSize)
  findBy = findBy.length ? findBy : [{}]

  const bingList = await this.find({
    $or: findBy
  })
    .sort({_id: -1})
    .limit(pageSize)
    .skip((Number(pageIndex) - 1) * pageSize)

  const total = await this.find({
    $or: findBy
  }).countDocuments()
  return {
    bingList,
    total
  }
}

Object.assign(BingOriginalSchema.statics, {
  saveBingOriginal,
  fetchBingFromDataBase
})

module.exports = mongoose.model('BingOriginal', BingOriginalSchema)
