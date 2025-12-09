import { useState } from 'react'
import '../App.css'
import type { Appointment } from '../types'

const seedAppointments: Appointment[] = [
  {
    id: '1',
    title: 'OT Session',
    date: '2025-03-15',
    time: '3:30 PM',
    provider: 'Oak Therapy Center',
    location: 'Clinic',
    notes: 'Focus on sensory diet updates',
  },
  {
    id: '2',
    title: 'School Meeting',
    date: '2025-03-22',
    time: '9:00 AM',
    provider: 'Ms. Lopez',
    location: 'Elementary School',
    notes: 'Review accommodations for transitions',
  },
]

export function Appointments() {
  const [items, setItems] = useState<Appointment[]>(seedAppointments)
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    provider: '',
    location: '',
    notes: '',
  })

  const addAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.date) return
    const next: Appointment = {
      ...form,
      id: crypto.randomUUID(),
    }
    setItems((prev) => [next, ...prev])
    setForm({
      title: '',
      date: '',
      time: '',
      provider: '',
      location: '',
      notes: '',
    })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">
            Track therapy sessions and school meetings in one place.
          </p>
        </div>
      </div>

      <div className="section">
        <form className="form" onSubmit={addAppointment}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="IEP review, OT session..."
              required
            />
          </div>
          <div className="stack">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div className="stack">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="provider">Provider / Contact</label>
              <input
                id="provider"
                value={form.provider}
                onChange={(e) =>
                  setForm({ ...form, provider: e.target.value })
                }
                placeholder="Dr. Lee, Ms. Lopez..."
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="Clinic, School, Zoom..."
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Goals, questions, reminders..."
            />
          </div>
          <button className="button" type="submit">
            Add appointment
          </button>
        </form>

        <div className="list">
          {items.length === 0 ? (
            <div className="empty">
              No appointments yet. Add one to stay on top of the schedule.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="card">
                <div className="meta">
                  <span className="tag">Date: {item.date}</span>
                  {item.time && <span className="tag">Time: {item.time}</span>}
                  {item.provider && <span className="tag">{item.provider}</span>}
                </div>
                <strong>{item.title}</strong>
                <span>{item.location}</span>
                {item.notes && <p style={{ margin: 0 }}>{item.notes}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments

