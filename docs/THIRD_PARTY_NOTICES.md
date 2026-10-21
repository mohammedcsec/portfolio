# Third-party resources and integration notes

Reviewed 20 October 2026. This is an integrated website, not a component marketplace or resold component pack. Exact installed versions are in package/lock files.

## GSAP

- Documentation: https://gsap.com/docs/v3/GSAP/gsap.context()/
- License: https://gsap.com/community/standard-license/ (standard no-charge GSAP license; not MIT).
- Uses core timeline and ScrollTrigger only. Plugin is registered, animations are context-scoped/reverted, and no paid plugin registration or key is required. Commercial website use is permitted under the reviewed license; competing visual animation builders have restrictions.

## Lenis

- React docs: https://github.com/darkroomengineering/lenis/tree/main/packages/react
- Source: https://github.com/darkroomengineering/lenis
- MIT, copyright darkroom.engineering. License retained in `licenses/Lenis.txt`.
- Uses actual `ReactLenis` and `LenisRef` from `lenis/react`, root mode, `autoRaf:false`, and the documented GSAP ticker callback (seconds × 1000). ScrollTrigger updates from Lenis scroll events. No competing RAF. Touch synchronization is disabled; reduced-motion users get no Lenis instance.

## React Bits SpotlightCard adaptation

- Reviewed TypeScript source: https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx
- Current license reviewed: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
- Copyright (c) 2026 David Haz. **MIT + Commons Clause**, retained in `licenses/ReactBits.txt`. It is not represented as unrestricted MIT. Integrated application use is permitted; standalone component/tool/export resale/redistribution has restrictions. Review the full text before repackaging as a template/component product.
- The current source includes pointer-relative radial gradients, optional themes/ambient/flare/grain, focus behavior, RAF smoothing, and cleanup. This project uses a deliberately simplified local adaptation of the pointer/gradient technique in `src/components/Effects.tsx`, with CSS in `main.css`; it does not pretend to install a React Bits npm API. No external component dependencies are required beyond React. Ambient/flare/grain and global pointer/RAF listeners are intentionally omitted. Reduced-motion/touch pointer motion is suppressed.

## 21st.dev / Aceternity Spotlight adaptation

- Discovered and inspected at https://21st.dev/@manuarora700/components/spotlight
- Primary documentation: https://ui.aceternity.com/components/spotlight
- Registry implementation entry inspected: https://ui.aceternity.com/registry/spotlight.json
- Published props: className and fill. Installation entry is `npx shadcn@latest add @aceternity/spotlight`; this project does not execute a registry installer or invent package props.
- The 21st listing identifies the component as MIT, author Manu Arora / Aceternity UI. The registry/source pattern uses a React SVG and class-name utility. This project adapts that SVG spotlight composition into a quiet mint ellipse with a unique React `useId` filter, direct CSS, and no Tailwind/classnames/Motion dependency. It is an adaptation of the actual pattern, not a claim that the entire registry component was copied verbatim.

MIT notice for adapted Aceternity component portions:

Copyright (c) Manu Arora / Aceternity UI contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Fonts, icons, and other libraries

- Inter Variable and JetBrains Mono: SIL OFL 1.1; full font license notices retained in `licenses/`.
- Lucide icons: ISC. Preserve upstream notice when redistributing dependency assets; npm package contains the full license.
- React/React DOM, Vite, TypeScript, Zod, react-markdown, rehype-highlight, ESLint, Vitest, Prettier, and axe-core retain their respective upstream licenses. These dependencies are installed from the lockfile rather than vendored as standalone components.
- Original grid, sphere, card illustrations, favicon, touch icon, and social image are project-specific artwork. No stock photos, third-party trackers, fabricated competition photos, or unsupported certificates are included.
