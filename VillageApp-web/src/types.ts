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

