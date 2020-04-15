const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const {saveNetworkFileSync} = require('../../utils/file')

const IllustrationSchema = new BaseSchema({
  title: String,
  image: String,
  slug: String,
  tosUrl: String
})

const saveIllustration = async function(list) {
  try {
    if (!Array.isArray(list)) list = [list]
    const filterList = []
    const pormiseMethods = []
    for (const item of list) {
      const {_id, title, image} = item
      const illustration = await this.findOne({_id})
      if (!illustration) {
        const urls = image.split('/')
        pormiseMethods.push(
          saveNetworkFileSync(image, {
            _id,
            path: 'illustrations',
            fileName: urls.splice(urls.length - 1, 1).toString()
          })
        )
        filterList.push({...item, tosUrl: ''})
      } else {
        console.log(`已存在 -- ${title}`)
      }
    }
    if (filterList.length) {
      await this.insertMany(filterList)
      const result = await Promise.all(pormiseMethods)
      for (const {_id, tosUrl} of result) {
        if (_id && tosUrl) {
          await this.updateOne({_id}, {tosUrl})
        }
      }
      console.log(result)
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

  const list = await this.find({
    $or: findBy
  })
    .sort({_id: -1})
    .limit(pageSize)
    .skip((Number(pageIndex) - 1) * pageSize)

  const total = await this.find({
    $or: findBy
  }).countDocuments()
  return {
    list,
    total
  }
}

Object.assign(IllustrationSchema.statics, {
  saveIllustration,
  fetchIllustrationFromDataBase
})

module.exports = mongoose.model('Illustration', IllustrationSchema)
