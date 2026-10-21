import { useRef, useState } from 'react'
import { RecordFields } from '../components/admin/RecordFields'
import { useUnsavedChanges } from '../hooks/useUnsavedChanges'
import { parseTags } from '../lib/validation'
import { Download, Plus, Trash2, Save, X, Eye } from 'lucide-react'
import raw from '../content/site.json'
import { siteSchema, recordSchema, type Site, type ContentRecord } from '../content/schema'
import { DetailContent } from './Detail'
type Group = 'projects' | 'articles' | 'achievements'
const groups: Group[] = ['projects', 'articles', 'achievements']
export default function Admin() {
  const [data, setData] = useState<Site>(() => siteSchema.parse(raw)),
    [tab, setTab] = useState('Overview'),
    [query, setQuery] = useState(''),
    [edit, setEdit] = useState<ContentRecord | null>(null),
    [oldId, setOldId] = useState(''),
    [settings, setSettings] = useState(''),
    [message, setMessage] = useState(''),
    [preview, setPreview] = useState(false),
    [dirty, setDirty] = useState(false),
    [tagsText, setTagsText] = useState(''),
    [settingsBaseline, setSettingsBaseline] = useState(''),
    [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const initialEdit = useRef('')
  const hasUnsavedForm =
    Boolean(
      edit &&
        (JSON.stringify(edit) !== initialEdit.current ||
          JSON.stringify(parseTags(tagsText)) !== JSON.stringify(edit.tags)),
    ) || settings !== settingsBaseline
  useUnsavedChanges(dirty || hasUnsavedForm)
  const group = tab.toLowerCase() as Group
  const isGroup = groups.includes(group)
  const tabs = [
    'Overview',
    'Projects',
    'Articles',
    'Achievements',
    'Profile',
    'Social links',
    'SEO',
    'Theme & settings',
    'Résumé',
  ]
  const settingsKey =
    tab === 'Profile' || tab === 'Social links' || tab === 'Résumé'
      ? 'profile'
      : tab === 'SEO'
        ? 'seo'
        : tab === 'Theme & settings'
          ? 'theme'
          : null
  function changeTab(t: string) {
    if (hasUnsavedForm && !confirm('Discard the unsaved form?')) return
    setTab(t)
    setEdit(null)
    setPreview(false)
    setMessage('')
    setFormErrors({})
    const k =
      t === 'Profile' || t === 'Social links' || t === 'Résumé'
        ? 'profile'
        : t === 'SEO'
          ? 'seo'
          : t === 'Theme & settings'
            ? 'theme'
            : null
    const text = k
      ? JSON.stringify(
          t === 'Theme & settings'
            ? {
                theme: data.theme,
                settings: data.settings,
                navigation: data.navigation,
                footer: data.footer,
                technologies: data.technologies,
                homepage: data.homepage,
              }
            : data[k],
          null,
          2,
        )
      : ''
    setSettings(text)
    setSettingsBaseline(text)
  }
  function update(next: Site) {
    setData(next)
    setDirty(true)
    setMessage(
      'Saved in this page’s memory. Export site.json to persist; this has not changed the live website.',
    )
  }
  function saveRecord() {
    const result = recordSchema.safeParse(edit ? { ...edit, tags: parseTags(tagsText) } : null)
    if (!result.success) {
      setFormErrors(
        Object.fromEntries(result.error.issues.map((i) => [i.path.join('.'), i.message])),
      )
      document.getElementById('edit-' + String(result.error.issues[0]?.path[0]))?.focus()
      setMessage(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
      return
    }
    const records = data[group]
    if (records.some((r) => r.id === result.data.id && r.id !== oldId)) {
      setMessage('That ID already exists.')
      return
    }
    const next = {
      ...data,
      [group]: oldId
        ? records.map((r) => (r.id === oldId ? result.data : r))
        : [...records, result.data],
    }
    const valid = siteSchema.safeParse(next)
    if (!valid.success) {
      setMessage(valid.error.message)
      return
    }
    update(valid.data)
    setFormErrors({})
    setEdit(null)
    setPreview(false)
  }
  function exportData() {
    if (
      hasUnsavedForm &&
      !confirm('This form has unsaved changes. Export only previously saved content?')
    )
      return
    const blob = new Blob([JSON.stringify(siteSchema.parse(data), null, 2) + '\n'], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site.json'
    a.click()
    URL.revokeObjectURL(url)
    setDirty(false)
    setMessage(
      'Downloaded site.json. Replace src/content/site.json, validate, review the diff, commit, and deploy. Drafts are omitted from the public build.',
    )
  }
  return (
    <section className="page section admin">
      <p className="eyebrow">LOCAL CONTENT WORKSPACE</p>
      <h1>
        Control center<span className="mint">.</span>
      </h1>
      <div className="sample-notice">
        <strong>Local editing utility — no authentication, no remote writes.</strong>
        <p>
          Changes stay in memory until exported. Never enter secrets or private engagement data.
          Reloading discards unexported edits. This editor is excluded from production builds.
        </p>
      </div>
      <div className="admin-toolbar">
        <span>{dirty ? '● Unexported changes' : 'Local session · no server account'}</span>
        <button className="button" onClick={exportData}>
          <Download size={16} /> Export site.json
        </button>
      </div>
      <div role="status" className="admin-message">
        {message}
      </div>
      <div className="admin-layout">
        <nav aria-label="Admin sections">
          {tabs.map((t) => (
            <button key={t} aria-pressed={t === tab} onClick={() => changeTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <div className="admin-content">
          <h2>{tab}</h2>
          {tab === 'Overview' && (
            <>
              <div className="stats">
                {groups.map((g) => (
                  <div key={g}>
                    <strong>{data[g].length}</strong>
                    <span>{g}</span>
                    <small>{data[g].filter((r) => r.status === 'draft').length} drafts</small>
                  </div>
                ))}
              </div>
              <h3>Publishing workflow</h3>
              <ol>
                <li>Edit a record or settings and save it in memory.</li>
                <li>Export site.json and replace src/content/site.json.</li>
                <li>Run npm run build and review publication status.</li>
                <li>Commit and push; GitHub Actions builds and deploys.</li>
              </ol>
              <p>
                Draft preview is local only. Export is a content backup, not a secure vault. No
                logout or session expiry is needed because this utility has no authenticated
                session.
              </p>
            </>
          )}
          {isGroup && !edit && (
            <>
              <div className="admin-toolbar">
                <input
                  aria-label="Search content"
                  placeholder="Search title or status…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  className="button secondary"
                  onClick={() => {
                    setOldId('')
                    setTagsText('')
                    setFormErrors({})
                    initialEdit.current = ''
                    setEdit({
                      id: 'new-entry',
                      title: 'New entry',
                      summary: 'Add a truthful summary.',
                      category: 'Other',
                      tags: [],
                      status: 'draft',
                      sample: false,
                      featured: false,
                      sections: [],
                      references: [],
                    })
                  }}
                >
                  <Plus size={16} /> Add record
                </button>
              </div>
              <div className="admin-records">
                {data[group]
                  .filter((r) =>
                    `${r.title} ${r.status}`.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((r) => (
                    <div key={r.id}>
                      <div>
                        <strong>{r.title}</strong>
                        <small>
                          {r.status} {r.sample ? '· sample' : ''}
                        </small>
                      </div>
                      <button
                        onClick={() => {
                          setEdit(structuredClone(r))
                          initialEdit.current = JSON.stringify(r)
                          setTagsText(r.tags.join(', '))
                          setFormErrors({})
                          setOldId(r.id)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        aria-label={`Move ${r.title} up`}
                        disabled={data[group].findIndex((x) => x.id === r.id) === 0}
                        onClick={() => {
                          const list = [...data[group]]
                          const i = list.findIndex((x) => x.id === r.id)
                          ;[list[i - 1], list[i]] = [list[i], list[i - 1]]
                          update({ ...data, [group]: list })
                        }}
                      >
                        ↑
                      </button>
                      <button
                        aria-label={`Delete ${r.title}`}
                        onClick={() => {
                          if (confirm(`Delete “${r.title}” from this local working copy?`))
                            update({ ...data, [group]: data[group].filter((x) => x.id !== r.id) })
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
              </div>
              {!data[group].length ? (
                <p>No records yet. Add your first entry.</p>
              ) : (
                !data[group].some((r) =>
                  `${r.title} ${r.status}`.toLowerCase().includes(query.toLowerCase()),
                ) && <p>No matching content. Try another search.</p>
              )}
            </>
          )}
          {isGroup && edit && (
            <>
              <RecordFields
                edit={edit}
                setEdit={setEdit}
                tagsText={tagsText}
                setTagsText={setTagsText}
                formErrors={formErrors}
              />
              <div className="admin-toolbar">
                <button className="button" onClick={saveRecord}>
                  <Save size={16} /> Save in memory
                </button>
                <button
                  onClick={() => {
                    if (confirm('Discard form changes?')) {
                      setEdit(null)
                      setPreview(false)
                    }
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button onClick={() => setPreview(!preview)}>
                  <Eye size={16} />
                  {preview ? 'Hide' : 'Show'} preview
                </button>
              </div>
              {preview && (
                <div className="draft-preview">
                  <p className="sample-notice">LOCAL PREVIEW — NOT PUBLISHED</p>
                  <DetailContent
                    preview
                    r={{ ...edit, tags: parseTags(tagsText) }}
                    kind={group === 'articles' ? 'research' : group}
                  />
                </div>
              )}
            </>
          )}
          {settingsKey && (
            <>
              <p>
                Validated JSON settings. Empty contact, social, and résumé fields are hidden
                publicly. Résumé: put the PDF in public/documents/, then set resume to
                documents/your-file.pdf. Theme settings include motion, sample visibility,
                navigation, footer, interests, and all homepage content/section switches.
              </p>
              <label>
                Settings JSON
                <textarea
                  className="json-editor"
                  rows={22}
                  value={settings}
                  onChange={(e) => setSettings(e.target.value)}
                  spellCheck={false}
                />
              </label>
              <div className="admin-toolbar">
                <button
                  className="button"
                  onClick={() => {
                    try {
                      const value = JSON.parse(settings)
                      const next =
                        tab === 'Theme & settings'
                          ? { ...data, ...value }
                          : { ...data, [settingsKey]: value }
                      update(siteSchema.parse(next))
                      setSettingsBaseline(settings)
                    } catch (e) {
                      setMessage(e instanceof Error ? e.message : 'Invalid settings')
                    }
                  }}
                >
                  Save settings in memory
                </button>
                <button onClick={() => changeTab(tab)}>Cancel changes</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
