const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const BingSchema = new BaseSchema({
  title: String,
  url: String,
  tosUrl: String,
  date: String
})

const saveBing = async function(data) {
  try {
    const bing = await this.findOne({date: data.date})
    if (bing) return bing
    const result = await this.create(data)
    return result
  } catch (error) {
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

Object.assign(BingSchema.statics, {saveBing, fetchBingFromDataBase})

module.exports = mongoose.model('Bing', BingSchema)
