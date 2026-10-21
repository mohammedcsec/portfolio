# Setup

Use Node 22 LTS and npm, then `npm ci`. Run `npm run dev` for the site and development-only `#/control-center/`. For a private bind, use `npm run dev -- --host 127.0.0.1`. The default host is localhost; Arena previews explicitly use `npm run dev -- --host 0.0.0.0`.

Checks: `npm run validate`, `npm run lint`, `npm test`, `npm run build`, `npm run check:production`. Build output is `dist/`; `npm run preview` serves it. No secrets or `.env` are needed.

See `../OWNER_GUIDE.md` for full installation, editor workflow, and browser-test harness details.
