import { Link } from 'react-router-dom'
import '../App.css'
import type { Appointment, SchoolDoc, Note, Medication } from '../types'

type WidgetProps = {
  title: string
  to: string
  accent: 'blue' | 'purple' | 'teal' | 'amber' | 'green'
  items: Appointment[] | SchoolDoc[] | Note[] | Medication[]
  renderItem: (item: Appointment | SchoolDoc | Note | Medication) => React.ReactNode
  emptyMessage: string
  actionLabel: string
  actionTo: string
}

const accents: Record<WidgetProps['accent'], string> = {
  blue: '#38bdf8',
  purple: '#a78bfa',
  teal: '#2dd4bf',
  amber: '#fbbf24',
  green: '#10b981',
}

export function Widget({
  title,
  to,
  accent,
  items,
  renderItem,
  emptyMessage,
  actionLabel,
  actionTo,
}: WidgetProps) {
  const accentColor = accents[accent]
  const displayItems = items.slice(0, 3) // Show up to 3 items

  return (
    <div className="widget" style={{ borderTop: `4px solid ${accentColor}` }}>
      <div className="widget-header">
        <Link to={to} className="widget-title-link">
          <h3>{title}</h3>
        </Link>
        {items.length > 0 && (
          <span className="widget-count" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            {items.length}
          </span>
        )}
      </div>

      <div className="widget-content">
        {displayItems.length === 0 ? (
          <div className="widget-empty">{emptyMessage}</div>
        ) : (
          <div className="widget-items">
            {displayItems.map((item, idx) => (
              <div key={(item as Appointment | SchoolDoc | Note | Medication).id || idx} className="widget-item">
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="widget-footer">
        <Link to={to} className="widget-link">
          View all →
        </Link>
        <Link to={actionTo} className="widget-action">
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}

export default Widget

