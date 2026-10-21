import { readFileSync, writeFileSync } from 'node:fs'
const s = JSON.parse(readFileSync('src/content/public.json', 'utf8'))
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
let html = readFileSync('dist/index.html', 'utf8')
  .replace('<title>Mohammed — Security Lab</title>', `<title>${escape(s.seo.title)}</title>`)
  .replace(
    '<!--SEO-->',
    `<meta name="description" content="${escape(s.seo.description)}"><meta property="og:title" content="${escape(s.seo.title)}"><meta property="og:description" content="${escape(s.seo.description)}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">${s.seo.siteUrl ? `<link rel="canonical" href="${escape(s.seo.siteUrl)}"><meta property="og:url" content="${escape(s.seo.siteUrl)}"><meta property="og:image" content="${escape(s.seo.siteUrl.replace(/\/$/, '') + '/images/social.png')}"><meta property="og:image:alt" content="Mohammed — Security Lab. Understand the attack. Improve the defense.">` : ''}`,
  )
writeFileSync('dist/index.html', html)
writeFileSync('dist/404.html', html)
writeFileSync(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\n${s.seo.siteUrl ? 'Sitemap: ' + s.seo.siteUrl.replace(/\/$/, '') + '/sitemap.xml\n' : ''}`,
)
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${s.seo.siteUrl ? '<url><loc>' + escape(s.seo.siteUrl) + '</loc></url>' : ''}</urlset>`,
)
console.log(
  s.seo.siteUrl
    ? 'Canonical and sitemap generated'
    : 'Domain unset: canonical omitted; sitemap intentionally empty',
)
