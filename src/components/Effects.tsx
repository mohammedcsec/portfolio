import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, type LenisRef } from 'lenis/react'
import 'lenis/dist/lenis.css'
gsap.registerPlugin(ScrollTrigger)
export function Motion({
  children,
  route,
  enabled,
}: {
  children: ReactNode
  route: string
  enabled: boolean
}) {
  const ref = useRef<HTMLDivElement>(null),
    lenis = useRef<LenisRef>(null)
  const [reduce, setReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduce(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  useEffect(() => {
    if (reduce || !enabled) return
    const update = (t: number) => lenis.current?.lenis?.raf(t * 1000)
    gsap.ticker.add(update)
    const instance = lenis.current?.lenis
    instance?.on('scroll', ScrollTrigger.update)
    return () => {
      gsap.ticker.remove(update)
      instance?.off('scroll', ScrollTrigger.update)
    }
  }, [reduce, enabled])
  useEffect(() => {
    if (reduce || !enabled) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })
      if (ref.current?.querySelector('.hero'))
        tl.from('.hero .entrance', { y: 24, opacity: 0, stagger: 0.11 })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) =>
        gsap.from(el, {
          y: 18,
          duration: 0.65,
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        }),
      )
    }, ref)
    return () => ctx.revert()
  }, [route, reduce, enabled])
  return (
    <div ref={ref} className={!enabled || reduce ? 'motion-disabled' : undefined}>
      {!reduce && enabled && (
        <ReactLenis
          ref={lenis}
          root
          options={{ autoRaf: false, smoothWheel: true, syncTouch: false, anchors: false }}
        />
      )}
      {children}
    </div>
  )
}
// Simplified pointer-position technique adapted from React Bits SpotlightCard.
// No continuous RAF, ambient motion, or global pointer listeners.
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={`spot-card ${className}`}
      onPointerMove={(e) => {
        if (
          e.currentTarget.closest('.motion-disabled') ||
          e.pointerType === 'touch' ||
          matchMedia('(prefers-reduced-motion: reduce)').matches
        )
          return
        const b = e.currentTarget.getBoundingClientRect()
        ref.current?.style.setProperty('--x', `${e.clientX - b.left}px`)
        ref.current?.style.setProperty('--y', `${e.clientY - b.top}px`)
      }}
    >
      {children}
    </div>
  )
}
// SVG spotlight adapted from Aceternity UI, discovered on 21st.dev. MIT.
export function Spotlight() {
  const id = useId()
  return (
    <svg className="spotlight" aria-hidden="true" viewBox="0 0 1200 900">
      <defs>
        <filter id={id}>
          <feGaussianBlur stdDeviation="65" />
        </filter>
      </defs>
      <ellipse
        cx="650"
        cy="330"
        rx="480"
        ry="100"
        fill="var(--accent)"
        fillOpacity=".10"
        transform="rotate(-38 650 330)"
        filter={`url(#${id})`}
      />
    </svg>
  )
}
export function LabVisual() {
  return (
    <div className="lab-visual" aria-hidden="true">
      <div className="visual-top">
        <span>FIG. 01 / THREAT SURFACE</span>
        <span>↗</span>
      </div>
      <svg viewBox="0 0 480 400">
        <defs>
          <radialGradient id="sphere">
            <stop stopColor="var(--accent)" stopOpacity=".13" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="240" cy="200" r="165" fill="url(#sphere)" />
        <g className="orb" fill="none" stroke="var(--accent)" strokeWidth=".6">
          {[155, 125, 85, 40].map((r) => (
            <ellipse key={r} cx="240" cy="200" rx={r} ry="155" />
          ))}
          {[50, 100, 145].map((r) => (
            <ellipse key={r} cx="240" cy="200" rx="155" ry={r} />
          ))}
          <circle cx="240" cy="200" r="155" />
          <path d="M65 200h350M240 30v340" strokeDasharray="3 7" />
        </g>
        <g fill="var(--accent)">
          <circle cx="365" cy="110" r="4" />
          <circle cx="105" cy="275" r="4" />
          <circle cx="270" cy="352" r="3" />
        </g>
        <g stroke="#6a8c7d" strokeWidth=".7" fill="none">
          <path d="M365 110h55v-36h35M105 275H45v45H15" />
        </g>
        <g fill="#9cafa6" fontFamily="monospace" fontSize="9">
          <text x="367" y="63">
            TRUST BOUNDARY
          </text>
          <text x="15" y="338">
            OBSERVE / VERIFY
          </text>
        </g>
      </svg>
      <div className="visual-bottom">
        <span>
          <i /> SYSTEMS. SIGNALS. SECURITY.
        </span>
        <span>001—∞</span>
      </div>
    </div>
  )
}
