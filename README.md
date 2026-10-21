# Mohammed — Security Lab

A dark, editorial cybersecurity portfolio with a truthful content model, purposeful GSAP/Lenis motion, and a **local-only export-based content workspace**. No remote CMS, passwords, tokens, or contact submission backend is included.

## Start

Prerequisite: Node.js 22 LTS and npm. Node 20.19+ is compatible with this pinned toolchain; this delivery was tested with Node 20.20.2.

```sh
npm ci
npm run dev
# http://localhost:5173/
# Local editor: http://localhost:5173/#/control-center/
```

For local-only networking, run `npm run dev -- --host 127.0.0.1`. The default binds only localhost. For an Arena live preview, explicitly use `npm run dev -- --host 0.0.0.0`. Do not expose Vite to untrusted networks.

```sh
npm run lint
npm test
npm run build
npm run check:production
npm run preview
```

Owner content, homepage copy/visibility, and selected recognition live in `src/content/site.json`, validated with Zod. `npm run validate` generates the sanitized `src/content/public.json`; do not edit that generated file. Restart development or run validation after updating source content. Production omits drafts and the editor implementation. **A public Git repository still exposes the source content and its history. Draft is a publication state, not a confidentiality mechanism.**

## Deliverables and guides

- [Owner guide](OWNER_GUIDE.md): setup, customization, publishing, recovery.
- [Security checklist](SECURITY_CHECKLIST.md).
- [Delivery report](DELIVERY_REPORT.md): actual tests and limitations.
- [Architecture and admin security](docs/ADMIN_SECURITY.md).
- [Third-party notices](docs/THIRD_PARTY_NOTICES.md).
- `docs/`: build, audit, browser, accessibility, and Lighthouse evidence.

## Before launch

Supply a professional email, social profiles, résumé, stable site URL, genuine project records, and any approved award evidence. Sample projects and editorial notes are clearly labeled; set `settings.showSamples` to `false` to hide them. The TechWiz 6 / SabaSec recognition is supplied information, not independently verified evidence.

GitHub Pages configuration is included in `.github/workflows/deploy.yml`. Enable **Settings → Pages → GitHub Actions**. For a project repository, the workflow derives `/repository-name/`; for a user site or custom domain, set repository Actions variable `SITE_BASE` to `/`. No deployment credentials belong in source files.

Routing deliberately uses `#/projects/...` to support refreshes on static hosting without server rewrite rules. Hash routes have search-engine/social-preview limitations; see the owner guide. This project is not deployed remotely by this delivery.

## Second review

See `PROMPT_REVIEW.md` for the prompt-to-implementation audit, fixes, and remaining owner/external-service requirements. `npm test` now generates ignored public content automatically, including on fresh Git checkouts. All files in `public/` are published; private draft assets must stay elsewhere.
