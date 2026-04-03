# claude-playwright-firststeps

Playwright + TypeScript test automation framework targeting [the-internet.herokuapp.com](https://the-internet.herokuapp.com).

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.59 | Browser automation |
| TypeScript | ^6.0 | Language |
| ESLint + Prettier | latest | Linting and formatting |
| BrowserStack Automate | — | Cloud cross-browser execution |

## Project structure

```
├── config/           # Typed environment config (dev / stage / prod)
├── fixtures/         # Playwright fixture definitions (DI container)
├── pages/            # Page Object Model classes
├── test-data/        # Static test data (users, etc.)
├── tests/            # Test specs
├── utils/            # Shared utilities (ApiClient, etc.)
├── browserstack.yml  # BrowserStack capabilities config
└── playwright.config.ts
```

## Setup

```bash
npm install
npx playwright install chromium --with-deps
```

## Environment configuration

The active environment is controlled by the `ENV` variable. Defaults to `stage`.

| Value | Base URL |
|-------|----------|
| `stage` (default) | `https://the-internet.herokuapp.com` |
| `prod` | `https://the-internet.herokuapp.com` |
| `dev` | `http://localhost:3000` |

```bash
ENV=prod npm test
```

## Running tests locally

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (Chromium, 2 workers) |
| `npm run test:smoke` | Run tests tagged `@smoke` |
| `npm run test:regression` | Run tests tagged `@regression` |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run in Playwright debug mode |
| `npm run report` | Open last HTML report |

### Tag filtering

Tests are tagged at both suite and individual test level. Tags can be combined:

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@drag-and-drop"
```

## Running on BrowserStack

Set credentials as environment variables (see `.env` for local use):

```bash
# PowerShell
$env:BROWSERSTACK_USERNAME="your_username"
$env:BROWSERSTACK_ACCESS_KEY="your_access_key"
npm run test:bs

# Smoke only
npm run test:bs:smoke
```

Credentials are available in your [BrowserStack Automate dashboard](https://automate.browserstack.com).

### BrowserStack capabilities (`browserstack.yml`)

| Browser | OS |
|---------|----|
| Chrome latest | macOS Sequoia |
| Edge latest | Windows 11 |

## CI/CD (GitHub Actions)

Two jobs run on every push to `master`:

| Job | Runner | Browsers |
|-----|--------|---------|
| `test` | GitHub-hosted Ubuntu | Chromium |
| `browserstack` | GitHub-hosted Ubuntu → BS cloud | Chrome/macOS, Edge/Win11 |

Pull requests run the `test` job only (BrowserStack minutes are preserved for merged code).

### Manual trigger with tag filter

Go to **Actions → Playwright Tests → Run workflow** and set the `tags` input (e.g. `@smoke`).

### Required repository secrets

| Secret | Where to find it |
|--------|-----------------|
| `BROWSERSTACK_USERNAME` | BrowserStack → Automate → Settings |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack → Automate → Settings |

Set at: `Settings → Secrets and variables → Actions → New repository secret`

## Code quality

```bash
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check (used in CI)
```
