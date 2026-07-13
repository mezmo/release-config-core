'use strict'

const constants = require('./lib/constants.js')
const commit = require('./lib/commit.js')
const template = require('./lib/template/index.js')

const now = new Date()
const year = now.getFullYear()
const day = String(now.getDate()).padStart(2, '0')
const month = String(now.getMonth() + 1).padStart(2, '0')

module.exports = {
  npmPublish: false
, parserOpts: {
    noteKeywords: ['BREAKING CHANGES', 'BREAKING CHANGE', 'BREAKING-CHANGE']
  , notesPattern: (keywords) => {
      return new RegExp(`(?:^|\\r?\\n)[\\s|*]*(${keywords}):[ \\t]+(.*)`)
    }
  , headerPattern: constants.COMMIT_HEADER_REGEX
  , breakingHeaderPattern: constants.BREAKING_HEADER_REGEX
  , headerCorrespondence: ['type', 'scope', 'subject']
  , issuePrefixes: constants.ISSUE_PREFIXES
  , changelogTitle: '## Changelog'
  , referenceActions: [
      // Common Github trailers
      'close'
    , 'closes'
    , 'closed'
    , 'fix'
    , 'fixes'
    , 'fixed'
    , 'resolve'
    , 'resolves'
    , 'resolved'

      // mezmo internal trailers
    , 'ref'
    , 'Ref'
    ]
  }
, writerOpts: {
    transform: commit.transform
  , commitPartial: template.commit
  }
, plugins: [
    ['@semantic-release/commit-analyzer', {}]
  , ['@semantic-release/release-notes-generator', {}]
  , ['@semantic-release/changelog', {
      changelogTitle: '## Changelog'
    }]
  , ['@semantic-release/npm', {}]
  , ['@semantic-release/exec', {}]
  , ['@semantic-release/git', {
      assets: [
        'package*.json'
      , '*.md'
      , 'Cargo.*'
      , 'crates/*/Cargo.*'
      , '!**/node_modules/**'
      , '!**/target/**'
      , '!**/.rustup/**'
      ]
    , message: `release: ${year}-${month}-${day}, `
        + 'Version <%= nextRelease.version %> [skip ci]'
    }]
  , ['@semantic-release/github', {}]
  ]
, releaseRules: [
    {breaking: true, release: 'major'}
  , {revert: true, release: 'patch'}
  , {type: 'ci', release: false}
  , {scope: 'ci', release: false}
  , {scope: 'setup', release: false}
  , {type: 'chore', scope: 'dep-dev', release: false}
  , {type: 'chore', scope: 'deps-dev', release: false}
  , {type: 'build', release: 'patch'}
  , {type: 'chore', release: 'patch'}
  , {type: 'feat', release: 'minor'}
  , {type: 'refactor', release: 'patch'}
  , {type: 'release', release: false}
  , {type: 'test', release: 'patch'}
  , {type: 'doc', release: false}
  , {type: 'docs', release: false}
  , {type: 'fix', release: 'patch'}
  , {type: 'lib', release: 'patch'}
  , {type: 'src', release: 'patch'}
  , {type: 'perf', release: 'minor'}
  , {type: 'style', release: false}
  ]
}
