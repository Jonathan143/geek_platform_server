const mongoose = require('mongoose')
const schedule = require('node-schedule')
const DBSchedule = mongoose.model('Schedule')

class Schedule {
  constructor() {
    this.jobs = {}
  }

  /**
   * 创建计划任务
   * @param {Object} rule 规则
   *   @second (0-59)
   *   @minute (0-59)
   *   @hour (0-23)
   *   @dayOfMonth (1-31)
   *   @month (0-11)
   *   @dayOfWeek (0-6) Starting with Sunday
   * @param {function} task 任务
   */
  async createJob(rule, task, info) {
    try {
      const job = schedule.scheduleJob(rule, () => {
        console.log('执行任务1')
        task()
      })
      schedule.scheduleJob('1-10 * * * * *', () => {
        console.log('执行任务')
      })
      const _id = await DBSchedule.addToDB({...rule, ...info})
      console.log(_id)
      this.jobs[_id] = job
      console.log(this.jobs)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new Schedule()
