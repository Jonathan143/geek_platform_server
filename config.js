const interfaces = require('os').networkInterfaces() // 在开发环境中获取局域网中的本机iP地址
const IPAdress = (() => {
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
  return 'localhost'
})()

// 项目运行端口号
const SERVER_PORT = process.env.PORT || 3200

module.exports = {
  // 服务端口
  SERVER_PORT,
  // mongodb host
  MONGODB_HOST: 'mongodb://localhost',
  // jsonwebtoken 加密用的 key
  SECRET_KEY: '0',
  // 项目当前目录
  BASEPATH: __dirname,
  // 修改为服务器ip 或者静态文件目录域名
  STATICURL: `http://${IPAdress}:${SERVER_PORT}`,

  // 腾讯云COS 密钥ID
  SecretId: '',
  // 腾讯云COS 密钥KEY
  SecretKey: '',
  // 默认存储
  DEFAULTSTORAGE: {
    Bucket: '',
    Region: '',
    cosUrl: ''
  },
  // 对象存储加速域名
  CDNURL: '',
  // 是否上传 mzitu 到腾讯云
  ISMZITUUPLOADTOS: false,
  ISSAVETOLOCAL: true,
  // 邮件服务配置
  emailServe: {
    host: '',
    port: 2525,
    secure: true,
    auth: {
      user: '',
      pass: ''
    } // 发送者邮箱账户SMTP授权码
  }
}
