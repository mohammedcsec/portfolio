# GitHub Pages deployment

1. Review source, drafts, asset metadata, and repository visibility. Create your repository and push to `main`.
2. Enable Settings → Pages → GitHub Actions.
3. `.github/workflows/deploy.yml` installs the lockfile, lints, runs unit tests, builds, checks draft/editor isolation, and deploys only `dist/`.
4. Project repositories derive `SITE_BASE=/<repository-name>/`. User sites/custom domains must set repository Actions variable `SITE_BASE=/`.
5. Set `seo.siteUrl` to the actual HTTPS URL (including project prefix). Rebuild for canonical, OG image URL, robots sitemap link, and root sitemap URL.
6. Verify published assets, nested fragment refreshes, 404, résumé, contact, mobile navigation, and editor exclusion.

Local subpath test: `SITE_BASE=/security-lab/ npm run build`, then **also** `SITE_BASE=/security-lab/ npm run preview`. The matching base in both commands is essential. PowerShell syntax is in the owner guide.

Custom domain: verify ownership, follow current GitHub DNS instructions, set Pages custom domain, set base `/`, optionally add the approved hostname in `public/CNAME`, then enforce HTTPS after certificate provisioning. No placeholder CNAME is included.

Hash routes are a deliberate static-host compatibility tradeoff: browser titles/descriptions change, but generic social scrapers see root metadata and the sitemap lists only the root. Full per-article indexing/social preview needs prerendering/SSG work. No remote deployment was performed in this delivery.
