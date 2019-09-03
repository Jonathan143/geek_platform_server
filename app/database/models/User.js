const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId
// const Role = require('./Role')
const moment = require('moment')
const encryption = require('../../utils/encryption')
const jwt = require('jsonwebtoken')

const UserSchema = new BaseSchema({
  // 用户名
  username: {type: String, trim: true},
  // 昵称
  nickname: {type: String, trim: true, default: ''},
  // 邮箱
  email: {type: String, trim: true},
  // 密码 (AES 加密)
  password: {type: String},
  // 密码盐
  salt: {type: String},
  // 身份
  role: {type: ObjectId, ref: 'Role'},
  // 创建日期
  createDateTime: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  // 最后修改时间
  updateDateTime: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  // 最后登录时间
  lastLoginDateTime: {
    type: String,
    default: '1970-01-01 00:00:00'
  }
})

/**
 * 注册
 * @param inputUser :Object 输入的用户对象
 */
const register = async function(inputUser) {
  const {username, password, email, role, nickname} = inputUser
  if (!username || !password || !email)
    return {error: 'please input username, password or email.'}

  const users = await this.find({$or: [{username}, {email}]})
  if (users.length) return {error: 'username or email has been used.'}

  // 密码加密
  const {result, salt} = encryption.aesEncrypt(password)
  const createUser = {username, password: result, email, salt}
  if (role) createUser.role = role
  if (nickname) createUser.nickname = nickname

  await this.create(createUser)
  return {message: `user ${username} create success`}
}

/**
 * 登录
 */
const login = async function({username, password}) {
  const user = await this.findOne({
    $or: [{username}, {email: username}]
  })
  if (!user) return {error: 'user is not exists.'}

  const {result} = encryption.aesEncrypt(password, user.salt)
  if (user.password === result) {
    user.lastLoginDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    await user.save()
    const {id} = user
    const token = jwt.sign({id}, global.config.SECRET_KEY, {
      expiresIn: '5 days'
    })

    return {
      id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
      loginTime: user.lastLoginDateTime,
      token
    }
  }
  return {error: 'password is wrong.'}
}

/**
 * 根据 id 查询用户
 * @param string id
 * id 为空话则查询所有用户
 */
const findUserById = async function({id, hidePassword = true}) {
  const option = hidePassword ? {password: 0, salt: 0} : {}
  let user = id ? await this.findById(id, option) : await this.find({}, option)
  if (!user) return {error: `id: ${id} is not found.`}

  return user
}

Object.assign(UserSchema.statics, {
  register,
  login,
  findUserById
})
module.exports = mongoose.model('User', UserSchema)
