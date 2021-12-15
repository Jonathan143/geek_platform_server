import simpleGit from 'simple-git'
import fastq from 'fastq'
import dayjs from 'dayjs'

const queue = fastq(async cb => {
  cb()
}, 2)

const git = (name = '') =>
  simpleGit({
    baseDir: process.cwd() + '/project/' + name,
    binary: 'git',
    maxConcurrentProcesses: 6
  })

const getName = url => {
  const list = url.split('/')
  return list[list.length - 1].replace('.git', '')
}

/**
 * post 克隆项目
 * @param {string} url 项目地址
 */
const projectClone = async ctx => {
  const {url} = ctx.body
  const id = await this.projectService.addOne({
    url,
    name: getName(url),
    createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    state: 'cloning'
  })

  queue.push(async () => {
    let state = 'success'
    try {
      await git().clone(url)
    } catch (error) {
      state = 'fail'
    }
    await this.projectService.updateOne(id, {state})
  })

  ctx.body = {
    id,
    message: `start clone ${url}`,
    state: 'cloning'
  }
}

/**
 * get 查询提交日志
 * @param {string} name 项目名
 */
const projectLogs = async ctx => {
  const {name} = ctx.query
  const log = await git(name).log({n: 100})

  ctx.body = {name, log}
}

/**
 * get 查询分支
 * @param name 项目名称
 * @param local 传入值则只返回本地分支
 * @returns {
 *    all: string[] 所有分支名
 *    branches: {}[]
 *    current: string 当前分支
 *    detached: boolean 独立的
 * }
 */
const projectBranchLocal = async ctx => {
  const {name, local} = ctx.query

  ctx.body = local ? await git(name).branchLocal() : await git(name).branch()
}

/**
 * get 从远程拉取分支代码
 * @param {string} name
 */
const projectPull = async ctx => {
  const {name} = ctx.query
  ctx.body = await git(name).pull()
}

module.exports = {
  projectClone,
  projectLogs,
  projectBranchLocal,
  projectPull
}
