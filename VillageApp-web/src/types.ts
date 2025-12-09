export type Appointment = {
  id: string
  title: string
  date: string
  time: string
  provider: string
  location: string
  notes?: string
}

export type SchoolDoc = {
  id: string
  name: string
  type: string
  date: string
  notes?: string
}

export type Note = {
  id: string
  title: string
  date: string
  category: 'School' | 'Home' | 'Health'
  summary: string
  actionItems?: string
}

export type MedicationChangeType = 'started' | 'stopped' | 'increased' | 'decreased' | 'changed'

export type MedicationChange = {
  id: string
  date: string
  type: MedicationChangeType
  dosage?: string
  notes?: string
}

export type Medication = {
  id: string
  name: string
  currentDosage?: string
  frequency?: string
  prescriber?: string
  startDate?: string
  endDate?: string
  notes?: string
  changes: MedicationChange[]
}

