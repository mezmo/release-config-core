'use strict'

const {execa} = require('execa')

module.exports = log

async function log(cwd, ...args) {
  const {stdout} = await execa('git', ['log', ...args], {cwd: cwd})
  return stdout
}
