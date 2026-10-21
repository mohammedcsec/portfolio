import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { RecordCard, Collection } from '../src/components/UI'
import { ContactBlock, NotFound } from '../src/pages/Public'
import { site } from '../src/lib/content'
import { fixtureRecord } from './fixtures'
describe('Public components', () => {
  it('clearly labels sample project content', () => {
    const html = renderToStaticMarkup(<RecordCard record={fixtureRecord} />)
    expect(html).toContain('SAMPLE / EDITABLE')
    expect(html).toContain('#/projects/unit-test-record')
  })
  it('renders accessible collection search', () => {
    expect(renderToStaticMarkup(<Collection records={site.projects} kind="projects" />)).toContain(
      'aria-label="Search projects"',
    )
  })
  it('does not invent contact forms or email links', () => {
    const html = renderToStaticMarkup(<ContactBlock />)
    if (!site.profile.email) expect(html).toContain('No public email has been supplied yet')
    expect(html).not.toContain('<form')
    if (!site.profile.email) expect(html).not.toContain('mailto:')
    else expect(html).toContain('mailto:')
  })
  it('provides working fallback navigation', () => {
    const html = renderToStaticMarkup(<NotFound />)
    expect(html).toContain('href="#/"')
    expect(html).toContain('href="#/projects"')
  })
  it('shows known publication dates in article cards', () => {
    const html = renderToStaticMarkup(
      <RecordCard kind="research" record={{ ...fixtureRecord, date: '2026-10-20' }} />,
    )
    expect(html).toContain('dateTime="2026-10-20"')
  })
  it('offers an optional repository link without nesting anchors', () => {
    const html = renderToStaticMarkup(
      <RecordCard record={{ ...fixtureRecord, repository: 'https://example.test/repository' }} />,
    )
    expect(html).toContain('href="https://example.test/repository"')
    expect(html).toContain('Source repository')
    expect(html).toMatch(/<\/a><a class="card-repository"/)
  })
})
