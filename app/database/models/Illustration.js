const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const IllustrationSchema = new BaseSchema({
  title: String,
  image: String,
  slug: String
})

const saveIllustration = async function(list) {
  try {
    if (!Array.isArray(list)) list = [list]
    const filterList = []
    for (const item of list) {
      const {_id} = item
      const illustration = await this.findOne({_id})
      if (!illustration) filterList.push(item)
    }
    if (filterList.length) {
      await this.insertMany(filterList)
    }
  } catch (error) {
    console.log(error)
    return {error}
  }
}

const fetchIllustrationFromDataBase = async function({
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
  }).count()
  return {
    bingList,
    total
  }
}

Object.assign(IllustrationSchema.statics, {
  saveIllustration,
  fetchIllustrationFromDataBase
})

module.exports = mongoose.model('Illustration', IllustrationSchema)
