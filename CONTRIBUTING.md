# Contributing

## Process

We use a fork-and-PR process, also known as a triangular workflow. This process
is fairly common in open-source projects. Here's the basic workflow:

1. *Fork* the upstream repo to create your own repo. This repo is called the origin repo.
2. *Clone* the origin repo to create a working directory on your local machine.
3. Work your changes on a branch in your working directory, then add, commit, and push your work to your origin repo.
4. Submit your changes as a PR against the upstream repo. You can use the upstream repo UI to do this.
5. Maintainers review your changes. If they ask for changes, you work on your
   origin repo's branch and then submit another PR. Otherwise, if no changes are made,
   then the branch with your PR is merged to upstream's main branch.

## Development Workflow

### Branch Strategy

- **External contributors**: Fork the repo and create a feature branch in your fork.
- **Maintainers**: Create branches directly in the repository.

All changes are merged to `main` via **rebase merging** to maintain a linear commit history.

### Typical Workflow

1. **Create a branch** from the latest `main`:
```bash
git checkout main
git pull origin main
git checkout -b <github username>/your-branch-name
```

2. **Make your changes**, keeping commits focused and atomic.
3. **Run quality checks** before pushing:

```bash
npm run lint
npm test
```

4. **Push your branch** and open a pull request.

When you work in a triangular workflow, you have the upstream repo, the origin
repo, and then your working directory (the clone of the origin repo). You do
a `git fetch` from upstream to local, push from local to origin, and then do a PR from origin to
upstream&mdash;a triangle.

If this workflow is too much to understand to start, that's ok! You can use
GitHub's UI to make a change, which is autoset to do most of this process for
you. We just want you to be aware of how the entire process works before
proposing a change.

Thank you for your contributions; we appreciate you!

## License

Note that we use a standard [MIT](./LICENSE) license on this repo.

## Coding style

Code style is enforced by [eslint][]. Linting is applied CI builds when a pull request
is made. The rule set being enforced is provided by [eslint-config-logdna][]

## Git Commit Conventions

This project uses [Conventional Commits] and enforces them via CI. **Every commit** on `main` must follow this format because we use rebase merging to maintain a linear history.

### Format

The first line, which includes the type and description, must be entirely lowercase. The body
and optional footer can use lower and upper casing.

```
<type>(<optional scope>): <description>

[body]

[optional footer(s)]
```

### Types

| Type       | When to Use                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `doc`      | Documentation only changes                              |
| `style`    | Formatting, missing semicolons, etc. (no code change)   |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                                 |
| `test`     | Adding or updating tests                                |
| `chore`    | Build process, tooling, or dependency updates           |
| `ci`       | CI/CD configuration changes                             |

### Examples

```
* feat(config): add support for gemini provider
* fix(streaming): correct sse event ordering on disconnect
* doc: add ollama troubleshooting guide
* test(mcp): add header forwarding integration tests
* refactor(provider-agent): simplify type-erased streaming dispatch
```

### Breaking Changes

For breaking changes, add `!` after the type/scope and include a `BREAKING CHANGE` footer:

```
feat(config)!: change issue reference

BREAKING CHANGE: The [tools] config section has been renamed to [mcp.tools].
Update your config.toml files accordingly.

Fixes: #1
See: https://github.com/mezmo/release-config-core/discussions/1
```

### Important Notes

- The commit message subject should be lowercase and not end with a period.
- The commit message subject should briefly indicate the **what**.
- Keep the subject line under 72 characters.
- Use the body to explain **what** and **why**, not **how**.
- CI will reject commits that don't follow this convention.

## Questions?

The easiest way to get our attention is to comment on an existing, or open a new
[issue][].

[eslint]: https://eslint.org
[commitlint]: https://commitlint.js.org
[eslint-config-logdna]: https://github.com/logdna/eslint-config-logdna
[commitlint-config]: https://github.com/mezmo/commitlint-config
[issue]: https://github.com/mezmo/release-config-core/issues
[Conventional Commits]: https://www.conventionalcommits.org/
