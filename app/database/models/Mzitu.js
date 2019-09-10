const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const MzituSchema = new BaseSchema({
  title: String,
  url: String,
  isDownload: {
    type: Boolean,
    default: false
  },
  isUploadTos: {
    type: Boolean,
    default: false
  },
  date: String,
  updateDateTime: {
    type: String,
    default: ''
  },
  downloadDateTime: {
    type: String,
    default: ''
  },
  // 菜单栏的二级
  children: []
})

const addCover = async function() {}

// Object.assign(MzituSchema.statics, {addCover})

module.exports = mongoose.model('Mzitu', MzituSchema)
