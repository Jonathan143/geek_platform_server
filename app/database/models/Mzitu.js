const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const moment = require('moment')

const MzituSchema = new BaseSchema({
  title: String,
  url: String,
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

const addCover = async function({title, url, date}) {
  const data = await this.create({title, url, date})

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

const fetchMziWhereIsDownload = async function({nameLike, id}) {
  let findBy = {}
  nameLike ? (findBy.title = eval(`/${nameLike}/`)) : ''
  id ? (findBy._id = id) : ''

  const data = await this.find({
    $or: [findBy]
  })
  return data
}

Object.assign(MzituSchema.statics, {
  addCover,
  findOneByTitle,
  addCoverChilden,
  fetchMziWhereIsDownload
})

module.exports = mongoose.model('Mzitu', MzituSchema)
