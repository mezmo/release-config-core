'use strict'

const GITHUB_PREFIXES = [
  '#'
, 'gh-'
]
const JIRA_PREFIXES = [
  'LOG-'
, 'PROD-'
, 'SCT-'
, 'VM-'
, 'INFRA-'
, 'COM-'
]

module.exports = {
  BREAKING_HEADER_REGEX: /^(\w*)(?:\((.*)\))?!: (.*)$/
, COMMIT_HEADER_REGEX: /^(\w*)(?:\((.*)\))?!?: (.*)$/
, GITHUB_PREFIXES: GITHUB_PREFIXES
, JIRA_PREFIXES: JIRA_PREFIXES
, ISSUE_PREFIXES: [
    ...GITHUB_PREFIXES
  , ...JIRA_PREFIXES
  ]
}
