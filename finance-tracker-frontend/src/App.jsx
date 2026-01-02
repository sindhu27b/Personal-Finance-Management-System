import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Expenses from './pages/Expenses.jsx'
import Income from './pages/Income.jsx'
import Investments from './pages/Investments.jsx'
import Reports from './pages/Reports.jsx'
import NavBar from './components/NavBar.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="*" element={<p className="text-center mt-5">Not Found</p>} />
        </Routes>
      </div>
    </>
  )
}
