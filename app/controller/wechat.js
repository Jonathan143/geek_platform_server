const $callApi = require('../utils/api')
const baseUrl = 'https://api.weixin.qq.com/'

const getAccessToken = async (ctx, appid, secret) => {
  try {
    const data = await $callApi({
      api: baseUrl + 'cgi-bin/token',
      param: {grant_type: 'client_credential', appid, secret}
    })
  } catch (error) {}
}
