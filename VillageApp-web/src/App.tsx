import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import SchoolDocs from './pages/SchoolDocs'
import Notes from './pages/Notes'
import AIHelper from './pages/AIHelper'
import Login from './pages/Login'

function Protected({ isAuthed, children }: { isAuthed: boolean; children: React.ReactNode }) {
  const location = useLocation()
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}

function App() {
  const [isAuthed, setIsAuthed] = useState(false)

  return (
    <Layout>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthed ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={() => setIsAuthed(true)} />
            )
          }
        />
        <Route
          path="/"
          element={
            <Protected isAuthed={isAuthed}>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/appointments"
          element={
            <Protected isAuthed={isAuthed}>
              <Appointments />
            </Protected>
          }
        />
        <Route
          path="/school-docs"
          element={
            <Protected isAuthed={isAuthed}>
              <SchoolDocs />
            </Protected>
          }
        />
        <Route
          path="/notes"
          element={
            <Protected isAuthed={isAuthed}>
              <Notes />
            </Protected>
          }
        />
        <Route
          path="/ai-helper"
          element={
            <Protected isAuthed={isAuthed}>
              <AIHelper />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
