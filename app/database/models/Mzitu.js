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
  children: []
})

const addCover = async function({title, url, date}) {
  const data = await this.create({title, url, date})

  return data
}

const addCoverChilden = async function({title, urls, isUploadTos = false}) {
  try {
    const data = await this.findOne({title})
    if (!data.length) {
      this.updateOne(
        {_id: id},
        {
          isUploadTos,
          updateDateTime: moment().format('YYYY-DD-MM HH:mm:ss'),
          children: urls
        }
      )
    }
    return true
  } catch (error) {
    return false
  }
}

const findOneByTitle = async function({title}) {
  const data = await this.findOne({title})
  return data
}

Object.assign(MzituSchema.statics, {addCover, findOneByTitle, addCoverChilden})

module.exports = mongoose.model('Mzitu', MzituSchema)
