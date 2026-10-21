import type { ContentRecord } from '../../content/schema'
import { parseTags } from '../../lib/validation'
type Props = {
  edit: ContentRecord
  setEdit: (record: ContentRecord) => void
  tagsText: string
  setTagsText: (text: string) => void
  formErrors: Record<string, string>
}
export function RecordFields({ edit, setEdit, tagsText, setTagsText, formErrors }: Props) {
  return (
    <>
      <div className="editor-grid">
        {(['id', 'title', 'summary', 'category', 'type', 'date', 'repository'] as const).map(
          (key) => (
            <div key={key}>
              <label>
                {key}
                {key === 'summary' ? (
                  <textarea
                    id={`edit-${key}`}
                    aria-invalid={Boolean(formErrors[key])}
                    aria-describedby={formErrors[key] ? `error-${key}` : undefined}
                    value={edit[key] || ''}
                    onChange={(e) => setEdit({ ...edit, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    id={`edit-${key}`}
                    aria-invalid={Boolean(formErrors[key])}
                    aria-describedby={formErrors[key] ? `error-${key}` : undefined}
                    value={edit[key] || ''}
                    onChange={(e) => setEdit({ ...edit, [key]: e.target.value || undefined })}
                  />
                )}
              </label>
              {formErrors[key] && (
                <span className="field-error" id={`error-${key}`}>
                  {formErrors[key]}
                </span>
              )}
            </div>
          ),
        )}
        <label>
          Tags (comma-separated)
          <input
            value={tagsText}
            onChange={(e) => {
              setTagsText(e.target.value)
              setEdit({ ...edit, tags: parseTags(e.target.value) })
            }}
          />
        </label>
        <label>
          Status
          <select
            value={edit.status}
            onChange={(e) => setEdit({ ...edit, status: e.target.value as 'draft' | 'published' })}
          >
            <option value="draft">Draft — excluded from public build</option>
            <option value="published">Published</option>
          </select>
        </label>
        {(['sample', 'featured'] as const).map((k) => (
          <label className="checkbox" key={k}>
            <input
              type="checkbox"
              checked={edit[k]}
              onChange={(e) => setEdit({ ...edit, [k]: e.target.checked })}
            />
            {k}
          </label>
        ))}
      </div>
      <label>
        Cover image URL (optional)
        <input
          value={edit.cover?.src || ''}
          onChange={(e) =>
            setEdit({
              ...edit,
              cover: e.target.value
                ? { src: e.target.value, alt: edit.cover?.alt || '' }
                : undefined,
            })
          }
        />
      </label>
      {edit.cover && (
        <label>
          Cover image alternative text (required)
          <input
            value={edit.cover.alt}
            onChange={(e) => setEdit({ ...edit, cover: { ...edit.cover!, alt: e.target.value } })}
          />
        </label>
      )}
      <h3>Case study / article sections</h3>
      {edit.sections.map((s, i) => (
        <fieldset key={i}>
          <legend>Section {i + 1}</legend>
          <label>
            Heading
            <input
              value={s.heading}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  sections: edit.sections.map((v, n) =>
                    n === i ? { ...v, heading: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <label>
            Body (Markdown)
            <textarea
              rows={6}
              value={s.body}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  sections: edit.sections.map((v, n) =>
                    n === i ? { ...v, body: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          {(['image', 'alt', 'caption'] as const).map((k) => (
            <label key={k}>
              {k}
              <input
                value={s[k] || ''}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    sections: edit.sections.map((v, n) =>
                      n === i ? { ...v, [k]: e.target.value } : v,
                    ),
                  })
                }
              />
            </label>
          ))}
          <button
            onClick={() => {
              if (confirm('Remove this section?'))
                setEdit({ ...edit, sections: edit.sections.filter((_, n) => n !== i) })
            }}
          >
            Remove section
          </button>
        </fieldset>
      ))}
      <button
        onClick={() =>
          setEdit({
            ...edit,
            sections: [...edit.sections, { heading: 'Overview', body: '' }],
          })
        }
      >
        + Add section
      </button>
      <h3>References</h3>
      {edit.references.map((r, i) => (
        <fieldset key={i}>
          <label>
            Label
            <input
              value={r.label}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  references: edit.references.map((v, n) =>
                    n === i ? { ...v, label: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <label>
            HTTPS URL
            <input
              value={r.url}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  references: edit.references.map((v, n) =>
                    n === i ? { ...v, url: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <button
            onClick={() => {
              if (confirm('Remove this reference?'))
                setEdit({ ...edit, references: edit.references.filter((_, n) => n !== i) })
            }}
          >
            Remove reference
          </button>
        </fieldset>
      ))}
      <button
        onClick={() =>
          setEdit({ ...edit, references: [...edit.references, { label: '', url: '' }] })
        }
      >
        + Add reference
      </button>
    </>
  )
}
