# Contributing to EcoGuide AI

Thank you for your interest in contributing! This document explains how to get started.

## Getting Started

1. **Fork** the repository and clone your fork
2. **Install** dependencies: `npm install` in both `backend/` and `frontend/`
3. **Copy** `.env.example` to `.env` in both directories and fill in values
4. **Run** migrations: `cd backend && npx prisma migrate deploy`
5. **Start** dev servers: `npm run dev` in each directory

## Development Workflow

- Branch from `main` with a descriptive name: `feat/my-feature` or `fix/my-bug`
- Keep commits focused and use conventional commit messages:
  - `feat:` new feature
  - `fix:` bug fix
  - `security:` security improvement
  - `perf:` performance improvement
  - `test:` test addition or update
  - `docs:` documentation update
  - `chore:` tooling/config change

## Code Standards

- **No `var`** — use `const` / `let`
- **Strict equality** — use `===` everywhere
- **No console in production** — use `src/utils/logger.js` in frontend
- **Sanitize all inputs** — use `src/utils/sanitize.js` for numeric/text fields
- **JSDoc** — add JSDoc to all exported functions in `services/` and `utils/`
- Run `npm run lint` before opening a PR — zero warnings expected

## Testing

All new features must include tests:

```bash
cd backend && npm test
cd frontend && npm test
```

- **Backend**: add tests in `backend/src/tests/unit/`
- **Frontend utilities**: add tests in `frontend/src/tests/`
- Aim for >90% coverage on utility functions

## Pull Request Checklist

- [ ] Tests pass locally (`npm test` in both directories)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] No hardcoded secrets or API keys
- [ ] JSDoc added to new functions
- [ ] README updated if adding new env vars or features

## Reporting Issues

Please open a GitHub Issue with:
- Steps to reproduce
- Expected vs. actual behaviour
- Browser/Node.js version

## License

By contributing, you agree your contributions will be licensed under the [MIT License](./LICENSE).
