import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { siteSchema } from '../src/content/schema'
const site = siteSchema.parse(JSON.parse(readFileSync('src/content/site.json', 'utf8')))
// All files in public/ are published. Reject broken local links for visible content.
const published = [...site.projects, ...site.articles, ...site.achievements].filter(
  (r) => r.status === 'published' && (!r.sample || site.settings.showSamples),
)
const assets = [
  site.profile.resume,
  ...published.flatMap((r) => [r.cover?.src, ...r.sections.map((s) => s.image)]),
]
for (const asset of assets) {
  if (!asset || asset.startsWith('https://')) continue
  try {
    if (!statSync(resolve('public', asset)).isFile()) throw Error('Not a file')
  } catch {
    throw new Error(
      `Missing local public asset: ${asset}. Add it to public/ or clear the content field.`,
    )
  }
}

for (const key of ['projects', 'articles', 'achievements'] as const)
  site[key] = site[key].filter(
    (r) => r.status === 'published' && (!r.sample || site.settings.showSamples),
  )
writeFileSync('src/content/public.json', JSON.stringify(site, null, 2) + '\n')
console.log('Content validated; public content generated without drafts')
