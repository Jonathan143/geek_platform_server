const nodemailer = require('nodemailer')
// const schedule = require('node-schedule')

let emailServe = {
  service: 'SendCloud', // 发送者邮箱厂家
  port: 2525,
  secureConnection: true,
  auth: {
    user: '',
    pass: ''
  } // 发送者邮箱账户SMTP授权码
}

const transporter = nodemailer.createTransport(emailServe)

module.exports = {
  // 立即发送email
  sendEmail({
    from = '"Jonathan" <root@mail.yang143.cn>', // 发送者昵称与邮箱地址
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
  }

  // 定时发送email
  // scheduleEmail(mailOptions, rule) {
  //   schedule.scheduleJob(rule, () => {
  //     console.log('执行任务')
  //     sendEmail(mailOptions)
  //   })
  // }
}
