// The fs.promises API is experimental
const fs = require('fs')
const fsp = fs.promises
const pth = require('path')
const os = require('os')
const dayjs = require('dayjs')
const {BASEPATH, ISMZITUUPLOADTOS, ISSAVETOLOCAL} = global.config
const $callApi = require('./api')
const {uploadAndGetUrl} = require('../controller/cos')

const getFileType = stats => {
  return stats.isDirectory() ? 'dir' : stats.isFile() ? 'file' : 'other'
}

/**
 *
 * @param {String} path 路径
 * @param {Boolean} displayHidden 显示隐藏文件
 * @param {Boolean} isToArray 返回数据类型 数组 对象
 */
const listDir = async (path, displayHidden = false) => {
  const userInfo = os.userInfo()
  try {
    await fsp.access(path)
    const filenameList = await fsp.readdir(path)
    const fileList = []
    for (let i = 0; i < filenameList.length; i++) {
      try {
        const name = filenameList[i]
        // 过滤隐藏文件
        if (!displayHidden && /^\./.test(name)) continue
        const fileStats = await fsp.stat(pth.join(path, name))
        fileStats.type = getFileType(fileStats)
        fileStats.name = name
        fileStats.owner =
          fileStats.uid !== 0
            ? fileStats.uid === userInfo.uid
              ? userInfo.username
              : fileStats.uid
            : 'root'
        fileList.push(fileStats)
      } catch (error) {}
    }

    return {
      dir: fileList.filter(item => item.type === 'dir'),
      file: fileList.filter(item => item.type === 'file')
    }
  } catch (err) {
    console.log(err.message)
    let error = ''
    if (err.message.includes('no such')) {
      error = `path: '${path}' is not exists`
    }
    return {error: error || err.message}
  }
}

const formatFileSize = size => {
  const unitList = ['B', 'KB', 'MB', 'GB', 'PB']
  let i = 0
  while (size / 1024 > 1) {
    size /= 1024
    i++
  }
  return size.toFixed(2) + unitList[i]
}

const mkdirsSync = async dirname => {
  if (fs.existsSync(dirname)) {
    return true
  }
  if (await mkdirsSync(pth.dirname(dirname))) {
    await fsp.mkdir(dirname)
    return true
  }
}

/**
 *
 * @param {String} basePath 基本路径 默认为/public
 * @param {String} path 文件保存路径
 * @param {stream} stream 文件流
 * @param {String} fileName 文件名
 */
const saveFileSync = async ({
  basePath = `${BASEPATH}/public/`,
  path = dayjs().format('YYYY-MM'),
  stream,
  fileName
}) => {
  if (stream && fileName) {
    // 若无目录，创建目录
    const dirPath = basePath + path
    console.log(`saveFileSync 保存地址 -- ${dirPath}`)
    await mkdirsSync(dirPath)
    const writeStream = fs.createWriteStream(`${dirPath}/${fileName}`)
    await stream.pipe(writeStream)
  } else {
    console.error('stream||fileName undefinded')
  }
}

/**
 *
 * @param {String} url
 * @param {Object} config basePath,path,fileName
 */
const saveNetworkFileSync = async (url, config) => {
  try {
    const stream = await $callApi({
      api: url,
      config: {
        responseType: 'stream'
      }
    })
    let tosUrl = ''
    if (ISMZITUUPLOADTOS) {
      tosUrl = await uploadAndGetUrl({
        filePath: config.fileName,
        path: config.path,
        stream
      })
    }
    if (ISSAVETOLOCAL) {
      await saveFileSync({
        stream,
        ...config
      })
    }
    return {code: 200, tosUrl, _id: config._id || ''}
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = {
  listDir,
  formatFileSize,
  mkdirsSync,
  saveFileSync,
  saveNetworkFileSync
}
