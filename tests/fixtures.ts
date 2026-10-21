import { recordSchema } from '../src/content/schema'
export const fixtureRecord = recordSchema.parse({
  id: 'unit-test-record',
  title: 'Unit test record',
  summary: 'A non-public test fixture.',
  category: 'Web Security',
  tags: ['HTTP'],
  status: 'published',
  sample: true,
  featured: false,
  sections: [{ heading: 'Overview', body: 'Brief test content.' }],
  references: [],
})
