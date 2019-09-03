const crypto = require('crypto')

// 根据长度随机生成字符串
const genRandomString = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

module.exports = {
  genRandomString,
  /**
   *  使用sha512算法加盐进行hash
   */
  hash512: (str, salt = genRandomString(16)) => {
    let hash = crypto.createHamc('sha512', salt)
    hash.update(str)
    let value = hash.digest('hex')
    return {result: value, salt}
  },
  /**
   *  AES对称加密
   */
  aesEncrypt: (data, key = genRandomString(16)) => {
    const cipher = crypto.createCipher('aes192', key)
    let crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return {result: crypted, salt: key}
  },
  /**
   *  AES对称解密
   */
  aesDecrypt: (encrypted, key) => {
    const decipher = crypto.createDecipher('aes192', key)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
