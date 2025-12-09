import { useState, useEffect } from 'react'
import { useData } from '../store/DataContext'
import {
  initGoogleCalendar,
  isGoogleCalendarSignedIn,
  signOutGoogleCalendar,
  syncAllToGoogleCalendar,
} from '../services/googleCalendar'
import '../App.css'
import type { Appointment, SchoolDoc, Note } from '../types'

type CalendarEvent = {
  id: string
  title: string
  date: string
  time?: string
  type: 'appointment' | 'doc' | 'note' | 'medication'
  color: string
  details?: string
}

export function Calendar() {
  const { appointments, docs, notes, medications } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setIsGoogleConnected(isGoogleCalendarSignedIn())
  }, [])

  const handleGoogleConnect = async () => {
    const success = await initGoogleCalendar()
    setIsGoogleConnected(success)
  }

  const handleGoogleDisconnect = async () => {
    await signOutGoogleCalendar()
    setIsGoogleConnected(false)
  }

  const handleSyncToGoogle = async () => {
    setIsSyncing(true)
    try {
      const result = await syncAllToGoogleCalendar(appointments)
      alert(
        `Synced ${result.success} appointment(s) to Google Calendar${result.failed > 0 ? ` (${result.failed} failed)` : ''}`
      )
    } catch (error) {
      alert('Failed to sync. Please make sure you are connected to Google Calendar.')
    } finally {
      setIsSyncing(false)
    }
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get all events from all sources
  const getAllEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = []

    appointments.forEach((apt) => {
      events.push({
        id: apt.id,
        title: apt.title,
        date: apt.date,
        time: apt.time,
        type: 'appointment',
        color: '#38bdf8',
        details: `${apt.provider}${apt.location ? ` • ${apt.location}` : ''}`,
      })
    })

    docs.forEach((doc) => {
      if (doc.date) {
        events.push({
          id: doc.id,
          title: doc.name,
          date: doc.date,
          type: 'doc',
          color: '#a78bfa',
          details: `${doc.type}${doc.notes ? ` • ${doc.notes}` : ''}`,
        })
      }
    })

    notes.forEach((note) => {
      if (note.date) {
        events.push({
          id: note.id,
          title: note.title,
          date: note.date,
          type: 'note',
          color: '#fbbf24',
          details: `${note.category}${note.summary ? ` • ${note.summary}` : ''}`,
        })
      }
    })

    // Add medication changes
    medications.forEach((med) => {
      med.changes.forEach((change) => {
        const changeTypeLabels: Record<string, string> = {
          started: 'Started',
          stopped: 'Stopped',
          increased: 'Increased',
          decreased: 'Decreased',
          changed: 'Changed',
        }
        events.push({
          id: `${med.id}-${change.id}`,
          title: `${med.name} - ${changeTypeLabels[change.type] || change.type}`,
          date: change.date,
          type: 'medication',
          color: '#10b981',
          details: `${change.dosage ? `Dosage: ${change.dosage}` : ''}${change.notes ? ` • ${change.notes}` : ''}`.trim(),
        })
      })
    })

    return events.sort((a, b) => a.date.localeCompare(b.date))
  }

  const events = getAllEvents()

  // Get events for a specific date - normalize date format for comparison
  const getEventsForDate = (dateStr: string) => {
    // Normalize both dates to YYYY-MM-DD format for comparison
    const normalizedDateStr = dateStr
    return events.filter((e) => {
      // Ensure event date is in YYYY-MM-DD format
      const eventDate = e.date.split('T')[0] // Handle datetime strings
      return eventDate === normalizedDateStr
    })
  }

  // Calendar grid helpers
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const formatDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      new Date(year, month + (direction === 'next' ? 1 : -1), 1)
    )
    setSelectedDate(null)
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Get unique months that have events
  const eventMonths = events.length > 0
    ? events
      .map((e) => {
        const d = new Date(e.date)
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      })
      .filter((v, i, a) => a.indexOf(v) === i)
    : []

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">
            See all appointments, documents, and notes in one place.
          </p>
        </div>
      </div>

      {appointments.length > 0 && (
        <div className="google-calendar-sync">
          <div className="google-calendar-sync-header">
            <div className="google-calendar-status">
              <div
                className={`status-indicator ${isGoogleConnected ? 'connected' : 'disconnected'}`}
              />
              <span>
                Google Calendar:{' '}
                {isGoogleConnected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {isGoogleConnected ? (
                <>
                  <button
                    className="button"
                    onClick={handleSyncToGoogle}
                    disabled={isSyncing}
                  >
                    {isSyncing ? 'Syncing...' : 'Sync Appointments'}
                  </button>
                  <button
                    className="button"
                    onClick={handleGoogleDisconnect}
                    style={{ background: '#fee2e2', color: '#dc2626' }}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button className="button" onClick={handleGoogleConnect}>
                  Connect Google Calendar
                </button>
              )}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            {isGoogleConnected
              ? 'Your appointments will sync to your Google Calendar. Click "Sync Appointments" to add them now.'
              : 'Connect your Google Calendar to sync appointments automatically.'}
          </p>
        </div>
      )}

      <div className="page-header">
        <div className="calendar-controls">
          <button
            className="button-icon"
            onClick={() => navigateMonth('prev')}
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 style={{ margin: 0, minWidth: '200px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </h2>
          <button
            className="button-icon"
            onClick={() => navigateMonth('next')}
            aria-label="Next month"
          >
            →
          </button>
          <button
            className="button"
            onClick={() => setCurrentDate(new Date())}
            style={{ marginLeft: '12px' }}
          >
            Today
          </button>
        </div>
      </div>

      <div className="calendar-container">
          <div className="calendar-grid">
            {dayNames.map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}

            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="calendar-day empty" />
              }

              const dateKey = formatDateKey(day)
              const dayEvents = getEventsForDate(dateKey)
              const isToday =
                dateKey ===
                `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
              const isSelected = selectedDate === dateKey

              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(dateKey)}
                >
                  <div className="calendar-day-number">{day}</div>
                  <div className="calendar-day-events">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="calendar-event-dot"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="calendar-event-more">
                        +{dayEvents.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedDate && (
            <div className="calendar-sidebar">
              <div className="calendar-sidebar-header">
                <h3>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <button
                  className="button-icon-small"
                  onClick={() => setSelectedDate(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="calendar-events-list">
                {selectedEvents.length === 0 ? (
                  <div className="empty">No events on this day</div>
                ) : (
                  selectedEvents.map((event) => (
                    <div key={event.id} className="calendar-event-card">
                      <div
                        className="calendar-event-indicator"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="calendar-event-content">
                        <div className="calendar-event-title">{event.title}</div>
                        {event.time && (
                          <div className="calendar-event-time">{event.time}</div>
                        )}
                        {event.details && (
                          <div className="calendar-event-details">
                            {event.details}
                          </div>
                        )}
                      <div className="calendar-event-type">
                        {event.type === 'appointment' && '📅 Appointment'}
                        {event.type === 'doc' && '📄 Document'}
                        {event.type === 'note' && '📝 Note'}
                        {event.type === 'medication' && '💊 Medication Change'}
                      </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: '#38bdf8' }}
            />
            <span>Appointments ({appointments.length})</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: '#a78bfa' }}
            />
            <span>Documents ({docs.filter(d => d.date).length})</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: '#fbbf24' }}
            />
            <span>Notes ({notes.filter(n => n.date).length})</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: '#10b981' }}
            />
            <span>Medications ({medications.reduce((sum, m) => sum + m.changes.length, 0)})</span>
          </div>
          <div className="legend-item" style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
            Total events: {events.length}
          </div>
        </div>

      {eventMonths.length > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>
          <strong>Tip:</strong> Your events are in {eventMonths.join(', ')}.
          Navigate to those months to see them on the calendar.
        </div>
      )}
    </div>
  )
}

export default Calendar

