# Contributing to Astro Theme Reay

Thank you for helping improve the theme. Contributions should preserve its static-first, configuration-driven, feature-first architecture and privacy-safe template defaults.

## Before opening an issue

- Search existing issues and documentation.
- Use a minimal reproduction when reporting a bug.
- Include Node/npm versions, the command that failed, expected behavior, and sanitized logs.
- Never include tokens, cookies, private endpoints, or personal information.

## Local setup

```bash
git clone https://github.com/yourusername/Astro-Theme-Reay.git
cd Astro-Theme-Reay
npm ci
npx playwright install chromium
npm run dev
```

Use Node.js `>=22.12.0`. The `.nvmrc` selects Node 22.

## Branches and commits

Create a focused branch:

```bash
git switch -c feat/short-description
```

Use Conventional Commits:

```text
feat(scope): add a user-facing capability
fix(scope): correct observable behavior
refactor(scope): improve structure without changing behavior
docs(scope): update documentation
test(scope): add or refine verification
chore(scope): maintain tooling or dependencies
```

Keep unrelated changes in separate commits. Do not commit generated output, caches, local environment files, test reports, or personal theme choices.

## Architecture rules

- Keep `src/pages` thin: route params, static paths, domain queries, and composition only.
- Put domain-owned components, logic, client behavior, and styles in `src/features/<domain>`.
- Promote code to `src/shared` only after real cross-domain reuse exists.
- Keep MD3 tokens and stable visual foundations in `src/design-system`.
- Put user-editable values in `src/app/config`; application code should prefer `site.config.ts` getters.
- Do not duplicate identity, contact, GitHub, or site-description fields across pages/config files.
- Browser listeners, timers, observers, and animation frames need idempotent initialization and disposal across Astro page swaps.
- Preserve `draft` / `published` production visibility and use existing URL helpers for Blog/Plog routes.

See [Project Structure](./docs/PROJECT-STRUCTURE.md) for the ownership map.

## Code style

- Use TypeScript for new logic and avoid `any` unless an external boundary makes it unavoidable and documented.
- Use `import type` for type-only imports and semantic aliases (`@app`, `@design`, `@features`, `@shared`).
- Prefer small, explicit functions and domain types over loosely shaped objects.
- Use design tokens instead of hard-coded component colors.
- Preserve semantic HTML, keyboard access, focus visibility, reduced-motion behavior, and responsive layouts.
- Comments should explain constraints or reasoning, not restate the code.

ESLint is the executable style contract:

```bash
npm run lint
npm run check
```

## Tests

Run the smallest relevant checks while developing, then the full gate before submitting:

```bash
npm run verify
npm run audit
```

`verify` runs lint, Astro diagnostics, configuration contracts, a full Pagefind build, route/performance/security checks, and Playwright/Axe E2E.

Additional expectations:

- UI changes: test light/dark, desktop/mobile, keyboard interaction, and reduced motion where relevant.
- Content/schema changes: test draft/published behavior and generated routes.
- Dependency changes: commit `package-lock.json` and report `npm run audit` results.
- Deployment changes: keep Node 22, `SITE`, `BASE=/`, and root-path-only behavior consistent across docs and workflows.

## Documentation

Update the nearest public guide when user behavior or configuration changes. Update `llmdoc/` when architecture, ownership, workflows, invariants, or known gaps change. Avoid documenting volatile counts or unverified provider behavior as stable facts.

## Pull requests

A useful PR description contains:

1. What changed and why.
2. User-visible or architectural impact.
3. Verification commands and results.
4. Screenshots for visual changes.
5. Known limitations or follow-up work.

Keep the PR focused and review your own diff before requesting review. A passing automated suite does not replace checking external integrations, visual quality, or privacy boundaries affected by the change.

## License

By contributing, you agree that your contribution is licensed under the repository's [Apache License 2.0](./LICENSE).
