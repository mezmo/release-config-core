'use strict'

const path = require('node:path')
const {promises: fs} = require('node:fs')
const {execa} = require('execa')
const {test, threw} = require('tap')
const git = require('../common/git/index.js')
const config = require('../../index.js')

const stringify = JSON.stringify

test('release-config', async (t) => {
  const cwd = t.testdir({
    'package.json': stringify({
      name: 'local-one'
    , version: '0.0.0'
    , scripts: {
        'local-release': 'semantic-release'
      }
    , release: {
        'ci': true
      , 'npmPublish': false
      , 'branches': ['main']
      , 'extends': path.join(__dirname, '..', '..', 'index.js')
        // remove the github plugin for the sake of testing / sanity
        // its not a thing we really need to test
      , 'plugins': config.plugins.filter((plugin) => {
          return plugin[0] !== '@semantic-release/github'
        })
      }
    , devDependencies: {
        'semantic-release': '25.x'
      , '@semantic-release/git': '10.x'
      }
    })
  , '.gitignore': 'node_modules/'
  })

  await git.init(cwd)
  t.comment('git repo initialized')
  await git.add(cwd)
  await git.commit(
    cwd
  , `
    feat: initial release

    This is the first commit
    it has a github reference in it

    resolves: #1
    `.trim()
  )

  const origin = await git.initOrigin(cwd)

  t.teardown(async () => {
    try {
      await fs.rmdir(origin, {recursive: true})
    } catch {
      // nothing to do
    }
  })
  t.comment(`repository: ${cwd}`)
  t.comment(`origin: ${origin}`)

  {
    await execa('npm', ['install'], {
      cwd: cwd
    })
  }

  const stream = execa('npm', [
    'run'
  , 'local-release'
  , `--repositoryUrl=${origin}`], {
    cwd: cwd
  , env: {
      BRANCH_NAME: 'main'
    , CI_BRANCH: 'main'
    , CI: 'true'
    , GIT_BRANCH: 'main'
    , CHANGE_ID: ''
    }
  })
  stream.stdout.pipe(process.stderr)
  await stream

  t.resolves(
    fs.stat(path.join(cwd, 'CHANGELOG.md'))
  , 'CHANGELOG created'
  )

  const last_commit = await git.log(cwd, '-1', '--pretty=%B')
  t.match(
    last_commit
  , /release: \d{4}-\d{2}-\d{2}, Version 1.0.0/
  , 'release 1.0.0 commit generated'
  )

  const changelog = await fs.readFile(path.join(cwd, 'CHANGELOG.md'), 'utf8')

  t.test('first release commit', async (t) => {

    const first_commit = (/initial release(.*)/g).exec(changelog)
    t.ok(first_commit, 'first release commit in changelog')
    t.ok(
      (first_commit[0]).includes('/issues/1')
      // local repo wont actually have the github domain in it
      // because its not github
    , 'first release commit contains github issue link'
    )
  })

  t.test('sencond release', async (t) => {
    await fs.writeFile(path.join(cwd, 'foo.js'), '\'use strict\'')
    await git.add(cwd)
    await git.commit(
      cwd
    , `
      feat: second commit

      This is the second commit.
      It has a jira reference

      Ref: LOG-1234
      `.trim()
    )
    await git.push(cwd)

    const stream = execa('npm', [
      'run'
    , 'local-release'
    , `--repositoryUrl=${origin}`], {
      cwd: cwd
    , env: {
        BRANCH_NAME: 'main'
      , CI_BRANCH: 'main'
      , CI: 'true'
      , GIT_BRANCH: 'main'
      , CHANGE_ID: ''
      }
    })

    stream.stdout.pipe(process.stderr)
    await stream

    const result = await git.log(cwd, '-1', '--pretty=%B')
    t.match(
      result
    , /release: \d{4}-\d{2}-\d{2}, Version 1.1.0/
    , 'release 1.1.0 commit generated'
    )
    const pkg = require(path.join(cwd, 'package.json'))
    t.equal(pkg.version, '1.1.0', 'expected package version')

    const tags = await git.tags(cwd)
    t.same(tags, ['v1.0.0', 'v1.1.0'], 'expected release tags')

    t.test('second relese commit', async (t) => {
      const changelog = await fs.readFile(path.join(cwd, 'CHANGELOG.md'), 'utf8')
      const second_commit = (/second commit(.*)/g).exec(changelog)
      t.ok(second_commit, 'second release commit in changelog')
      t.ok(
        (second_commit[0]).includes('https://mezmo.atlassian.net/browse/LOG-1234')
      , 'second release commit contains JIRA link'
      )
    })
  })
}).catch(threw)
