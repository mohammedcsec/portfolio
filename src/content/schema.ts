import { z } from 'zod'
import { isHttpsUrl, isPublicAsset, isCalendarDate } from '../lib/validation'
const externalLink = z.string().refine(isHttpsUrl, 'Use a complete HTTPS URL without credentials')
const assetLink = z
  .string()
  .refine(
    (v) => isHttpsUrl(v) || isPublicAsset(v),
    'Use HTTPS or an images/ or documents/ asset path',
  )
const optionalAsset = z.union([z.literal(''), assetLink])
const sectionSchema = z
  .object({
    heading: z.string().trim().min(1),
    body: z.string(),
    image: optionalAsset.optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })
  .superRefine((s, c) => {
    if (s.image && !s.alt?.trim())
      c.addIssue({
        code: 'custom',
        path: ['alt'],
        message: 'Provide alternative text for the section image',
      })
  })
const homepageSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    lines: z.array(z.string().min(1)).min(1).max(4),
    accent: z.string().min(1),
  }),
  sections: z.object({
    achievement: z.boolean(),
    projects: z.boolean(),
    technicalFocus: z.boolean(),
    workflow: z.boolean(),
    leadership: z.boolean(),
    research: z.boolean(),
    contact: z.boolean(),
  }),
  featuredAchievementId: z.string(),
  focus: z.array(
    z.object({
      icon: z.enum(['shield', 'scan', 'terminal']),
      title: z.string().min(1),
      text: z.string().min(1),
    }),
  ),
  workflow: z.object({
    title: z.string(),
    intro: z.string(),
    philosophy: z.string(),
    steps: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  leadership: z.object({ title: z.string(), body: z.string() }),
  contact: z.object({ title: z.string(), intro: z.string() }),
})
export const recordSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(180),
  summary: z.string().min(1).max(600),
  category: z.string().min(1),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published']),
  sample: z.boolean(),
  featured: z.boolean(),
  date: z
    .string()
    .refine(isCalendarDate, 'Use a real calendar date in YYYY-MM-DD format')
    .optional(),
  type: z.string().optional(),
  cover: z
    .object({ src: assetLink, alt: z.string().trim().min(1), caption: z.string().optional() })
    .optional(),
  repository: z.union([z.literal(''), externalLink]).optional(),
  sections: z.array(sectionSchema),
  references: z.array(z.object({ label: z.string().trim().min(1), url: externalLink })).default([]),
})
export const siteSchema = z
  .object({
    profile: z.object({
      name: z.string().min(1),
      headline: z.string(),
      intro: z.string(),
      bio: z.string(),
      focus: z.string(),
      goals: z.string(),
      email: z.union([z.literal(''), z.string().email()]),
      resume: optionalAsset,
      socials: z.array(z.object({ label: z.string().trim().min(1), url: externalLink })),
    }),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      siteUrl: z.union([
        z.literal(''),
        externalLink.refine((v) => {
          try {
            const u = new URL(v)
            return !u.search && !u.hash
          } catch {
            return false
          }
        }, 'The canonical root URL must not include a query or fragment'),
      ]),
    }),
    homepage: homepageSchema,
    theme: z.object({
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),
    settings: z.object({ showSamples: z.boolean(), motion: z.boolean() }),
    navigation: z.array(
      z.object({
        label: z.string(),
        path: z.enum(['/projects', '/research', '/achievements', '/about', '/contact']),
      }),
    ),
    footer: z.string(),
    technologies: z.array(z.string()),
    projects: z.array(recordSchema),
    articles: z.array(recordSchema),
    achievements: z.array(recordSchema),
  })
  .superRefine((s, c) => {
    for (const key of ['projects', 'articles', 'achievements'] as const) {
      const ids = s[key].map((r) => r.id)
      if (new Set(ids).size !== ids.length)
        c.addIssue({ code: 'custom', message: `Duplicate IDs in ${key}`, path: [key] })
    }
  })
export type Site = z.infer<typeof siteSchema>
export type ContentRecord = z.infer<typeof recordSchema>
