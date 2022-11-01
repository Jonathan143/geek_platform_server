const schedule = require('node-schedule')
const {saveBingPic} = require('../controller/other')
const {reFindHomePage} = require('../controller/hpv-notify')

module.exports = {
  // 定时爬取必应日图
  reptileBingPic() {
    schedule.scheduleJob('30 1 1 * * *', () => {
      console.log('执行任务')
      saveBingPic()
    })
  },

  HPVNotify() {
    schedule.scheduleJob('30 8 * * *', () => {
      console.log('执行任务-----HPV通知')
      reFindHomePage(false, false)
    })
    schedule.scheduleJob('0 5 * * *', () => {
      console.log('执行任务-----HPV定时任务')
      reFindHomePage(true, true)
    })
  }
}
