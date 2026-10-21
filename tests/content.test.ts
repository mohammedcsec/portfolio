import { describe, it, expect } from 'vitest'
import raw from '../src/content/site.json'
import { fixtureRecord } from './fixtures'
import { siteSchema } from '../src/content/schema'
import { searchRecords, readingTime, visible } from '../src/lib/content'
describe('Content boundaries', () => {
  it('validates the owner content', () => expect(siteSchema.safeParse(raw).success).toBe(true))
  it('rejects dangerous URLs', () => {
    const d = structuredClone(raw)
    d.profile.resume = 'javascript:alert(1)'
    expect(siteSchema.safeParse(d).success).toBe(false)
  })
  it('rejects duplicate IDs', () => {
    const d = structuredClone(raw)
    d.projects = [fixtureRecord, fixtureRecord]
    expect(siteSchema.safeParse(d).success).toBe(false)
  })
  it('rejects parent traversal', () => {
    const d = structuredClone(raw)
    d.profile.resume = 'documents/../../secrets'
    expect(siteSchema.safeParse(d).success).toBe(false)
  })
  it('never lists draft records', () => {
    const p = fixtureRecord
    expect(visible([{ ...p, status: 'draft' }])).toEqual([])
  })
  it('supports case-insensitive search and category filtering', () => {
    const p = [fixtureRecord]
    expect(searchRecords(p, '  HTTP  ', 'All')).toHaveLength(1)
    expect(searchRecords(p, 'HTTP', 'CTF')).toHaveLength(0)
  })
  it('handles an empty result', () =>
    expect(searchRecords([fixtureRecord], 'not-a-project', 'All')).toEqual([]))
  it('estimates reading time with a one-minute minimum', () =>
    expect(readingTime(fixtureRecord)).toBe(1))
  it('preserves the supplied achievement without a ranking', () => {
    const a = raw.achievements[0]
    expect(a.summary).toContain('Special Jury Mention')
    expect(a.sample).toBe(false)
  })
})
