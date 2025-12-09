import Tile from '../components/Tile'
import '../App.css'

export function Dashboard() {
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
      <div className="grid">
        <Tile
          title="School Docs"
          description="Store IEP/504 docs, meeting notes, and track deadlines."
          to="/school-docs"
          accent="purple"
          count={2}
          actionLabel="New doc"
          actionTo="/school-docs#new"
        />
        <Tile
          title="Appointments"
          description="See upcoming OT, speech, psych visits and add new ones."
          to="/appointments"
          accent="blue"
          count={2}
          actionLabel="New appointment"
          actionTo="/appointments#new"
        />
        <Tile
          title="Notes & Comms"
          description="Log incidents, communications, and action items."
          to="/notes"
          accent="amber"
          count={2}
          actionLabel="New note"
          actionTo="/notes#new"
        />
        <Tile
          title="AI Helper"
          description="Ask anything: summarize docs, draft emails, get guidance."
          to="/ai-helper"
          accent="teal"
          count={4}
          actionLabel="Try a prompt"
          actionTo="/ai-helper"
        />
      </div>
    </div>
  )
}

export default Dashboard

