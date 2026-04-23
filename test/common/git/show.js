'use strict'
const {execa} = require('execa')

module.exports = show

async function show(ref, cwd) {
  const {stdout} = await execa('git', ['show', ref], {cwd: cwd})
  return stdout
}
