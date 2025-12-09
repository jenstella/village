import { useState } from 'react'
import '../App.css'
import { useData } from '../store/DataContext'
import type { Note } from '../types'

export function Notes() {
  const { notes, addNote } = useData()
  const [form, setForm] = useState({
    title: '',
    date: '',
    category: 'School' as Note['category'],
    summary: '',
    actionItems: '',
  })

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return
    addNote({
      id: crypto.randomUUID(),
      ...form,
    })
    setForm({
      title: '',
      date: '',
      category: 'School',
      summary: '',
      actionItems: '',
    })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notes & communications</h1>
          <p className="page-subtitle">
            Log incidents, calls, and actions so nothing slips.
          </p>
        </div>
      </div>

      <div className="section">
        <form className="form" onSubmit={handleAddNote}>
          <div className="field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Meeting recap, incident log..."
              required
            />
          </div>
          <div className="stack">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="note-date">Date</label>
              <input
                id="note-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="note-category">Category</label>
              <select
                id="note-category"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Note['category'],
                  })
                }
              >
                <option value="School">School</option>
                <option value="Home">Home</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="What happened? What was decided?"
            />
          </div>
          <div className="field">
            <label htmlFor="actions">Action items</label>
            <textarea
              id="actions"
              value={form.actionItems}
              onChange={(e) =>
                setForm({ ...form, actionItems: e.target.value })
              }
              placeholder="Follow-ups, who owns them, by when?"
            />
          </div>
          <button className="button" type="submit">
            Add note
          </button>
        </form>

        <div className="list">
          {notes.length === 0 ? (
            <div className="empty">
              No notes yet. Capture the next call, email, or incident.
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="card">
                <div className="meta">
                  <span className="tag">{note.category}</span>
                  {note.date && <span className="tag">{note.date}</span>}
                </div>
                <strong>{note.title}</strong>
                {note.summary && <p style={{ margin: 0 }}>{note.summary}</p>}
                {note.actionItems && (
                  <p style={{ margin: 0, color: '#0f172a' }}>
                    <strong>Actions:</strong> {note.actionItems}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes

