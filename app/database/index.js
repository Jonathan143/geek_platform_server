const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(`${global.config.MONGODB_HOST}/geek_platform`, {
  useNewUrlParser: true,
  useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', async () => {
  await initData()
  console.log('mongodb opened.')
})

const Menu = require('./models/Menu')
const Role = require('./models/Role')
const User = require('./models/User')

const registerSuperAdmin = async () => {
  const count = await User.countDocuments()
  if (!count) {
    const user = {
      username: 'superadmin',
      password: '1',
      email: '1439821144@qq.com',
      role: 'superadmin',
      nickname: '超级管理员'
    }
    await User.register(user)
    console.log(user)
  }
}

const initData = async () => {
  await Menu.initData()
  await Role.initData()
  await registerSuperAdmin()
}
