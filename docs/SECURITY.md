# Security review

See `../SECURITY_CHECKLIST.md` and `ADMIN_SECURITY.md` for operational controls and boundaries.

No secrets, credentials, privileged browser tokens, fake passwords, unsafe HTML injection, dynamic code execution, application cookies, public uploads, or mutation endpoints are included. Data schemas reject dangerous URL schemes and parent path traversal. Markdown is text-rendered; raw HTML is not enabled. Optional remote resources can still disclose visitor IP addresses to their hosts; prefer local assets and review all outbound links.

Dependency scanning is recorded in `dependency-audit.json`; the final recorded audit reports zero known vulnerabilities. Earlier vulnerable development tool versions were upgraded before delivery. Audit results are time-specific and not proof of security. The source pattern scan cannot guarantee absence of all secrets or private data, and there is no Git history to inspect in this delivery.

Only generated `dist/` is published. The project ZIP includes owner source content, documentation, and examples and should not be treated as a private vault or uploaded as a site asset. GitHub Pages cannot supply application authentication or arbitrary security headers. No claim is made that its public `/control-center/` explanatory page protects any server resource.

For suspected exposure: revoke affected credentials, restrict publication, preserve a minimal private timeline, redact/revert, redeploy, inspect history/artifacts/caches, notify appropriate parties privately, and verify recovery. Do not post confidential findings as public issues.
