import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowUp, Menu, X } from 'lucide-react'
import { site } from './lib/content'
import { Motion } from './components/Effects'
import { Home, Listing, About, Contact, Achievements, NotFound } from './pages/Public'
const Detail = lazy(() => import('./pages/Detail'))
const Admin = import.meta.env.DEV ? lazy(() => import('./pages/Admin')) : null
const getRoute = () =>
  location.hash.slice(1) ||
  (location.pathname === import.meta.env.BASE_URL ||
  location.pathname === `${import.meta.env.BASE_URL}index.html`
    ? '/'
    : '/not-found')
export default function App() {
  const [route, setRoute] = useState(getRoute),
    [menu, setMenu] = useState(false)
  const main = useRef<HTMLElement>(null)
  const path = route.split('?')[0]
  useEffect(() => {
    const onHash = () => {
      setRoute(getRoute())
      setMenu(false)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', site.theme.accent)
    document.documentElement.style.setProperty('--bg', site.theme.background)
  }, [])
  useEffect(() => {
    const part = new URLSearchParams(route.split('?')[1]).get('section')
    if (part) {
      let frame = 0
      const observer = new MutationObserver(() => moveToSection())
      const moveToSection = () => {
        const target = document.getElementById(part)
        if (!target) return
        observer.disconnect()
        frame = requestAnimationFrame(() => {
          target.tabIndex = -1
          target.focus({ preventScroll: true })
          target.scrollIntoView({ block: 'start', behavior: 'instant' })
        })
      }
      if (main.current) observer.observe(main.current, { childList: true, subtree: true })
      moveToSection()
      return () => {
        observer.disconnect()
        cancelAnimationFrame(frame)
      }
    }
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }, [route])
  useEffect(() => {
    const parts = path.split('/').filter(Boolean)
    const collection =
      parts[0] === 'projects'
        ? site.projects
        : parts[0] === 'research'
          ? site.articles
          : parts[0] === 'achievements'
            ? site.achievements
            : []
    const record = collection.find((r) => r.id === parts[1])
    const label = record?.title || parts[0]?.replaceAll('-', ' ')
    const title = label
      ? `${label[0].toUpperCase() + label.slice(1)} — ${site.profile.name}`
      : site.seo.title
    const description =
      record?.summary ||
      (label
        ? `${label[0].toUpperCase() + label.slice(1)} from ${site.profile.name}’s security lab. ${site.seo.description}`
        : site.seo.description)
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [path])
  const bits = path.split('/').filter(Boolean)
  let page
  if (path === '/') page = <Home />
  else if (path === '/projects' || path === '/research')
    page = <Listing key={path} kind={bits[0] as 'projects' | 'research'} />
  else if (path === '/about') page = <About />
  else if (path === '/contact') page = <Contact />
  else if (path === '/achievements') page = <Achievements />
  else if (bits.length === 2 && ['projects', 'research', 'achievements'].includes(bits[0]))
    page = <Detail kind={bits[0] as 'projects' | 'research' | 'achievements'} id={bits[1]} />
  else if (path.replace(/\/$/, '') === '/control-center')
    page = Admin ? (
      <Suspense fallback={<p className="page">Loading local editor…</p>}>
        <Admin />
      </Suspense>
    ) : (
      <section className="page section">
        <p className="eyebrow">LOCAL UTILITY ONLY</p>
        <h1>Editing stays local.</h1>
        <p>
          The content editor is excluded from production. Run npm run dev on your own computer and
          open #/control-center/.
        </p>
        <a className="button" href="#/">
          Return to the lab
        </a>
      </section>
    )
  else page = <NotFound />
  return (
    <Motion route={path} enabled={site.settings.motion && !path.includes('control-center')}>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          main.current?.focus()
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#/" aria-label={`${site.profile.name} Security Lab home`}>
          <span className="mark" aria-hidden="true">
            m<span>↗</span>
          </span>
          <span>
            {site.profile.name.toUpperCase()}
            <span className="wordmark-sub">SECURITY LAB</span>
          </span>
        </a>
        <nav
          className={menu ? 'nav open' : 'nav'}
          aria-label="Main navigation"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setMenu(false)
              document.querySelector<HTMLButtonElement>('.menu-button')?.focus()
            }
          }}
        >
          {site.navigation.map((n) => (
            <a
              key={n.path}
              className={path.startsWith(n.path) ? 'active' : ''}
              aria-current={path.startsWith(n.path) ? 'page' : undefined}
              href={`#${n.path}`}
              onClick={() => setMenu(false)}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#/contact">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          aria-label={menu ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        <Suspense
          fallback={
            <p className="page section" role="status">
              Loading the record…
            </p>
          }
        >
          {page}
        </Suspense>
      </main>
      <footer>
        <div className="footer-top">
          <a className="wordmark" href="#/">
            <span className="mark" aria-hidden="true">
              m<span>↗</span>
            </span>
            <span>
              {site.profile.name.toUpperCase()}
              <span className="wordmark-sub">SECURITY LAB</span>
            </span>
          </a>
          <p>{site.footer}</p>
          <a
            className="back-top"
            href="#/"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'instant' })
              main.current?.focus({ preventScroll: true })
            }}
          >
            Back to top <ArrowUp size={15} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.profile.name}.
          </span>
          <span>UNDERSTAND. VERIFY. IMPROVE.</span>
          <div>
            {site.profile.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </footer>
    </Motion>
  )
}
