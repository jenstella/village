import { Link } from 'react-router-dom'
import Widget from '../components/Widget'
import { useData } from '../store/DataContext'
import '../App.css'
import type { Appointment, SchoolDoc, Note } from '../types'

export function Dashboard() {
  const { appointments, docs, notes } = useData()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Parent Hub</h1>
          <p className="page-subtitle">
            Stay organized with school, appointments, notes, and AI support.
          </p>
        </div>
      </div>
      <div className="widget-grid">
        <Widget
          title="Appointments"
          to="/appointments"
          accent="blue"
          items={appointments}
          emptyMessage="No upcoming appointments"
          actionLabel="New appointment"
          actionTo="/appointments#new"
          renderItem={(item) => {
            const apt = item as Appointment
            return (
              <>
                <div className="widget-item-title">{apt.title}</div>
                <div className="widget-item-meta">
                  {formatDate(apt.date)} {apt.time && `• ${apt.time}`}
                </div>
                {apt.provider && (
                  <div className="widget-item-subtitle">{apt.provider}</div>
                )}
              </>
            )
          }}
        />
        <Widget
          title="School Docs"
          to="/school-docs"
          accent="purple"
          items={docs}
          emptyMessage="No documents yet"
          actionLabel="New doc"
          actionTo="/school-docs#new"
          renderItem={(item) => {
            const doc = item as SchoolDoc
            return (
              <>
                <div className="widget-item-title">{doc.name}</div>
                <div className="widget-item-meta">
                  <span className="widget-tag">{doc.type}</span>
                  {doc.date && ` • ${formatDate(doc.date)}`}
                </div>
                {doc.notes && (
                  <div className="widget-item-subtitle">{doc.notes}</div>
                )}
              </>
            )
          }}
        />
        <Widget
          title="Notes & Comms"
          to="/notes"
          accent="amber"
          items={notes}
          emptyMessage="No notes yet"
          actionLabel="New note"
          actionTo="/notes#new"
          renderItem={(item) => {
            const note = item as Note
            return (
              <>
                <div className="widget-item-title">{note.title}</div>
                <div className="widget-item-meta">
                  <span className="widget-tag">{note.category}</span>
                  {note.date && ` • ${formatDate(note.date)}`}
                </div>
                {note.summary && (
                  <div className="widget-item-subtitle">{note.summary}</div>
                )}
              </>
            )
          }}
        />
        <div className="widget" style={{ borderTop: '4px solid #2dd4bf' }}>
          <div className="widget-header">
            <h3>AI Helper</h3>
          </div>
          <div className="widget-content">
            <div className="widget-empty">
              Ask anything: summarize docs, draft emails, get guidance.
            </div>
          </div>
          <div className="widget-footer">
            <Link to="/ai-helper" className="widget-action">
              Try a prompt →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

