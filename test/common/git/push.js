'use strict'

const {execa} = require('execa')

module.exports = push

async function push(cwd, remote = 'origin', branch = 'main') {
  const stream = execa('git', ['push', '--tags', remote, `HEAD:${branch}`], {cwd: cwd})
  stream.stdout.pipe(process.stdout)
  await stream
}
