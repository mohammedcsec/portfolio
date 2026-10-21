import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import raw from '../src/content/site.json'
import { siteSchema, recordSchema } from '../src/content/schema'
import { reactText } from '../src/lib/reactText'
import { isHttpsUrl, isCalendarDate, parseTags } from '../src/lib/validation'
import { AchievementFeature } from '../src/pages/Public'
import { fixtureRecord } from './fixtures'
describe('Second-review regressions', () => {
  it.each([
    'https://',
    'https://bad host.test',
    'https://user:pass@example.test',
    'http://example.test',
    'javascript:alert(1)',
    '//example.test',
    'https://example.test\\evil',
  ])('rejects malformed or unsuitable URL: %s', (url) => {
    expect(isHttpsUrl(url)).toBe(false)
    const d = structuredClone(raw)
    d.profile.socials = [{ label: 'Test', url }]
    expect(siteSchema.safeParse(d).success).toBe(false)
  })
  it('accepts complete HTTPS URLs', () =>
    expect(isHttpsUrl('https://example.test/docs?topic=web#intro')).toBe(true))
  it.each([
    ['2025-02-29', false],
    ['2024-02-29', true],
    ['2026-13-01', false],
    ['2026-04-31', false],
    ['2026-10-20', true],
  ])('checks calendar date %s', (date, valid) => expect(isCalendarDate(String(date))).toBe(valid))
  it('returns validation errors rather than throwing for invalid canonical URLs', () => {
    const d = structuredClone(raw)
    d.seo.siteUrl = 'not a URL'
    expect(siteSchema.safeParse(d).success).toBe(false)
  })
  it('rejects image evidence without meaningful alternative text', () => {
    const d = {
      ...fixtureRecord,
      sections: [{ heading: 'Evidence', body: 'Lab evidence.', image: 'images/lab.webp', alt: '' }],
    }
    expect(recordSchema.safeParse(d).success).toBe(false)
  })
  it('rejects empty reference links', () =>
    expect(
      recordSchema.safeParse({ ...fixtureRecord, references: [{ label: 'Reference', url: '' }] })
        .success,
    ).toBe(false))
  it('extracts exact highlighted code through nested spans', () =>
    expect(
      reactText(
        <code>
          <span>const</span>
          {' answer = '}
          <span>
            <span>42</span>
          </span>
          {';\n'}
        </code>,
      ),
    ).toBe('const answer = 42;\n'))
  it('normalizes committed tags while allowing a separate raw editing buffer', () =>
    expect(parseTags('HTTP, Python, HTTP,  , Linux,')).toEqual(['HTTP', 'Python', 'Linux']))
  it('does not change the featured recognition when achievements are reordered', () => {
    const known = {
      ...fixtureRecord,
      id: 'known-recognition',
      title: 'Known recognition',
      summary: 'Supplied summary.',
      sample: false,
    }
    const other = { ...fixtureRecord, id: 'other', title: 'Other record' }
    const html = renderToStaticMarkup(
      <AchievementFeature records={[other, known]} featuredId="known-recognition" />,
    )
    expect(html).toContain('Known recognition')
    expect(html).not.toContain('Other record')
    expect(html).toContain('#/achievements/known-recognition')
  })
  it('does not invent a recognition if the selected record is absent', () =>
    expect(renderToStaticMarkup(<AchievementFeature records={[]} featuredId="missing" />)).toBe(''))
  it('validates all homepage section switches in content', () => {
    const d = structuredClone(raw)
    d.homepage.sections.research = false
    expect(siteSchema.parse(d).homepage.sections.research).toBe(false)
  })
})
