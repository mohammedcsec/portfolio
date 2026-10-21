# Troubleshooting

| Symptom                               | Check                                                                                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install failure                       | Node 22 LTS, npm/network access, unchanged lockfile; run `npm ci`, not force flags.                                                                            |
| Schema failure                        | Read the path in `npm run validate` output. Check JSON punctuation, required fields, unique IDs, HTTPS/local asset paths, date format, and status.             |
| Editor changes vanish                 | It is in-memory. Export before reloading, replace `src/content/site.json`, validate, then rebuild.                                                             |
| Public content stale                  | Regenerate `src/content/public.json` via `npm run validate` or restart dev; rebuild/redeploy for production.                                                   |
| Blank deployed page/assets 404        | Match `SITE_BASE` to actual repository prefix. Build and preview must have the same base.                                                                      |
| Clean nested URL doesn't work         | Share `#/projects/id` URLs. This is hash routing, not server path routing.                                                                                     |
| No résumé/email button                | Those fields are empty intentionally; configure a real value and upload the résumé to `public/documents/`.                                                     |
| Clipboard rejected                    | Use HTTPS/localhost and allow clipboard permission, or copy text manually.                                                                                     |
| Remote login missing                  | Intentional: there is no remote authentication/backend. Use the local editor; never add frontend write tokens.                                                 |
| Port in use                           | Stop the old server or choose another port; update browser-harness URLs if testing.                                                                            |
| Custom domain certificate pending     | Verify DNS and ownership in GitHub Pages settings; do not publish guessed DNS instructions.                                                                    |
| SEO lacks separate article previews   | Hash routes use the root HTML on the server; migrate to prerendering if individually indexed previews are required.                                            |
| Motion feels inappropriate            | Set `settings.motion=false`; also test OS/browser reduced-motion preference.                                                                                   |
| Browser harness not installed locally | Harnesses target Arena's preinstalled Playwright CLI. Portable `npm test` runs Vitest; use a compatible CLI or port harness bodies to your own browser runner. |

For recovery and maintenance, see `../OWNER_GUIDE.md` sections 21–30.
