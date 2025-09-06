# Contributing to {{project-name}}

Thank you for contributing! Please follow these guidelines to keep code quality high and reviews smooth.

---

## Branching strategy
- `main` — protected branch, always deployable.
- `feature/<short-desc>` — new features.
- `bugfix/<ticket-id>-short-desc` — bug fixes.
- `hotfix/<short-desc>` — urgent patches.

---

## Commit messages
We use [Conventional Commits](https://www.conventionalcommits.org/).  
Format:

```<type>(scope?): subject``` 

### Types
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance (build, tooling, configs)
- `docs` — documentation only
- `style` — formatting, no code changes
- `refactor` — code change that is not a bug fix or feature
- `perf` — performance improvement
- `test` — add or update tests

### Examples
- `feat(auth): add OAuth login`
- `fix(api): handle null pointer`

---

## Pull Requests
Before submitting a PR, ensure:
- [ ] Linked to an issue (if applicable).
- [ ] Tests added/updated.
- [ ] Linting passes locally.
- [ ] CI pipeline is green.
- [ ] Reviewer assigned (CODEOWNERS will auto-request where possible).

👉 Keep PRs small and focused. Large PRs should be broken into smaller logical steps.

---

## Code style
- Follow the style guide for this project’s language/stack (see README).
- Run formatters/linters before committing.
- Do not commit secrets or credentials.

---

## Getting help
If you are unsure about any contribution, please open a draft PR or start a discussion before large changes.
