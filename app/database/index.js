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

const initData = async () => {
  await Menu.initData()
}
