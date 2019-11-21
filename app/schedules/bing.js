const schedule = require('node-schedule')
const {saveBingPic} = require('../controller/other')

module.exports = {
  // 定时爬取必应日图
  reptileBingPic() {
    schedule.scheduleJob('30 1 1 * * *', () => {
      console.log('执行任务')
      saveBingPic()
    })
  }
}
