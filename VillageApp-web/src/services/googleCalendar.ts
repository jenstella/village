/**
 * Google Calendar Integration Service
 * 
 * To use this, you'll need to:
 * 1. Set up Google Cloud Console project
 * 2. Enable Google Calendar API
 * 3. Create OAuth 2.0 credentials
 * 4. Add your client ID to environment variables
 * 
 * For production, use environment variables:
 * VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
 */

import type { Appointment } from '../types'

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events'

export interface GoogleCalendarEvent {
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
}

/**
 * Initialize Google Calendar API
 * This will prompt user to authorize access
 */
export async function initGoogleCalendar(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not configured')
      resolve(false)
      return
    }

    // Load Google API script
    if (window.gapi) {
      handleAuthLoad(resolve)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client
          .init({
            clientId: GOOGLE_CLIENT_ID,
            scope: GOOGLE_SCOPES,
          })
          .then(() => {
            handleAuthLoad(resolve)
          })
          .catch(() => {
            console.error('Failed to initialize Google API')
            resolve(false)
          })
      })
    }
    document.head.appendChild(script)
  })
}

function handleAuthLoad(resolve: (value: boolean) => void) {
  const authInstance = window.gapi.auth2.getAuthInstance()
  if (authInstance.isSignedIn.get()) {
    resolve(true)
  } else {
    authInstance.signIn().then(() => resolve(true)).catch(() => resolve(false))
  }
}

/**
 * Check if user is signed in to Google Calendar
 */
export function isGoogleCalendarSignedIn(): boolean {
  if (!window.gapi) return false
  const authInstance = window.gapi.auth2.getAuthInstance()
  return authInstance?.isSignedIn.get() || false
}

/**
 * Sign out from Google Calendar
 */
export async function signOutGoogleCalendar(): Promise<void> {
  if (!window.gapi) return
  const authInstance = window.gapi.auth2.getAuthInstance()
  await authInstance.signOut()
}

/**
 * Convert Appointment to Google Calendar event format
 */
export function appointmentToGoogleEvent(
  appointment: Appointment
): GoogleCalendarEvent {
  const dateStr = appointment.date // YYYY-MM-DD format
  const timeStr = appointment.time || '09:00' // Default to 9 AM if no time

  // Parse time (handles both "3:30 PM" and "15:30" formats)
  let [hours, minutes] = timeStr.includes('PM') || timeStr.includes('AM')
    ? parse12HourTime(timeStr)
    : timeStr.split(':').map(Number)

  const startDateTime = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`)
  const endDateTime = new Date(startDateTime)
  endDateTime.setHours(endDateTime.getHours() + 1) // Default 1 hour duration

  return {
    summary: appointment.title,
    description: appointment.notes || undefined,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    location: appointment.location || undefined,
  }
}

function parse12HourTime(timeStr: string): [number, number] {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return [9, 0]

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return [hours, minutes]
}

/**
 * Create event in Google Calendar
 */
export async function createGoogleCalendarEvent(
  appointment: Appointment
): Promise<string | null> {
  if (!window.gapi || !isGoogleCalendarSignedIn()) {
    throw new Error('Not signed in to Google Calendar')
  }

  const event = appointmentToGoogleEvent(appointment)

  try {
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    })

    return response.result.id || null
  } catch (error) {
    console.error('Error creating Google Calendar event:', error)
    throw error
  }
}

/**
 * Sync all appointments to Google Calendar
 */
export async function syncAllToGoogleCalendar(
  appointments: Appointment[]
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (const appointment of appointments) {
    try {
      await createGoogleCalendarEvent(appointment)
      success++
    } catch (error) {
      console.error(`Failed to sync appointment ${appointment.id}:`, error)
      failed++
    }
  }

  return { success, failed }
}

// Type declarations for Google API
declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: () => void) => void
      client: {
        init: (config: {
          clientId: string
          scope: string
        }) => Promise<void>
        calendar: {
          events: {
            insert: (params: {
              calendarId: string
              resource: GoogleCalendarEvent
            }) => Promise<{ result: { id?: string } }>
          }
        }
      }
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean
          }
          signIn: () => Promise<void>
          signOut: () => Promise<void>
        }
      }
    }
  }
}

