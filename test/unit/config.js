'use strict'

const {test, threw} = require('tap')
const config = require('../../index.js')
const constants = require('../../lib/constants.js')

function sortByType(a, b) {
  return a.type < b.type ? -1 : 1
}

test('release-config-logdna', async (t) => {
  const plugins = config.plugins.map((plugin) => {
    return plugin[0]
  })

  t.same(config.npmPublish, false, 'npmPublish = false by default')
  t.matchOnlyStrict(config.parserOpts, {
    noteKeywords: ['BREAKING CHANGES', 'BREAKING CHANGE', 'BREAKING-CHANGE']
  , notesPattern: Function
  , headerPattern: constants.COMMIT_HEADER_REGEX
  , breakingHeaderPattern: constants.BREAKING_HEADER_REGEX
  , headerCorrespondence: ['type', 'scope', 'subject']
  , issuePrefixes: [
      '#'
    , 'gh-'
    , 'LOG-'
    , 'PROD-'
    , 'SCT-'
    , 'VM-'
    , 'INFRA-'
    , 'COM-'
    ]
  , changelogTitle: '## Changelog'
  , referenceActions: [
      'close', 'closes', 'closed', 'fix'
    , 'fixes', 'fixed', 'resolve', 'resolves'
    , 'resolved', 'ref', 'Ref'
    ]
  }, 'default commit parser options')

  t.same(config.releaseRules.sort(sortByType), [
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
  ].sort(sortByType), 'expected default release rules')

  t.same(plugins, [
    '@semantic-release/commit-analyzer'
  , '@semantic-release/release-notes-generator'
  , '@semantic-release/changelog'
  , '@semantic-release/npm'
  , '@semantic-release/exec'
  , '@semantic-release/git'
  , '@semantic-release/github'
  ], 'expected default plugins')

  const [name, plugin_config] = config.plugins.find((plugin) => {
    return plugin[0] === '@semantic-release/git'
  })

  t.same(name, '@semantic-release/git', 'git plugin found')
  t.type(plugin_config.assets, Array, 'git pluging assets')

  t.ok(plugin_config.assets.includes('package*.json'), 'git includes npm manifests')
  t.ok(plugin_config.assets.includes('*.md'), 'git includes markdown files')
  t.ok(plugin_config.assets.includes('Cargo.*'), 'git includes root Cargo manifests')
  t.ok(plugin_config.assets.includes('crates/*/Cargo.*'), 'git includes Cargo manifests')
  t.ok(plugin_config.assets.includes('!**/target/**'), 'git ignores target dirs')
  t.ok(plugin_config.assets.includes('!**/.rustup/**'), 'git ignores .rustup dirs')
  t.ok(
    plugin_config.assets.includes('!**/node_modules/**')
  , 'git ignores node_modules dir'
  )
}).catch(threw)
