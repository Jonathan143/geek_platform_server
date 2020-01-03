const moment = require('moment')
const fs = require('fs')

const COS = require('cos-nodejs-sdk-v5')
const STS = require('qcloud-cos-sts')
const {SecretId, SecretKey, DEFAULTSTORAGE, CDNURL} = global.config
const cos = new COS({
  SecretId,
  SecretKey
})
const {Bucket, Region, cosUrl} = DEFAULTSTORAGE

const p = (fn, option = null) => {
  return new Promise((resolve, reject) => {
    cos[fn](option, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

// 临时密钥生成
const getCredential = () => {
  const policy = {
    version: '2.0',
    statement: [
      {
        action: [
          // 简单上传
          'name/cos:PutObject',
          'name/cos:PostObject',
          // 分片上传
          'name/cos:InitiateMultipartUpload',
          'name/cos:ListMultipartUploads',
          'name/cos:ListParts',
          'name/cos:UploadPart',
          'name/cos:CompleteMultipartUpload'
        ],
        effect: 'allow',
        principal: {qcs: ['*']},
        resource: ['qcs::cos:ap-guangzhou:uid/1256555015:img-1256555015/*']
      }
    ]
  }
  return new Promise((resolve, reject) => {
    STS.getCredential(
      {
        secretId: SecretId,
        secretKey: SecretKey,
        policy
        // durationSeconds: 1800,
        // proxy: '',
      },
      (err, credential) => {
        err ? reject(err) : resolve(credential)
      }
    )
  })
}

module.exports = {
  async getBucket(ctx) {
    await p('getService')
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  },

  async getFileOnBecket(ctx) {
    const {bucket = Bucket, region = Region, prefix = ''} = ctx.query

    await p('getBucket', {
      Bucket: bucket,
      Region: region,
      Prefix: prefix // 这里传入列出的文件前缀
    })
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  },

  async uploadFile(ctx) {
    const {
      bucket = Bucket,
      region = Region,
      path = '/static'
    } = ctx.request.body
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件
    const filePath = `${moment().format('YYYY-MM')}/${moment().format('DD')}/${
      file.name
    }`

    await p('putObject', {
      Bucket: bucket,
      Region: region,
      Key: `${path}/${filePath}`,
      Body: fs.createReadStream(file.path) // 这里传入前缀
    })
      .then(data => {
        data.Location = data.Location.replace(cosUrl, CDNURL)
        ctx.body = data
      })
      .catch(error => {
        ctx.status = 500
        ctx.body = error
      })
  },

  /**
   * 上传文件至腾讯云并且返回 url
   * @param {String} bucket 存储桶名
   * @param {String} region 存储桶位置
   * @param {String} path 文件基本路径 默认 static
   * @param {String} filePath 文件路径
   * @param {Object} stream 文件流
   */
  async uploadAndGetUrl({
    bucket = Bucket,
    region = Region,
    path = '/mzitu',
    filePath,
    stream
  }) {
    try {
      const data = await p('putObject', {
        Bucket: bucket,
        Region: region,
        Key: `${path}/${filePath}`,
        Body: stream // 这里传入前缀
      })
      return data.Location.replace(cosUrl, CDNURL)
    } catch (error) {
      console.error(error)
    }
  },

  async deleteFile(ctx) {
    const {bucket = Bucket, region = Region, key} = ctx.query

    await p('deleteObject', {
      Bucket: bucket,
      Region: region,
      Key: key
    })
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  },

  async credential(ctx) {
    await getCredential()
      .then(data => {
        ctx.body = data
      })
      .catch(error => {
        ctx.body = error
      })
  }
}
