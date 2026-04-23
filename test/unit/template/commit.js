'use strict'

const Handlebars = require('handlebars')
const {test, threw} = require('tap')
const templates = require('../../../lib/template/index.js')
const {transform} = require('../../../lib/commit.js')

test('CommitTemplate', async (t) => {
  t.test('github issue reference', async (t) => {
    const tpl = Handlebars.compile(templates.commit)
    const context = transform({
      commit: 'commit'
    , committer: {
        name: 'Eric Satterwhite'
      , email: 'esatterwhite@wi.rr.com'
      , date: '2020-12-31T18:44:33.000Z'
      }
    , hash: 'c644dd5aa62fa579bef2d793b6bc9d711f308a9b'
    , subject: 'this is a thing'
    , host: 'https://github.com'
    , repository: 'foobar'
    , issue: 'issues'
    , owner: 'whizbangs'
    , type: 'Features'
    , scope: 'package'
    , linkReferences: true
    , references: [{
        issue: '1000'
      , prefix: '#'
      }]
    , mentions: []
    , revert: null
    , shortHash: 'c644dd5'
    })

    const COMMIT_URL = `[${context.shortHash}](https://github.com/whizbangs/foobar/`
      + `${context.commit}/${context.hash})`

    const COMMITTER = context.committer.name
    const ISSUE = '[#1000](https://github.com/whizbangs/foobar/issues/1000)'

    const PREAMBLE = '* **package**: this is a thing'
    const expected = `${PREAMBLE} ${COMMIT_URL} - ${COMMITTER} ${ISSUE}`
    const actual = tpl(context)
    t.match(
      actual.trim()
    , expected.trim()
    , 'expected commit output'
    )
  })

  t.test('JIRA reference', async (t) => {
    const tpl = Handlebars.compile(templates.commit)
    const context = transform({
      commit: 'commit'
    , committer: {
        name: 'Eric Satterwhite'
      , email: 'esatterwhite@wi.rr.com'
      , date: '2020-12-31T18:44:33.000Z'
      }
    , hash: 'c644dd5aa62fa579bef2d793b6bc9d711f308a9b'
    , subject: 'this is a thing'
    , host: 'https://github.com'
    , repository: 'foobar'
    , issue: 'issues'
    , owner: 'whizbangs'
    , type: 'Features'
    , scope: 'package'
    , linkReferences: true
    , notes: [{note: 'this is breaking'}]
    , references: [{
        issue: '1234'
      , prefix: 'LOG-'
      }]
    , mentions: []
    , revert: null
    , shortHash: 'c644dd5'
    })

    const COMMIT_URL = `[${context.shortHash}](https://github.com/whizbangs/foobar/`
      + `${context.commit}/${context.hash})`

    const COMMITTER = context.committer.name
    const ISSUE = '[LOG-1234](https://mezmo.atlassian.net/browse/LOG-1234)'

    const PREAMBLE = '* **package**: this is a thing'
    const expected = `${PREAMBLE} ${COMMIT_URL} - ${COMMITTER} ${ISSUE}`
    const actual = tpl(context)
    t.match(
      actual.trim()
    , expected.trim()
    , 'expected commit output'
    )
  })
}).catch(threw)
