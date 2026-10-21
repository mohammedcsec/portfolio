# SECURITY CHECKLIST

Use before launch and each release. Check items only after verifying them. This is a local-editing/static-hosting architecture; server authentication/session items are deliberately not claimed as implemented.

## Secrets and public repository hygiene

- [ ] Search the working tree and Git history for tokens, private keys, credentials, real `.env` files, client information, and private findings. Use your organization's approved secret scanner; the delivery's pattern scan is not a substitute for full history scanning.
- [ ] Inspect `git diff --cached`, untracked files, images, PDFs, screenshots, archives, and metadata before pushing.
- [ ] Keep `.env` files ignored; never put secrets in `VITE_` variables, content JSON, URLs, browser code, or logs.
- [ ] Do not publish the project ZIP, documentation evidence logs, or owner backups as website assets. Pages must receive only `dist/`.
- [ ] Keep private/draft-only assets outside `public/`: every file there is published regardless of content status.
- [ ] Treat source drafts as public if the repository or archive is public. Draft exclusion protects the production bundle, not Git history.
- [ ] Verify generated public content and built JS contain no draft IDs or local editor implementation: `npm run build && npm run check:production`.

## Authentication and admin access

- [ ] Keep the editor on a trusted local machine. Use `npm run dev -- --host 127.0.0.1` for a private bind.
- [ ] Confirm production control center has no editor or privileged API operations.
- [ ] Do not replace the architecture with a React password prompt, storage flag, hidden route, or frontend GitHub token.
- [ ] Protect the operating-system account, browser downloads, Git credential manager, and local content backups.
- [ ] Enable MFA/passkeys for GitHub; review repository collaborators and branch protection where available.
- [ ] For a future remote editor, use supported server authentication and rate limits; test unauthorized and expired sessions before launch. **Not applicable to the current no-backend utility.**

## Authorization and sessions

- [ ] Review workflow permissions: build reads contents; deployment writes Pages and uses OIDC. Do not grant repository write access unnecessarily.
- [ ] Restrict production deployment approvals and maintainers as appropriate.
- [ ] Confirm no browser operation can write to the repository or live site.
- [ ] If adding a backend: enforce authorization for every mutation and read of protected drafts; reject untrusted resource IDs.
- [ ] If adding cookie sessions: configure Secure/HttpOnly/SameSite, expiration, revocation/logout, and CSRF controls where needed. Current site sets no application session cookies.
- [ ] Do not claim authentication/authorization tests have passed when no authentication service exists.

## Content and input validation

- [ ] Run `npm run validate`, `npm test`, and `npm run build` before publishing.
- [ ] Keep raw HTML rendering and dynamic code execution disabled. Markdown is rendered by React without `dangerouslySetInnerHTML`.
- [ ] Review external URLs, image origins, publication dates, duplicate IDs, and broken links.
- [ ] Check all scope/authorization statements and redact real targets, credentials, and personal data.
- [ ] Confirm written permission and disclosure policy before publishing security findings.
- [ ] Verify every award, certification, employer, testimonial, result, and statistic; remove unsupported claims.
- [ ] Replace or hide sample records. Keep the TechWiz Special Jury Mention distinct from a ranking/medal.
- [ ] Provide image alt text/captions, remove image/PDF metadata as appropriate, and confirm publication rights.
- [ ] Review the entire exported JSON before replacing source; export is data, not an authenticated publish action.

## Dependencies and release quality

- [ ] Install with `npm ci`; review both package and lockfile changes.
- [ ] Run `npm audit`; triage all vulnerabilities, including developer tooling exposed on networks.
- [ ] Recheck dependency licenses when upgrading GSAP, React Bits adaptations, UI sources, icons, and fonts.
- [ ] Run lint, TypeScript/build, unit tests, browser navigation/filter checks, reduced-motion, and accessibility checks.
- [ ] Test narrow mobile, keyboard navigation, zoom, and a screen reader; zero automated findings is not a conformance guarantee.
- [ ] Re-measure Lighthouse after content/image changes; do not copy historical scores as new measurements.

## Production hosting

- [ ] Verify `SITE_BASE` matches hosting and all assets load from that prefix.
- [ ] Confirm direct refresh works on shared hash URLs and unknown routes show the branded 404.
- [ ] Set the real HTTPS `seo.siteUrl`, verify generated canonical/OG tags, and check `robots.txt` and sitemap.
- [ ] Confirm no placeholder CNAME, fake contact details, or nonexistent résumé links are published.
- [ ] Enable HTTPS; verify domain ownership and remove dangling DNS records when retiring a domain.
- [ ] Publish only the static build. Never expose Vite development or local editor instances as production services.
- [ ] If required, use hosting that supports your chosen security headers; GitHub Pages does not let this app set server headers.

## Backup and recovery

- [ ] Export work before reloading; keep encrypted backups of source content and assets.
- [ ] Test restoring a known-good snapshot, validating, building, and redeploying.
- [ ] Record who can deploy/recover and secure access to those accounts.
- [ ] Keep private engagement material outside this project and public repository history.

## Incident response

- [ ] Stop publication and preserve a minimal, access-controlled incident timeline.
- [ ] If a secret leaks, revoke/rotate it immediately; deletion alone is insufficient.
- [ ] Revert/redact the offending content, rebuild, redeploy, and verify the actual public artifact.
- [ ] Assess Git history, Actions logs/artifacts, caches, mirrors, forks, and downloadable copies.
- [ ] Notify affected parties through an appropriate private channel and follow disclosure obligations.
- [ ] Review account access, audit logs available from your provider, and deployment permissions.
- [ ] Document the root cause, corrective action, and a tested prevention check without exposing further sensitive data.
