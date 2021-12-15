const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const ProjectSchema = new BaseSchema({
  name: String,
  url: String,
  date: String,
  dir: String
})

const cloneProject = async function(data) {
  const project = await this.findOne({name: data.name})
  if (project) {
    return Promise.reject('project already exists')
  }
  await this.save(data)
}

Object.assign(ProjectSchema.statics, {cloneProject})

module.exports = mongoose.model('Project', ProjectSchema)
