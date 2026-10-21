import { Fragment } from 'react'
import type { ContentRecord } from '../content/schema'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  ScanLine,
  Terminal,
  FileText,
  Trophy,
  GitBranch,
  Mail,
} from 'lucide-react'
import { site, visible, asset, readingTime } from '../lib/content'
import { Spotlight, LabVisual, SpotlightCard } from '../components/Effects'
import { LinkButton, SectionTitle, RecordCard, Collection, CopyButton } from '../components/UI'
const projects = visible(site.projects),
  articles = visible(site.articles),
  achievements = visible(site.achievements)
const home = site.homepage
const focusIcons = { shield: ShieldCheck, scan: ScanLine, terminal: Terminal }
export function ContactBlock() {
  return (
    <div className="contact-panel">
      <div>
        <p className="eyebrow">OPEN A CONVERSATION</p>
        <h2 className="preserve-lines">
          {home.contact.title.replace(/\.$/, '')}
          <span className="mint">.</span>
        </h2>
        <p>{home.contact.intro}</p>
      </div>
      <div className="contact-actions">
        {site.profile.email ? (
          <>
            <a className="button" href={`mailto:${site.profile.email}`}>
              <Mail size={18} />
              {site.profile.email}
              <ArrowUpRight size={18} />
            </a>
            <CopyButton value={site.profile.email} label="Copy email" />
            <small>Opens your email app; no message is submitted by this site.</small>
          </>
        ) : (
          <div className="setup-note">
            <Mail size={24} />
            <p>Contact details are being prepared.</p>
            <small>No public email has been supplied yet.</small>
          </div>
        )}
        {site.profile.socials
          .filter((s) => s.url)
          .map((s) => (
            <a key={s.label} href={asset(s.url)} target="_blank" rel="noopener noreferrer">
              {s.label} <ArrowUpRight size={16} />
            </a>
          ))}
      </div>
    </div>
  )
}
export function AchievementFeature({
  records = achievements,
  featuredId = home.featuredAchievementId,
}: { records?: ContentRecord[]; featuredId?: string } = {}) {
  const a = records.find((r) => r.id === featuredId && r.status === 'published')
  if (!a) return null
  return (
    <a href={`#/achievements/${a.id}`} className="achievement-strip reveal">
      <div className="award-icon">
        <Trophy size={25} />
      </div>
      <div>
        <p className="eyebrow">RECOGNITION</p>
        <h2>{a.title}</h2>
        <p>{a.summary}</p>
      </div>
      <span className="award-link">
        Explore the achievement <ArrowUpRight size={19} />
      </span>
    </a>
  )
}
export function Home() {
  return (
    <>
      <section className="hero">
        <Spotlight />
        <div className="hero-copy">
          <p className="eyebrow entrance">
            <span className="status-dot" /> {home.hero.eyebrow}
          </p>
          <h1 className="entrance">
            {home.hero.lines.map((line, i) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
            <span>{home.hero.accent}</span>
          </h1>
          <p className="hero-name entrance">
            I’m {site.profile.name}
            <span> / SECURITY LAB</span>
          </p>
          <p className="hero-specialism entrance">{site.profile.headline}</p>
          <p className="hero-intro entrance">{site.profile.intro}</p>
          <div className="hero-actions entrance">
            <LinkButton to="/projects">Explore the work</LinkButton>
            {site.profile.resume ? (
              <a className="button secondary" download href={asset(site.profile.resume)}>
                Download résumé <FileText size={17} />
              </a>
            ) : (
              <a className="text-link" href="#/about">
                Meet {site.profile.name} <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        </div>
        <LabVisual />
        <div className="hero-foot">
          <span>ETHICAL HACKING &nbsp; / &nbsp; SECURITY ANALYSIS</span>
          <a href={home.sections.projects ? '#/?section=selected' : '#/projects'}>
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </a>
        </div>
      </section>
      {home.sections.achievement && <AchievementFeature />}
      {home.sections.projects && (
        <section id="selected" className="section reveal">
          <SectionTitle number="01" kicker="SELECTED WORK" title="Inside the lab.">
            <a className="text-link" href="#/projects">
              All projects <ArrowUpRight size={17} />
            </a>
          </SectionTitle>
          <p className="section-intro">
            A place for practical exploration, disciplined analysis, and work worth documenting.
          </p>
          {site.settings.showSamples && projects.some((p) => p.sample) && (
            <p className="sample-notice">
              CONTENT PREVIEW — Project entries below are editable examples, not claims of completed
              work.
            </p>
          )}
          <div className="cards">
            {projects
              .filter((p) => p.featured)
              .slice(0, 3)
              .map((r, i) => (
                <RecordCard key={r.id} record={r} index={i} />
              ))}
          </div>
          {!projects.some((p) => p.featured) && (
            <p className="empty">Project case studies are being prepared.</p>
          )}
        </section>
      )}
      {home.sections.technicalFocus && home.focus.length > 0 && (
        <section className="section focus-section reveal">
          <SectionTitle
            number="02"
            kicker="TECHNICAL DIRECTION"
            title="Curiosity, with a purpose."
          />
          <div className="focus-grid">
            {home.focus.map((f, i) => {
              const Icon = focusIcons[f.icon]
              return (
                <SpotlightCard key={f.title} className="focus-card">
                  <Icon size={27} />
                  <span className="index">0{i + 1}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  <span className="micro">AREA OF FOCUS / CONTINUING DEVELOPMENT</span>
                </SpotlightCard>
              )
            })}
          </div>
        </section>
      )}
      {home.sections.workflow && (
        <section className="section workflow reveal">
          <div>
            <p className="eyebrow">03 / THE APPROACH</p>
            <h2 className="preserve-lines">{home.workflow.title}</h2>
            <p className="section-intro">{home.workflow.intro}</p>
            <span className="philosophy preserve-lines">“{home.workflow.philosophy}”</span>
          </div>
          <div className="steps">
            {home.workflow.steps.map(({ title, description }, i) => (
              <div className="step" key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
            ))}
          </div>
        </section>
      )}
      {home.sections.leadership && (
        <section className="leadership reveal">
          <GitBranch size={32} />
          <div>
            <p className="eyebrow">BUILT TOGETHER</p>
            <h2>{home.leadership.title}</h2>
            <p>{home.leadership.body}</p>
          </div>
          <LinkButton to="/achievements" secondary>
            Leadership & recognition
          </LinkButton>
        </section>
      )}
      {home.sections.research && articles.some((r) => r.featured) && (
        <section className="section reveal">
          <SectionTitle number="04" kicker="RESEARCH & NOTES" title="Document the thinking.">
            <a className="text-link" href="#/research">
              All notes <ArrowUpRight size={17} />
            </a>
          </SectionTitle>
          {articles
            .filter((r) => r.featured)
            .slice(0, 2)
            .map((r, i) => (
              <a key={r.id} href={`#/research/${r.id}`} className="article-row">
                <span className="article-number">0{i + 1}</span>
                <div>
                  <p className="eyebrow">
                    {r.category} / {r.sample ? 'EDITORIAL EXAMPLE' : 'PUBLISHED NOTE'}
                  </p>
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                </div>
                <span className="article-time">
                  {readingTime(r)} MIN READ <ArrowUpRight size={20} />
                </span>
              </a>
            ))}
        </section>
      )}
      {home.sections.contact && (
        <section className="section reveal">
          <ContactBlock />
        </section>
      )}
    </>
  )
}
export function Listing({ kind }: { kind: 'projects' | 'research' }) {
  return (
    <section className="page section">
      <p className="eyebrow">THE SECURITY LAB / {kind.toUpperCase()}</p>
      <h1>{kind === 'projects' ? 'Work, examined.' : 'Thinking, documented.'}</h1>
      <p className="page-intro">
        {kind === 'projects'
          ? 'Case studies, experiments, and tooling. An evidence-first view of security work.'
          : 'Technical notes, methodology, and lessons from the learning process.'}
      </p>
      {(kind === 'projects' ? projects : articles).some((r) => r.sample) && (
        <p className="sample-notice">
          Entries labeled sample are editable examples. No completed projects or original research
          results are implied.
        </p>
      )}
      <Collection records={kind === 'projects' ? projects : articles} kind={kind} />
    </section>
  )
}
export function About() {
  return (
    <section className="page section">
      <p className="eyebrow">THE PERSON BEHIND THE LAB</p>
      <h1>
        Hi, I’m Mohammed<span className="mint">.</span>
      </h1>
      <p className="page-intro">{site.profile.headline}</p>
      <div className="about-grid">
        <div className="about-monogram" aria-hidden="true">
          <span>
            M<span className="mint">.</span>
          </span>
          <small>
            CURIOUS BY DESIGN.
            <br />
            RESPONSIBLE BY DEFAULT.
          </small>
        </div>
        <div className="prose">
          <h2>A considered approach to security.</h2>
          <p>{site.profile.bio}</p>
          <h2>Current focus</h2>
          <p>{site.profile.focus}</p>
          <h2>Where next</h2>
          <p>{site.profile.goals}</p>
          <h2>Technologies & interests</h2>
          <div className="tags">
            {site.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <h2>Collaboration & leadership</h2>
          <p>{home.leadership.body}</p>
          <a className="text-link" href="#/achievements">
            Read about the recognition <ArrowRight size={17} />
          </a>
          <h2>Résumé</h2>
          {site.profile.resume ? (
            <a className="button" download href={asset(site.profile.resume)}>
              Download résumé <ArrowUpRight size={17} />
            </a>
          ) : (
            <p>A public résumé has not been supplied yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
export function Achievements() {
  return (
    <section className="page section">
      <p className="eyebrow">RECOGNITION & COLLABORATION</p>
      <h1>Progress, together.</h1>
      <p className="page-intro">
        A record of competition, leadership, and learning. No rankings or credentials beyond the
        supplied information.
      </p>
      <AchievementFeature />
      {achievements
        .filter((r) => r.id !== home.featuredAchievementId)
        .map((r) => (
          <a className="article-row" href={`#/achievements/${r.id}`} key={r.id}>
            <h2>{r.title}</h2>
            <p>{r.summary}</p>
            <ArrowUpRight />
          </a>
        ))}
    </section>
  )
}
export function Contact() {
  return (
    <section className="page section">
      <p className="eyebrow">CONTACT / COLLABORATION</p>
      <h1>Let’s compare notes.</h1>
      <p className="page-intro">Thoughtful conversations. Responsible research.</p>
      <ContactBlock />
    </section>
  )
}
export function NotFound() {
  return (
    <section className="page section not-found">
      <p className="eyebrow">404 / OUTSIDE THE SCOPE</p>
      <h1>No signal here.</h1>
      <p className="page-intro">This page doesn’t exist, or the record is not published.</p>
      <div className="hero-actions">
        <LinkButton to="/">Back to the lab</LinkButton>
        <LinkButton to="/projects" secondary>
          Browse projects
        </LinkButton>
      </div>
    </section>
  )
}
