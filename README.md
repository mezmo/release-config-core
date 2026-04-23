## @mezmoinc/release-config-core

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Semantic Release shareable configuration for mezmo projects

Baseline shareable semantic-release configuration for mezmo node packages.
This configuration pre-configures the commits parser and release notes.


The shareable configuration can be configured in package.json, or the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

### Installation

```shell
$ npm install --save-dev @mezmoinc/release-config-core
```

```json5
// package.json
{
  "scripts": {
    "release": "npx semantic-release"
  },
  "release": {
    "branches": ["main"],
    "extends": "@mezmoinc/release-config-core"
  }
}
```


> [!WARNING] NPM Publish
> This configuration does not publish npm packages by default

If npm package publishing is desired, it should be enabled in your local config.

```json5
// package.json

{
  "relase": {
    "branches": ["main"],
    "npmPublish": true,
    "extends": "@mezmoinc/release-config-core"
  }
}
```

## Features

* Parse un-merged commits to determine next release version
  * The version number is dictated by the commit with the highest semver level
* Increments the version of `package.json`
* Generates + updates Changelog
  * Includes github issue links for defined issue Keys (`close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved`, `ref`)
  * Includes links to commit sha
  * Organizes changes by type
* Commits standardized `release` commit back upstream
* Attaches any build artifacts placed in `./dist` to the release

### Commit Types

| Commit Type | Changelog Category       |
|-------------|--------------------------|
| `build`     | Build System             |
| `chore`     | Chores                   |
| `ci`        | Continuous Integration   |
| `doc`       | Documentation            |
| `feat`      | Features                 |
| `fix`       | Bug Fixes                |
| `lib`       | Logic                    |
| `lint`      | Lint                     |
| `perf`      | Performance Improvements |
| `pkg`       | Package                  |
| `refactor`  | Code Refactoring         |
| `revert`    | Reverts                  |
| `src`       | Logic                    |
| `style`     | Style                    |
| `test`      | Tests                    |
| `<default>` | Miscellaneous            |

## Authors

* [**Mezmo Inc.**](mailto:support@mezmo.com) &lt;support@mezmo.com&gt;

