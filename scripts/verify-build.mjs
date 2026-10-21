import { readdirSync, readFileSync } from 'node:fs'
const source = JSON.parse(readFileSync('src/content/site.json', 'utf8'))
const publicData = JSON.parse(readFileSync('src/content/public.json', 'utf8'))
const js = readdirSync('dist/assets')
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync('dist/assets/' + f, 'utf8'))
  .join('\n')
for (const key of ['projects', 'articles', 'achievements'])
  for (const record of source[key].filter((r) => r.status === 'draft')) {
    if (publicData[key].some((r) => r.id === record.id) || js.includes(record.id))
      throw new Error('Draft leaked into production: ' + record.id)
  }
if (js.includes('Export site.json') || js.includes('LOCAL CONTENT WORKSPACE'))
  throw new Error('Local editor leaked into production')
console.log('Production isolation verified: no draft IDs or local editor implementation in bundles')
