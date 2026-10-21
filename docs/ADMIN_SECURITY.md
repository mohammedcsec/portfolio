# Architecture decision: local content workspace

## Decision

Public site: static React/Vite on GitHub Pages. Content: local validated JSON. Administration: development-only browser workspace at `#/control-center/` that exports JSON. No backend or managed authentication provider was available/configured, and no fake authentication is provided.

The source editor is dynamically imported only when `import.meta.env.DEV` is true. Vite eliminates that branch in production. The published route contains only an explanatory message. `scripts/verify-build.mjs` verifies the absence of editor implementation text and draft IDs from built JS. The app imports generated publication-filtered content, not owner source JSON. Draft examples contain no private information.

## Trust boundaries

1. Owner's OS/browser and filesystem: trusted local editing environment. No repository credentials enter the app.
2. Source content: trusted but validated input; still not a place for secrets. JSON export is a download, not a server write.
3. GitHub repository: real permissions/MFA govern commits; public repositories expose drafts and history.
4. GitHub Actions/Pages: short-lived deployment identity uploads only `dist/`. Build cannot prove the owner's factual claims or publication permission.
5. Visitors: read-only static assets; no privileged mutation endpoints, cookies, database, or mail submission.

## Threats and controls

- Frontend credential theft: no credentials or tokens exist in the implementation.
- Source/draft exposure: no drafts in production bundles, no source maps by default; public Git history remains public. Do not store confidential drafts.
- XSS: React text rendering and Markdown without raw HTML; no eval or dynamic code execution. Structured URL validation. Owner review of external content remains necessary.
- Accidental publication: draft/sample states, explicit export, source review, validation, build, commit, and deployment; UI save alone cannot publish.
- Destructive edits: native browser confirmation for deletion/cancel. No custom modal/focus trap required. Unsaved record/settings changes require discard confirmation; a native unload guard warns about unexported work. This is not persistence or a session security mechanism. Local backups and Git history provide recovery.
- Lost edits: no persistence by design; interface warns to export. No browser storage is used as authentication or as a content vault.
- Development service exposure: default host is `127.0.0.1`. Arena explicitly passes `--host 0.0.0.0`; source-host allowlists permit its `.e2b.app` proxy domain. Development server is not hardened production infrastructure.

## Not implemented

Remote login, session cookies, session expiry/revocation/logout, CSRF middleware, authentication rate limits, backend validation, audit trail, concurrent editing, protected remote drafts, file upload service, repository API writes, or database. Unauthorized and expired-session tests are not applicable. A URL is never described as access control.

## Future remote architecture

Host the admin/auth endpoints separately on a trusted service. Use supported auth with MFA where possible, backend authorization for every operation, strict schemas, authenticated persistence, rate limits, secure sessions and CSRF defenses where relevant, logs with no secrets, and tested revoke/logout behavior. If publishing through GitHub, use a least-privilege GitHub App on the server. Never deliver a PAT or App private key to the browser. This is future work and is not enabled by this delivery.

Review hardening: complete URL parsing forbids embedded credentials and malformed links; evidence images require alternative text; calendar dates are checked; visible local asset references must resolve to files. Every `public/` asset is still published by design—draft filtering must not be mistaken for private asset storage.
