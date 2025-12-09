import { useState } from 'react'
import '../App.css'
import type { SchoolDoc } from '../types'

const seedDocs: SchoolDoc[] = [
  {
    id: 'd1',
    name: 'IEP 2024-2025',
    type: 'IEP',
    date: '2025-02-01',
    notes: 'Focus on executive functioning supports',
  },
  {
    id: 'd2',
    name: '504 Plan',
    type: '504',
    date: '2024-09-10',
    notes: 'Extended time and sensory breaks',
  },
]

export function SchoolDocs() {
  const [docs, setDocs] = useState<SchoolDoc[]>(seedDocs)
  const [form, setForm] = useState({
    name: '',
    type: 'IEP',
    date: '',
    notes: '',
  })

  const addDoc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    setDocs((prev) => [
      {
        id: crypto.randomUUID(),
        ...form,
      },
      ...prev,
    ])
    setForm({ name: '', type: 'IEP', date: '', notes: '' })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">School docs</h1>
          <p className="page-subtitle">
            Keep IEPs, 504s, evaluations, and meeting notes organized.
          </p>
        </div>
      </div>

      <div className="section">
        <form className="form" onSubmit={addDoc}>
          <div className="field">
            <label htmlFor="name">Document title</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="IEP 2025, OT eval..."
              required
            />
          </div>
          <div className="stack">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="IEP">IEP</option>
                <option value="504">504</option>
                <option value="Eval">Evaluation</option>
                <option value="Note">Meeting note</option>
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="doc-notes">Notes</label>
            <textarea
              id="doc-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Key highlights, goals, accommodations..."
            />
          </div>
          <button className="button" type="submit">
            Add document
          </button>
        </form>

        <div className="list">
          {docs.length === 0 ? (
            <div className="empty">
              No documents yet. Add one to keep everything together.
            </div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="card">
                <div className="meta">
                  <span className="tag">{doc.type}</span>
                  {doc.date && <span className="tag">{doc.date}</span>}
                </div>
                <strong>{doc.name}</strong>
                {doc.notes && <p style={{ margin: 0 }}>{doc.notes}</p>}
                <small style={{ color: '#64748b' }}>
                  (Upload disabled in prototype)
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SchoolDocs

