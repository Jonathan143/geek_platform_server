const $callApi = require('../utils/api')
const axios = require('axios')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const schedule = require('node-schedule')

const homePage =
  'https://qmzs.muoue.com/app/index.php?i=1&c=entry&do=Hzwshowcontent&m=zhiwu55cn_hotnews&id=213&shareopenid=owYY36zJya05mFxilRSe6bvcaOxU'

const {WXWORK_BOT} = global.config

const sendNotify = content => {
  WXWORK_BOT &&
    axios({
      url: WXWORK_BOT,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {
        msgtype: 'text',
        text: {
          content,
          mentioned_list: ['@all']
        }
      }
    }).finally(info => {
      console.log(info)
    })
}

const reFindHomePage = async (initScheduleJob = false, disnotify = false) => {
  const data = await $callApi({
    api: homePage,
    config: {
      responseType: 'document',
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': 1,
        'user-agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604'
      }
    }
  })

  const $ = cheerio.load(data)
  const childrenDomList = $(
    '#page-content > div.rich_media_area_primary_inner > section:nth-child(5) > section > section:nth-child(2) > section > section > section > section > section > section > section > section > section > section'
  ).children()

  const list = Array.from(childrenDomList)
    .map(item =>
      item.name === 'section'
        ? Array.from($(item).children()).map(i => $(i).text() || '\n')
        : $(item).text() || '\n'
    )
    .reduce((a, b) => a.concat(Array.isArray(b) ? b : [b]), [])
    .join('')
    .split('\n')
    .filter(item => item.includes('不限户籍'))
    .map(i => i.split(/\s/))

  let notifyContent = ''
  const newList = list.map(item => {
    const [date, ...info] = item
    const d = Array.from(date.match(/\d+/g))
    d.length < 4 && d.push('00')
    const [month, day, hour, minute] = d

    const time = `2022-${month}-${day} ${
      date.includes('早上') ? (+hour < 10 ? '0' + hour : hour) : +hour + 12
    }:${date.includes('点半') ? 30 : minute}:00`

    notifyContent += `${date}\n${info + ''}\n\n`

    if (initScheduleJob && dayjs().isSame(`2022-${month}-${day}`, 'date')) {
      schedule.scheduleJob(
        dayjs(time)
          .subtract(3, 'minute')
          .format('m H D M *'),
        () => {
          console.log('定时任务')
          sendNotify(item + '')
        }
      )
    }

    return {
      time,
      content: item + ''
    }
  })

  !disnotify && sendNotify(notifyContent)

  return newList
}

module.exports = {
  reFindHomePage
}
