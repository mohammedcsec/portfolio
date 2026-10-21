import { useState, type ReactNode } from 'react'
import { ArrowUpRight, ArrowRight, Copy, Check, Search } from 'lucide-react'
import { type ContentRecord } from '../content/schema'
import { readingTime, searchRecords, asset } from '../lib/content'
import { SpotlightCard } from './Effects'
export function LinkButton({
  to,
  children,
  secondary = false,
}: {
  to: string
  children: ReactNode
  secondary?: boolean
}) {
  return (
    <a className={`button ${secondary ? 'secondary' : ''}`} href={`#${to}`}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  )
}
export function SectionTitle({
  number,
  kicker,
  title,
  children,
}: {
  number: string
  kicker: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="section-title">
      <div>
        <p className="eyebrow">
          {number} / {kicker}
        </p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  )
}
export function RecordCard({
  record: r,
  kind = 'projects',
  index = 0,
}: {
  record: ContentRecord
  kind?: string
  index?: number
}) {
  return (
    <SpotlightCard className="record-card">
      <a className="card-link" href={`#/${kind}/${r.id}`}>
        {r.cover ? (
          <div className="card-art cover">
            <img
              src={asset(r.cover.src)}
              alt={r.cover.alt}
              loading="lazy"
              width="600"
              height="330"
            />
          </div>
        ) : (
          <div className={`card-art art-${index % 3}`} aria-hidden="true">
            <span className="art-label">
              {kind === 'research' ? 'LAB NOTES' : 'SECURITY LAB'} /{' '}
              {String(index + 1).padStart(2, '0')}
            </span>
            {index % 3 === 0 ? (
              <div className="wire-box">
                <i />
                <i />
                <i />
                <i />
              </div>
            ) : index % 3 === 1 ? (
              <div className="art-code">
                <span>observe(system)</span>
                <span>→ question(assumptions)</span>
                <span>→ verify(evidence)</span>
                <span className="mint">return understanding</span>
              </div>
            ) : (
              <div className="art-target">
                <i />
                <i />
                <i />
                <b>+</b>
              </div>
            )}
            <span className="art-symbol">↗</span>
          </div>
        )}
        <div className="card-body">
          <div className="card-meta">
            <span>{r.category}</span>
            <span>{r.sample ? 'SAMPLE / EDITABLE' : r.type}</span>
          </div>
          <h3>
            {r.title}
            <ArrowUpRight size={19} />
          </h3>
          <p>{r.summary}</p>
          <div className="tags">
            {r.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="card-end">
            <span>
              {kind === 'research' ? (
                <>
                  {r.date && <time dateTime={r.date}>{r.date} / </time>}
                  {readingTime(r)} MIN READ
                </>
              ) : r.date ? (
                <>
                  <time dateTime={r.date}>{r.date}</time> / CASE STUDY
                </>
              ) : (
                'VIEW CASE STUDY'
              )}
            </span>
            <ArrowRight size={15} />
          </div>
        </div>
      </a>
      {r.repository && (
        <a
          className="card-repository"
          href={asset(r.repository)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source repository <ArrowUpRight size={15} />
        </a>
      )}
    </SpotlightCard>
  )
}
export function Collection({ records, kind }: { records: ContentRecord[]; kind: string }) {
  const [q, setQ] = useState(''),
    [category, setCategory] = useState('All')
  const cats = ['All', ...new Set(records.map((r) => r.category))]
  const result = searchRecords(records, q, category)
  return (
    <>
      <div className="collection-controls">
        <label className="search">
          <Search size={18} />
          <input
            aria-label={`Search ${kind}`}
            placeholder={`Search ${kind}…`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="filters" aria-label="Filter by category">
          {cats.map((c) => (
            <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="results" aria-live="polite">
        {result.length} {result.length === 1 ? 'entry' : 'entries'}
        {q && ` matching “${q}”`}
      </p>
      {result.length ? (
        <div className="cards">
          {result.map((r, i) => (
            <RecordCard record={r} kind={kind} index={i} key={r.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>No matching entries</h3>
          <p>Try a different search or category.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQ('')
              setCategory('All')
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  )
}
export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [status, setStatus] = useState('')
  return (
    <>
      <button
        className="copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setStatus('Copied')
          } catch {
            setStatus('Unable to copy. Select and copy the text manually.')
          }
        }}
      >
        {status === 'Copied' ? <Check size={15} /> : <Copy size={15} />} {label}
      </button>
      <span role="status" className="copy-status">
        {status}
      </span>
    </>
  )
}
