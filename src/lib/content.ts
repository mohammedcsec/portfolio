import raw from '../content/public.json'
import { siteSchema, type ContentRecord } from '../content/schema'
export const site = siteSchema.parse(raw)
export const visible = (records: ContentRecord[]) =>
  records.filter((r) => r.status === 'published' && (!r.sample || site.settings.showSamples))
export const searchRecords = (records: ContentRecord[], query: string, category: string) =>
  records.filter(
    (r) =>
      (category === 'All' || r.category === category) &&
      `${r.title} ${r.summary} ${r.tags.join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  )
export const readingTime = (r: ContentRecord) =>
  Math.max(
    1,
    Math.ceil(
      r.sections
        .map((s) => s.body)
        .join(' ')
        .split(/\s+/).length / 220,
    ),
  )
export const asset = (path: string) =>
  path.startsWith('https://') ? path : `${import.meta.env.BASE_URL}${path}`
