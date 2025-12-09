import { Link } from 'react-router-dom'
import '../App.css'

type TileProps = {
  title: string
  description: string
  to: string
  accent?: 'blue' | 'purple' | 'teal' | 'amber'
  count?: number
  actionLabel?: string
  actionTo?: string
}

const accents: Record<NonNullable<TileProps['accent']>, string> = {
  blue: '#38bdf8',
  purple: '#a78bfa',
  teal: '#2dd4bf',
  amber: '#fbbf24',
}

export function Tile({
  title,
  description,
  to,
  accent = 'blue',
  count,
  actionLabel = 'Add new',
  actionTo,
}: TileProps) {
  const accentColor = accents[accent]
  return (
    <div className="tile" style={{ borderTop: `4px solid ${accentColor}` }}>
      <div className="tile-head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {typeof count === 'number' && (
          <span className="pill" style={{ background: `${accentColor}22`, color: '#0f172a' }}>
            {count} items
          </span>
        )}
      </div>
      <div className="tile-actions">
        <Link to={to} className="button secondary">
          Open
        </Link>
        {actionTo && (
          <Link to={actionTo} className="button">
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

export default Tile

