const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function headers(token) {
  const h = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function handle(res) {
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText)
    err.status = res.status
    err.details = data?.details
    throw err
  }
  return data
}

// Auth
export async function registerApi(payload) {
  const res = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) })
  return handle(res)
}
export async function loginApi(payload) {
  const res = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) })
  return handle(res)
}

// Expenses
export async function listExpenses(token) {
  const res = await fetch(`${BASE}/api/expenses`, { headers: headers(token) }); return handle(res)
}
export async function createExpense(token, payload) {
  const res = await fetch(`${BASE}/api/expenses`, { method: 'POST', headers: headers(token), body: JSON.stringify(payload) }); return handle(res)
}
export async function updateExpense(token, id, payload) {
  const res = await fetch(`${BASE}/api/expenses/${id}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(payload) }); return handle(res)
}
export async function deleteExpense(token, id) {
  const res = await fetch(`${BASE}/api/expenses/${id}`, { method: 'DELETE', headers: headers(token) }); return handle(res)
}

// Income
export async function listIncome(token) {
  const res = await fetch(`${BASE}/api/income`, { headers: headers(token) }); return handle(res)
}
export async function createIncome(token, payload) {
  const res = await fetch(`${BASE}/api/income`, { method: 'POST', headers: headers(token), body: JSON.stringify(payload) }); return handle(res)
}
export async function updateIncome(token, id, payload) {
  const res = await fetch(`${BASE}/api/income/${id}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(payload) }); return handle(res)
}
export async function deleteIncome(token, id) {
  const res = await fetch(`${BASE}/api/income/${id}`, { method: 'DELETE', headers: headers(token) }); return handle(res)
}

// Investments
export async function listInvestments(token) {
  const res = await fetch(`${BASE}/api/investments`, { headers: headers(token) }); return handle(res)
}
export async function createInvestment(token, payload) {
  const res = await fetch(`${BASE}/api/investments`, { method: 'POST', headers: headers(token), body: JSON.stringify(payload) }); return handle(res)
}
export async function updateInvestment(token, id, payload) {
  const res = await fetch(`${BASE}/api/investments/${id}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(payload) }); return handle(res)
}
export async function deleteInvestment(token, id) {
  const res = await fetch(`${BASE}/api/investments/${id}`, { method: 'DELETE', headers: headers(token) }); return handle(res)
}

// Reports
export async function summary(token, start, end) {
  const qs = new URLSearchParams()
  if (start) qs.set('start', start)
  if (end) qs.set('end', end)
  const res = await fetch(`${BASE}/api/reports/summary${qs.toString() ? `?${qs}` : ''}`, { headers: headers(token) })
  return handle(res)
}
