'use strict'

const JIRA_URL = 'https://mezmo.atlassian.net/browse'
const {JIRA_PREFIXES} = require('./constants.js')
const COMMIT_TYPES = new Map([
  ['build', 'Build System']
, ['chore', 'Chores']
, ['ci', 'Continuous Integration']
, ['default', 'Miscellaneous']
, ['doc', 'Documentation']
, ['docs', 'Documentation']
, ['feat', 'Features']
, ['fix', 'Bug Fixes']
, ['lib', 'Logic']
, ['perf', 'Performance Improvements']
, ['pkg', 'Package']
, ['refactor', 'Code Refactoring']
, ['revert', 'Reverts']
, ['src', 'Logic']
, ['style', 'Style']
, ['svc', 'Service']
, ['test', 'Tests']
])

const ISSUE_PATTERN = JIRA_PREFIXES.join('|')
const JIRA_ISSUE_REGEX = new RegExp(
  `^(${ISSUE_PATTERN})`
)
module.exports = {
  typeOf
, transform
}

function typeOf(type) {
  return COMMIT_TYPES.get(type) || COMMIT_TYPES.get('default')
}

function transform(commit) {
  const output = {
    ...commit
  , type: typeOf(commit.type)
  , shortHash: commit.hash.substring(0, 7)
  }

  output.references = output.references?.map?.((ref) => {
    // generate the issues URL based on the reference type
    if (JIRA_ISSUE_REGEX.test(ref.prefix)) {
      return {
        ...ref
      , issuesUrl: [JIRA_URL, `${ref.prefix}${ref.issue}`].join('/')
      }
    }
    return {
      ...ref
      /* c8 ignore next */
    , prefix: ref.prefix.match(/^gh-/i) ? '#' : ref.prefix
    }
  })

  output.notes = commit.notes?.map?.((note) => {
    return {...note, title: '**BREAKING CHANGES**'}
  })

  return output
}
