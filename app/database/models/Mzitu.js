const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const moment = require('moment')

const MzituSchema = new BaseSchema({
  title: String,
  sourceUrl: String,
  coverUrl: String,
  isUploadTos: {
    type: Boolean,
    default: false
  },
  isDownload: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: ''
  },
  loadDate: {
    type: String,
    default: moment().format('YYYY-DD-MM HH:mm:ss')
  },
  updateDateTime: {
    type: String,
    default: ''
  },
  downloadDateTime: {
    type: String,
    default: ''
  },
  children: []
})

const getTime = () => moment().format('YYYY-DD-MM HH:mm:ss')

const addCover = async function({title, sourceUrl, coverUrl, date}) {
  const data = await this.create({title, sourceUrl, coverUrl, date})

  return data
}

const addCoverChilden = async function({title, urls, isUploadTos = false}) {
  try {
    const data = await this.updateOne(
      {title},
      {
        isDownload: true,
        isUploadTos,
        downloadDateTime: getTime(),
        updateDateTime: isUploadTos ? getTime() : '',
        children: urls
      }
    )
    return data
  } catch (error) {
    return {error}
  }
}

const findOneByTitle = async function({title}) {
  const data = await this.findOne({title})
  return data
}

const fetchMziFromDataBase = async function({nameLike, id}) {
  let findBy = {}
  nameLike ? (findBy.title = eval(`/${nameLike}/`)) : ''
  id ? (findBy._id = id) : ''

  const mziList = await this.find({
    $or: [findBy]
  })
    .limit(10)
    .skip(0)
  const total = await this.find({
    $or: [findBy]
  }).count()
  return {
    mziList,
    total
  }
}

Object.assign(MzituSchema.statics, {
  addCover,
  findOneByTitle,
  addCoverChilden,
  fetchMziFromDataBase
})

module.exports = mongoose.model('Mzitu', MzituSchema)
