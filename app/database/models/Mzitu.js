const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const moment = require('moment')

const MzituSchema = new BaseSchema({
  title: String,
  path: String,
  isUploadTos: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: moment().format('YYYY-DD-MM HH:mm:ss')
  },
  updateDateTime: {
    type: String,
    default: ''
  },
  // 菜单栏的二级
  children: []
})

const addCover = async function() {}

// Object.assign(MzituSchema.statics, {addCover})

module.exports = mongoose.model('Mzitu', MzituSchema)
