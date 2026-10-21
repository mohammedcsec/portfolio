import ReactMarkdown from 'react-markdown'
import { reactText } from '../lib/reactText'
import rehypeHighlight from 'rehype-highlight'
import { ArrowUpRight } from 'lucide-react'
import { site, visible, asset, readingTime } from '../lib/content'
import { type ContentRecord } from '../content/schema'
import { CopyButton, SectionTitle, RecordCard } from '../components/UI'
import { NotFound } from './Public'
const projects = visible(site.projects),
  articles = visible(site.articles),
  achievements = visible(site.achievements)
function CodePre({ children, ...props }: React.ComponentProps<'pre'>) {
  const text = reactText(children)
  return (
    <div className="code-wrap">
      <CopyButton value={text} label="Copy code" />
      <pre {...props}>{children}</pre>
    </div>
  )
}
export function Detail({
  kind,
  id,
}: {
  kind: 'projects' | 'research' | 'achievements'
  id: string
}) {
  const records = kind === 'projects' ? projects : kind === 'research' ? articles : achievements
  const r = records.find((r) => r.id === id)
  if (!r) return <NotFound />
  return <DetailContent r={r} kind={kind} records={records} />
}
export function DetailContent({
  r,
  kind,
  records = [],
  preview = false,
}: {
  r: ContentRecord
  kind: string
  records?: ContentRecord[]
  preview?: boolean
}) {
  const idx = records.findIndex((x) => x.id === r.id)
  const Title = preview ? 'h3' : 'h1'
  return (
    <section className="page section detail">
      {!preview && (
        <a className="text-link" href={`#/${kind}`}>
          ← Back to {kind}
        </a>
      )}
      <p className="eyebrow detail-category">
        {r.category} / {r.type}
        {r.date && ` / ${r.date}`}
        {kind === 'research' && ` / ${readingTime(r)} MIN READ`}
      </p>
      <Title>{r.title}</Title>
      <p className="page-intro">{r.summary}</p>
      {r.sample && (
        <p className="sample-notice">
          SAMPLE CONTENT — An editable example. Not evidence of completed work or an original
          finding.
        </p>
      )}
      <div className="tags">
        {r.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="detail-layout">
        {!preview && (
          <aside>
            <p className="eyebrow">IN THIS {kind === 'research' ? 'NOTE' : 'RECORD'}</p>
            <nav aria-label="Table of contents">
              {r.sections
                .filter((s) => s.body)
                .map((s, i) => (
                  <a key={i} href={`#/${kind}/${r.id}?section=part-${i}`}>
                    {s.heading}
                  </a>
                ))}
            </nav>
          </aside>
        )}
        <div className="prose">
          {r.sections
            .filter((s) => s.body)
            .map((s, i) => (
              <section key={i} id={`part-${i}`}>
                <h2>{s.heading}</h2>
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: CodePre,
                    a: ({ href, children }) => (
                      <a href={href} rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {s.body}
                </ReactMarkdown>
                {s.image && (
                  <figure>
                    <img src={asset(s.image)} alt={s.alt || ''} loading="lazy" />
                    {s.caption && <figcaption>{s.caption}</figcaption>}
                  </figure>
                )}
              </section>
            ))}
          {r.repository && (
            <a
              className="button secondary"
              href={asset(r.repository)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source repository <ArrowUpRight size={17} />
            </a>
          )}
          {r.references.length > 0 && (
            <section>
              <h2>References</h2>
              <ul>
                {r.references.map((ref) => (
                  <li key={ref.url}>
                    <a href={asset(ref.url)} target="_blank" rel="noopener noreferrer">
                      {ref.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="article-pagination">
            {records[idx - 1] && (
              <a href={`#/${kind}/${records[idx - 1].id}`}>← {records[idx - 1].title}</a>
            )}
            {records[idx + 1] && (
              <a href={`#/${kind}/${records[idx + 1].id}`}>{records[idx + 1].title} →</a>
            )}
          </div>
        </div>
      </div>
      {records.filter((p) => p.id !== r.id).length > 0 && (
        <>
          <SectionTitle number="→" kicker="KEEP EXPLORING" title="Related entries" />
          <div className="cards">
            {records
              .filter((p) => p.id !== r.id)
              .slice(0, 2)
              .map((p, i) => (
                <RecordCard record={p} key={p.id} kind={kind} index={i} />
              ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Detail
