import { useState } from 'react'
import '../App.css'
import { useData } from '../store/DataContext'
import type { Medication, MedicationChange, MedicationChangeType } from '../types'

export function Medications() {
  const { medications, addMedication, addMedicationChange } = useData()
  const [form, setForm] = useState({
    name: '',
    currentDosage: '',
    frequency: '',
    prescriber: '',
    startDate: '',
    notes: '',
  })
  const [changeForm, setChangeForm] = useState<{
    medicationId: string | null
    date: string
    type: MedicationChangeType
    dosage: string
    notes: string
  }>({
    medicationId: null,
    date: '',
    type: 'started',
    dosage: '',
    notes: '',
  })

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return

    const newMedication: Medication = {
      id: crypto.randomUUID(),
      name: form.name,
      currentDosage: form.currentDosage || undefined,
      frequency: form.frequency || undefined,
      prescriber: form.prescriber || undefined,
      startDate: form.startDate || undefined,
      notes: form.notes || undefined,
      changes: form.startDate
        ? [
            {
              id: crypto.randomUUID(),
              date: form.startDate,
              type: 'started',
              dosage: form.currentDosage || undefined,
              notes: form.notes || undefined,
            },
          ]
        : [],
    }

    addMedication(newMedication)
    setForm({
      name: '',
      currentDosage: '',
      frequency: '',
      prescriber: '',
      startDate: '',
      notes: '',
    })
  }

  const handleAddChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!changeForm.medicationId || !changeForm.date) return

    const change: MedicationChange = {
      id: crypto.randomUUID(),
      date: changeForm.date,
      type: changeForm.type,
      dosage: changeForm.dosage || undefined,
      notes: changeForm.notes || undefined,
    }

    addMedicationChange(changeForm.medicationId, change)
    setChangeForm({
      medicationId: null,
      date: '',
      type: 'started',
      dosage: '',
      notes: '',
    })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getChangeTypeLabel = (type: MedicationChangeType) => {
    switch (type) {
      case 'started':
        return 'Started'
      case 'stopped':
        return 'Stopped'
      case 'increased':
        return 'Increased'
      case 'decreased':
        return 'Decreased'
      case 'changed':
        return 'Changed'
    }
  }

  const getChangeTypeColor = (type: MedicationChangeType) => {
    switch (type) {
      case 'started':
        return '#10b981'
      case 'stopped':
        return '#ef4444'
      case 'increased':
        return '#f59e0b'
      case 'decreased':
        return '#3b82f6'
      case 'changed':
        return '#8b5cf6'
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Medications</h1>
          <p className="page-subtitle">
            Track medications, dosages, and changes over time.
          </p>
        </div>
      </div>

      <div className="section">
        <form className="form" onSubmit={handleAddMedication}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Add Medication</h3>
          <div className="field">
            <label htmlFor="med-name">Medication Name *</label>
            <input
              id="med-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Adderall XR, Prozac..."
              required
            />
          </div>
          <div className="stack">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="med-dosage">Current Dosage</label>
              <input
                id="med-dosage"
                value={form.currentDosage}
                onChange={(e) => setForm({ ...form, currentDosage: e.target.value })}
                placeholder="e.g., 10mg, 2 tablets..."
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="med-frequency">Frequency</label>
              <input
                id="med-frequency"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                placeholder="e.g., Once daily, Twice daily..."
              />
            </div>
          </div>
          <div className="stack">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="med-prescriber">Prescriber</label>
              <input
                id="med-prescriber"
                value={form.prescriber}
                onChange={(e) => setForm({ ...form, prescriber: e.target.value })}
                placeholder="Dr. Smith..."
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="med-start-date">Start Date</label>
              <input
                id="med-start-date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="med-notes">Notes</label>
            <textarea
              id="med-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Side effects, timing, special instructions..."
            />
          </div>
          <button className="button" type="submit">
            Add Medication
          </button>
        </form>

        {medications.length > 0 && (
          <form className="form" onSubmit={handleAddChange} style={{ marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Log Medication Change</h3>
            <div className="stack">
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="change-medication">Medication *</label>
                <select
                  id="change-medication"
                  value={changeForm.medicationId || ''}
                  onChange={(e) =>
                    setChangeForm({ ...changeForm, medicationId: e.target.value || null })
                  }
                  required
                >
                  <option value="">Select medication...</option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="change-date">Date *</label>
                <input
                  id="change-date"
                  type="date"
                  value={changeForm.date}
                  onChange={(e) => setChangeForm({ ...changeForm, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="stack">
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="change-type">Change Type *</label>
                <select
                  id="change-type"
                  value={changeForm.type}
                  onChange={(e) =>
                    setChangeForm({
                      ...changeForm,
                      type: e.target.value as MedicationChangeType,
                    })
                  }
                  required
                >
                  <option value="started">Started</option>
                  <option value="stopped">Stopped</option>
                  <option value="increased">Increased</option>
                  <option value="decreased">Decreased</option>
                  <option value="changed">Changed</option>
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="change-dosage">New Dosage</label>
                <input
                  id="change-dosage"
                  value={changeForm.dosage}
                  onChange={(e) => setChangeForm({ ...changeForm, dosage: e.target.value })}
                  placeholder="e.g., 15mg, 1 tablet..."
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="change-notes">Notes</label>
              <textarea
                id="change-notes"
                value={changeForm.notes}
                onChange={(e) => setChangeForm({ ...changeForm, notes: e.target.value })}
                placeholder="Reason for change, side effects, etc..."
              />
            </div>
            <button className="button" type="submit">
              Log Change
            </button>
          </form>
        )}

        <div className="list" style={{ marginTop: '20px' }}>
          {medications.length === 0 ? (
            <div className="empty">
              No medications tracked yet. Add one to get started.
            </div>
          ) : (
            medications.map((med) => (
              <div key={med.id} className="card">
                <div className="meta">
                  <span className="tag" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                    {med.currentDosage || 'No dosage'}
                  </span>
                  {med.frequency && (
                    <span className="tag" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                      {med.frequency}
                    </span>
                  )}
                  {med.startDate && (
                    <span className="tag">Started: {formatDate(med.startDate)}</span>
                  )}
                  {med.endDate && (
                    <span className="tag" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                      Stopped: {formatDate(med.endDate)}
                    </span>
                  )}
                </div>
                <strong style={{ fontSize: '16px' }}>{med.name}</strong>
                {med.prescriber && (
                  <span style={{ color: '#64748b', fontSize: '14px' }}>
                    Prescribed by: {med.prescriber}
                  </span>
                )}
                {med.notes && <p style={{ margin: '8px 0 0 0' }}>{med.notes}</p>}

                {med.changes.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <strong style={{ fontSize: '13px', color: '#475569' }}>Change History:</strong>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {med.changes
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((change) => (
                          <div
                            key={change.id}
                            style={{
                              padding: '8px 12px',
                              background: '#f8fafc',
                              borderRadius: '8px',
                              borderLeft: `3px solid ${getChangeTypeColor(change.type)}`,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: getChangeTypeColor(change.type),
                                }}
                              >
                                {getChangeTypeLabel(change.type)}
                              </span>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>
                                {formatDate(change.date)}
                              </span>
                            </div>
                            {change.dosage && (
                              <div style={{ fontSize: '12px', color: '#475569' }}>
                                Dosage: {change.dosage}
                              </div>
                            )}
                            {change.notes && (
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                {change.notes}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Medications

