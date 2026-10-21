import { isValidElement, type ReactNode } from 'react'
/** Preserve exact text across react-markdown/rehype-highlight's nested spans. */
export function reactText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return reactText(node.props.children)
  return ''
}
