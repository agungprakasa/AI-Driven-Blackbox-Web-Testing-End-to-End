# AI-Driven API & Web Testing Template

Reusable testing framework: AI-assisted blackbox testing for REST APIs and web apps, with screenshot evidence and automatic DOCX/Excel reporting.

## Stack

- Playwright (APIRequestContext + Chromium)
- Node.js + Python (report generation: python-docx, openpyxl)
- AI agent instructions (AGENTS-style workflow)

## What it does

1. Parse `curl` commands → auto-generate test specs
2. Run test suites: functional (positive/negative), boundary value, security, performance, E2E
3. Capture real screenshot evidence for every result
4. Generate client-ready reports (DOCX + Excel) with evidence references
5. Validate report completeness

## Quick start

```bash
npm install
cp config/api-config.example.env config/api-config.env   # set your target
npx playwright test tests/api/ --reporter=list
node scripts/run-screenshots.js
python scripts/generate-docx.py
python scripts/generate-excel.py
python scripts/validate-report.py
```

## Configuration

All targets and credentials live in `config/api-config.env` (git-ignored):

```
API_BASE_URL=https://api.example.com/v1
AUTH_TYPE=none
```

Never hardcode credentials or internal URLs in test files.

## Repository layout

```
config/     # environment config (example file tracked, real config ignored)
tests/api/  # functional/ boundary/ negative/ security/ e2e/ suites
scripts/    # screenshot capture, report generators, validators
evidence/   # screenshot + JSON evidence (generated, git-ignored)
reports/    # DOCX/Excel/JSON reports (generated, git-ignored)
```

## For clients

This framework is the tooling behind a productized testing service:
API testing, regression suites, and evidence-based QA reports delivered in days.

## License

For portfolio demonstration. Contact the author for commercial use.
