const nodemailer = require('nodemailer')
// const schedule = require('node-schedule')
const {emailServe} = global.config

const transporter = nodemailer.createTransport(emailServe)

module.exports = {
  // 立即发送email
  sendEmail({
    from = '"Jonathan" <no-reply@mail.yang143.cn>', // 发送者昵称与邮箱地址
    ...mailOptions
  }) {
    return new Promise((resolve, reject) => {
      transporter.sendMail({from, ...mailOptions}, (error, info = {}) => {
        if (error) {
          reject(error)
        }
        resolve(info)
      })
    })
  },

  /**
   * 定时器
   * @options
   *    @dayOfWeek
   *    @month
   *    @dayOfMonth
   *    @hour
   *    @minute
   *    @second
   */
  // scheduleEmail(mailOptions, rule) {
  //   schedule.scheduleJob(rule, () => {
  //     console.log('执行任务')
  //     sendEmail(mailOptions)
  //   })
  // }

  cancelScheduleEmail() {}
}
