'use strict'

const {test, threw} = require('tap')
const config = require('../../index.js')

test('commit parser', async (t) => {
  const {CommitParser} = await import('conventional-commits-parser')
  const parser = new CommitParser(config.parserOpts)

  t.test('does not parse lowercase jira-like words as references', async (t) => {
    const {references} = parser.parse('feat: guard the log-timeout retry path')
    t.same(references, [], 'lowercase "log-" prefix is not a reference')
  })

  t.test('parses uppercase jira keys', async (t) => {
    const {references} = parser.parse('fix: wire region\n\nRef: LOG-1234')
    const jira = references.find((ref) => {
      return ref.prefix === 'LOG-'
    })
    t.ok(jira, 'LOG- reference parsed')
    t.equal(jira.issue, '1234', 'issue number captured')
  })

  t.test('parses github issue references', async (t) => {
    const {references} = parser.parse('fix: a thing (#42)')
    const github = references.find((ref) => {
      return ref.prefix === '#'
    })
    t.ok(github, '# reference parsed')
    t.equal(github.issue, '42', 'issue number captured')
  })
}).catch(threw)
