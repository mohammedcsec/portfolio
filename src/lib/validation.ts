/** Public links must be complete HTTPS URLs without embedded credentials. */
export function isHttpsUrl(value: string): boolean {
  if (
    !value.startsWith('https://') ||
    /[\s\\]/.test(value) ||
    [...value].some((char) => char.charCodeAt(0) < 32)
  )
    return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password
  } catch {
    return false
  }
}
export function isPublicAsset(value: string): boolean {
  return (
    /^(documents|images)\/[a-zA-Z0-9._/-]+$/.test(value) &&
    !value.includes('..') &&
    !value.includes('//')
  )
}
export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}
export const parseTags = (text: string) => [
  ...new Set(
    text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  ),
]
