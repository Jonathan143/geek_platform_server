module.exports = async ms => {
  return new Promise(resolve => {
    timmer = setTimeout(() => {
      resolve(true)
    }, ms)
  })
}
