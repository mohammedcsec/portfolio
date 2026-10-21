# Content guide

Edit `src/content/site.json`; record schema is `src/content/schema.ts`. `npm run validate` generates `src/content/public.json` without draft/hidden sample records. Development startup and build run validation automatically. Regenerate after manual changes; the generated JSON is not a source file.

Top-level fields: profile, seo, homepage, theme, settings, navigation, footer, technologies, projects, articles, achievements. Collections hold independent records with unique slug IDs, title, summary, category, tags, status, sample, featured, sections, and references. Optional fields: type, date, repository, cover. Sections may contain image, alt, caption. Local public asset paths use `images/...` or `documents/...`; HTTPS links are supported.

`status=draft` excludes a record from public builds, but not public Git history. `settings.showSamples=false` excludes sample records. `featured=true` selects homepage project/research entries. Array order controls collection and related/previous/next order. Empty section bodies are hidden. Dates must be known, not invented. Cover images require alt text; add alt text/captions for section images too.

The local editor supports search, create/edit, draft status, featured/sample flags, section Markdown, references, cover images, section images, reorder-up, confirmation before delete/cancel, local preview, and whole-file export. Profile/social/SEO/theme/résumé panels edit validated JSON. Save is in-memory only. Replace the source file with the export, validate, build, review, commit, deploy.

Editorial layout labels remain in `src/pages/Public.tsx`; ordinary owner profile, homepage content, and repeatable records do not require JSX changes. The recognition strip selects a published record by `homepage.featuredAchievementId` and renders its title/summary. Homepage hero, focus, workflow, leadership, contact, and section switches are also data-driven in `homepage`. No real projects, contact details, résumé, or achievement evidence files were supplied.

Validation now rejects malformed HTTPS links and embedded credentials, impossible calendar dates, and section images without alternative text. Declared visible local assets must exist in `public/`. All files in `public/` are public regardless of draft status; never stage private draft-only evidence there. Browser unsaved-change warnings are advisory, not persistence.
