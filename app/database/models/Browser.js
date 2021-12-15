const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const BrowserSchema = new BaseSchema({
  name: String,
  major: String,
  osName: String,
  osVersion: String,
  time: String
})

const saveBrowserInfo = async function(data) {
  try {
    const result = await this.create(data)
    return result
  } catch (error) {
    return {error}
  }
}

Object.assign(BrowserSchema.statics, {saveBrowserInfo})

module.exports = mongoose.model('Browser', BrowserSchema)
