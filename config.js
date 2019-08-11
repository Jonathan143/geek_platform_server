module.exports = {
  // 服务端口
  SERVER_PORT: process.env.PORT || 3200,
  // mongodb host
  MONGODB_HOST: 'mongodb://localhost',
  // jsonwebtoken 加密用的 key
  SECRET_KEY: '0',
  // 项目当前目录
  basePath: __dirname,

  // 腾讯云COS 密钥ID
  SecretId: '',
  // 腾讯云COS 密钥KEY
  SecretKey: ''
}
