import { createContext, useContext, useState, ReactNode } from 'react'
import type { Appointment, SchoolDoc, Note } from '../types'

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

const seedNotes: Note[] = [
  {
    id: 'n1',
    title: 'Recess incident follow-up',
    date: '2025-03-05',
    category: 'School',
    summary: 'Discussed peer conflict; teacher will monitor transitions.',
    actionItems: 'Check-in after recess, share calming strategies.',
  },
  {
    id: 'n2',
    title: 'OT home practice',
    date: '2025-03-02',
    category: 'Home',
    summary: 'Heavy work before homework improved focus.',
    actionItems: 'Keep 10-minute routine before seated tasks.',
  },
]

type DataContextType = {
  appointments: Appointment[]
  setAppointments: (appointments: Appointment[]) => void
  addAppointment: (appointment: Appointment) => void
  docs: SchoolDoc[]
  setDocs: (docs: SchoolDoc[]) => void
  addDoc: (doc: SchoolDoc) => void
  notes: Note[]
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)
  const [docs, setDocs] = useState<SchoolDoc[]>(seedDocs)
  const [notes, setNotes] = useState<Note[]>(seedNotes)

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev])
  }

  const addDoc = (doc: SchoolDoc) => {
    setDocs((prev) => [doc, ...prev])
  }

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev])
  }

  return (
    <DataContext.Provider
      value={{
        appointments,
        setAppointments,
        addAppointment,
        docs,
        setDocs,
        addDoc,
        notes,
        setNotes,
        addNote,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

