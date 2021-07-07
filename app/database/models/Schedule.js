const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const dayjs = require('dayjs')

const ScheduleSchema = new BaseSchema({
  name: String,
  type: String, // 类型
  isOpened: Boolean, // 状态
  createdTime: {
    type: String,
    default: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, // 开始时间
  startTime: String, // 开始时间
  endTime: String, // 结束时间
  executionCount: Number, // 执行次数
  executionTotal: Number, // 需执行次数
  dayOfWeek: Number,
  month: Number,
  dayOfMonth: Number,
  hour: Number,
  minute: Number,
  second: Number
})

const addToDB = async function(data) {
  const {_id} = await this.create(data)
  return _id
}

Object.assign(ScheduleSchema.statics, {addToDB})

module.exports = mongoose.model('Schedule', ScheduleSchema)
