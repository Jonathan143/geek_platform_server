const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

const BrowserSchema = new BaseSchema({
  name: String,
  major: String,
  osName: String,
  osVersion: String,
  time: String
})

// 保存浏览器信息
const saveBrowserInfo = async function(data) {
  try {
    const result = await this.create(data)
    return result
  } catch (error) {
    return {error}
  }
}

/**
 * 统计浏览器类型 及 不同版本使用数
 * @returns {Object} {name: String, total: Number, majorList: {major: String, total: Number}}
 */
const gerBrowesrTypeTotalList = async function() {
  return await this.aggregate([
    {
      $match: {
        name: {
          $ne: null
        }
      }
    },
    {
      $group: {
        _id: '$name',
        majorList: {$push: '$major'},
        total: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        total: 1,
        majorList: {
          $function: {
            body: function(majorList) {
              const types = {}
              majorList.forEach(i => {
                types[i] = types[i] ? types[i] + 1 : 1
              })
              return Object.keys(types)
                .map(item => ({
                  major: item,
                  total: types[item]
                }))
                .sort((a, b) => a.total < b.total)
            },
            args: ['$majorList'],
            lang: 'js'
          }
        }
      }
    },
    {
      $sort: {
        total: -1
      }
    }
  ])
}

Object.assign(BrowserSchema.statics, {saveBrowserInfo, gerBrowesrTypeTotalList})

module.exports = mongoose.model('Browser', BrowserSchema)
