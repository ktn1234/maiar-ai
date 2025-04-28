# Contributing to This Project

First off, thanks for considering contributing! Your help makes this project better for everyone. We welcome contributions from everyone, regardless of experience level.

## How to Contribute

1. **Fork the Repo** – Click the Fork button on GitHub.
2. **Clone Your Fork** – `git clone https://github.com/<your-username>/maiar-ai.git`
3. **Create a Branch** – `git checkout -b feature-or-bugfix-name`
4. **Make Changes** – Ensure your code follows the project's style guide and guidlines below.
5. **Commit Your Changes using Conventional Commits** – `git commit -m "type(scope): Brief but descriptive commit message"`
6. **Push to Your Fork** – `git push origin feature-or-bugfix-name`
7. **Open a Pull Request** – Go to the original repo and create a PR.

## Guidelines

- Keep PRs focused. One feature or fix per PR.
- Write clear commit messages using Conventional Commits.
- Follow existing code style, conventions, and commit history policy.
- Update documentation if needed.

## Style Guide

### Git Commit Messages

- Use lowercase for conventional commits types/scopes
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Body explains "what" and "why," not "how" (if needed)
- Footer for breaking changes, issues, etc

### JavaScript Styleguide

- All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

### TypeScript Styleguide

- All TypeScript must adhere to [TypeScript Standard Style](https://github.com/standard/ts-standard).

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown/) for documentation.

## Commit History Policy

To keep the commit history clean and linear, we **squash and merge** all PRs — merge commits are not allowed. When contributing:

- Rebase your branch onto the latest `main` (or relevant base branch) before submitting a PR.
- The PR title must follow the **conventional commit** format and capture the essence of all changes made in the squashed commits.
- Avoid merging upstream changes into your branch; always rebase interactively if your branch falls behind.
- If you're working from a fork, ensure your PR is rebased properly before submission.

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. This allows us to automatically generate a changelog, handle package versioning, and enforce a standard commit message format.

The full specification can be found at [https://conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/#specification)

### Conventional Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

For example: `feat(core): add new feature`

Based on the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, the following types are available:

- **feat**: a new feature
- **fix**: a bug fix
- **docs**: documentation only changes
- **style**: changes that do not affect meaning (whitespace, formatting, etc)
- **refactor**: code change that neither fixes a bug nor adds a feature
- **perf**: a code change that improves performance
- **test**: adding or correcting tests
- **build**: changes that affect the build system or dependencies
- **ci**: changes to ci config files and scripts
- **chore**: other changes that don't modify src or test files
- **revert**: revert a previous commit

Common scopes for this project can be for main components and include:

- **core**: changes in the core package
- **model**: changes in any model provider package
- **memory**: changes in the memory provider package
- **plugin**: changes in any plugin package
- **client**: changes in the client app
- **starter**: changes in the starter app
- **website**: changes in the website
- **config**: changes for any configuration

This is not an exhaustive list, and additional scopes can be added in [.commitlintrc.ts](https://github.com/UraniumCorporation/maiar-ai/blob/main/.commitlintrc.ts) as needed.

For multiple scopes, use a comma-separated list i.e. `fix(bug,plugin-time): fix bug in time plugin`

### Enforcing Conventional Commits

Conventional commits will be enforced using [commitlint](https://commitlint.js.org/). This will be run as part of the CI pipeline and pre-commit hooks (via Husky) and will fail the CI workflow if the commit message does not follow the Conventional Commits format.

- [commitizen](https://commitizen.github.io/cz-cli/) is recommended for creating conventional commits. This is a command-line tool that guides the user through creating a commit message that follows the Conventional Commits format. To use Commitizen, run `pnpm commit` at the root of the project and interactively create a commit message.

### Pull Requests

- The PR title must follow the **conventional commit** specification format and capture the essence of all commits made in the PR.
- **How to do it**: When creating a PR, ensure the title is prefixed with the appropriate type and scope. For example, `feat(core): add new feature` or `fix(model): fix issue with model provider`, `docs(website): update documentation for website`, etc.
- **Breaking Changes**: If your PR introduces breaking changes, append an exclamation mark `!` after the type/scope in the title. For example, `feat(core)!: introduce breaking change in core package from a feature`, `fix(model)!: fix issue with model provider that introduces breaking change`, `refactor(model)!: refactor model provider that introduces breaking change`, etc.
  - Ensure to document the breaking changes in the PR description and provide migration instructions if applicable.
  - In the commit that introduces the breaking change, include a footer with `BREAKING CHANGE: <description>` to explain the breaking change and its impact.
    - This will be automatically detected and included in the changelog to be in the release notes for the next version with your breaking change. It will allow us to communicate breaking changes effectively to users.
- **Why this matters**: Our change management relies on proper use of conventional commits to ensure version bumps, release automation, and consistent changelog generation.

## Reporting Issues

- Search existing issues before opening a new one.
- If reporting a bug, include steps to reproduce.
- If suggesting a feature, explain the use case and potential benefits.

## Bounty Program

To participate, please refer to the [Bounty Program Docs](https://maiar.dev/docs/bounty-program) for comprehensive details on how to earn bounties by contributing to the MAIAR project.

## Code of Conduct

Be respectful, constructive, and inclusive. Follow the [Code of Conduct](https://github.com/UraniumCorporation/maiar-ai/blob/main/.github/CODE_OF_CONDUCT.md).

## Need Help?

- Join [Discord](https://discord.gg/7CAjkpCsED)
- Create [GitHub issues](https://github.com/UraniumCorporation/maiar-ai/issues)

Talk to us in discussions or open an issue. Happy coding!
