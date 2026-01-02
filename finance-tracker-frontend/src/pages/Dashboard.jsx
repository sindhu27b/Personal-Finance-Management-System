// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { summary, listIncome, listExpenses } from '../api.jsx'

import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

export default function Dashboard() {
  const { token, logout } = useAuth()
  const nav = useNavigate()

  // ---- Palette + inline styles ----
  const palette = {
    brand: '#cc6a00',
    subtitle: '#64748b',
    cardText: '#334155',
    green: '#16a34a',    // income
    red: '#e11d48',      // expenses
    blue: '#2563eb',     // net
    purple: '#7c3aed',   // investments
    bg: '#f1f5f9'
  }
  const shadow = '0 10px 24px rgba(15, 23, 42, .08)'
  const styles = {
    screen: { background: palette.bg, minHeight: 'calc(100vh - 56px)', padding: '24px 0' },
    headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: '1.75rem', fontWeight: 800, color: palette.brand, margin: 0 },
    subtitle: { color: palette.subtitle, fontSize: 16, marginTop: 4 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 },
    card: (color) => ({ background:'#fff', borderRadius:14, boxShadow:shadow, padding:16, borderTop:`5px solid ${color}` }),
    cardTitle: { color: palette.cardText, fontSize: 16, fontWeight: 700, marginBottom: 6 },
    value: (color) => ({ color, fontWeight: 800, fontSize: '1.75rem', letterSpacing: '.2px' }),
    section: { marginTop: 18 },
    chartCard: { background:'#fff', borderRadius:14, boxShadow:shadow, padding:16, height: 360 }
  }

  // ---- State ----
  const [sum, setSum] = useState(null)
  const [incomeList, setIncomeList] = useState([])
  const [expenseList, setExpenseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const [s, inc, exp] = await Promise.all([summary(token), listIncome(token), listExpenses(token)])
        if (!mounted) return
        setSum(s)
        setIncomeList(Array.isArray(inc) ? inc : [])
        setExpenseList(Array.isArray(exp) ? exp : [])
      } catch (e) { setErr(e.message || 'Failed to load dashboard') }
      finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [token])

  const fmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), [])
  const income = sum?.income ?? 0
  const expenses = sum?.expenses ?? 0
  const net = sum?.net ?? (income - expenses)
  const investments = sum?.investmentValue ?? 0

  // === Donut: Spending by Category ===
  const categoryPalette = [
    '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#06b6d4', '#84cc16', '#a855f7', '#fb7185', '#14b8a6'
  ]
  const withinPeriod = (dateStr) => {
    if (!sum?.period?.start || !sum?.period?.end) return true
    // compare as YYYY-MM-DD strings (safe if inputs are same format)
    return dateStr >= sum.period.start && dateStr <= sum.period.end
  }

  const donutData = useMemo(() => {
    const map = new Map() // category -> total
    for (const ex of expenseList) {
      if (!ex?.category || ex.amount == null || !ex?.date) continue
      if (!withinPeriod(String(ex.date))) continue
      const key = String(ex.category)
      map.set(key, (map.get(key) || 0) + Number(ex.amount || 0))
    }
    // convert to arr & sort desc
    let arr = Array.from(map, ([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value)
    // squash small ones into "Other" (keep top 7)
    if (arr.length > 7) {
      const top = arr.slice(0,7)
      const otherVal = arr.slice(7).reduce((s,x)=>s+x.value,0)
      if (otherVal > 0) top.push({ name: 'Other', value: otherVal })
      arr = top
    }
    return arr
  }, [expenseList, sum?.period])

  // === Bar: last 6 months Income vs Expenses ===
  function monthKey(d) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}` }
  function monthLabel(d) { return d.toLocaleString('en-US', { month: 'short' }) }

  const barData = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ key: monthKey(d), label: monthLabel(d), income: 0, expenses: 0 })
    }
    const idx = Object.fromEntries(months.map((m,i)=>[m.key,i]))
    for (const it of incomeList) {
      if (!it?.date || it.amount == null) continue
      const k = monthKey(new Date(it.date)); if (k in idx) months[idx[k]].income += Number(it.amount)||0
    }
    for (const it of expenseList) {
      if (!it?.date || it.amount == null) continue
      const k = monthKey(new Date(it.date)); if (k in idx) months[idx[k]].expenses += Number(it.amount)||0
    }
    return months.map(m => ({ month: m.label, income: m.income, expenses: m.expenses }))
  }, [incomeList, expenseList])

  const onLogout = () => { logout(); nav('/login') }

  return (
    <div style={styles.screen}>
      <div className="container">
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <div style={styles.subtitle}>Track your expenses, income, investments & savings.</div>
          </div>
          {/* If you also want a page-level logout: */}
          {/* <button onClick={onLogout} style={{ background:'#ef4444', border:'1px solid #ef4444', color:'#fff', padding:'10px 18px', borderRadius:12, fontWeight:700, cursor:'pointer' }}>Logout</button> */}
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {/* Stat cards */}
        <div style={styles.grid}>
          <div style={styles.card(palette.green)}>
            <div style={styles.cardTitle}>Total Income</div>
            <div style={styles.value(palette.green)}>{loading ? '—' : fmt.format(income)}</div>
          </div>
          <div style={styles.card(palette.red)}>
            <div style={styles.cardTitle}>Total Expenses</div>
            <div style={styles.value(palette.red)}>{loading ? '—' : fmt.format(expenses)}</div>
          </div>
          <div style={styles.card(palette.blue)}>
            <div style={styles.cardTitle}>Net Savings</div>
            <div style={styles.value(palette.blue)}>{loading ? '—' : fmt.format(net)}</div>
          </div>
          <div style={styles.card(palette.purple)}>
            <div style={styles.cardTitle}>Investment Value</div>
            <div style={styles.value(palette.purple)}>{loading ? '—' : fmt.format(investments)}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="row" style={styles.section}>
          {/* Donut: Spending by Category */}
          <div className="col-12 col-lg-6 mb-3">
            <div style={styles.chartCard}>
              <h6 className="mb-3" style={{ fontWeight: 700, color: palette.cardText }}>Spending by Category</h6>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}      // <-- donut
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={`dcell-${i}`} fill={categoryPalette[i % categoryPalette.length]} />
                    ))}
                  </Pie>
                  <PieTooltip formatter={(v) => fmt.format(v)} />
                  <PieLegend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar: Income vs Expenses (Last 6 Months) */}
          <div className="col-12 col-lg-6 mb-3">
            <div style={styles.chartCard}>
              <h6 className="mb-3" style={{ fontWeight: 700, color: palette.cardText }}>Income vs Expenses (Last 6 Months)</h6>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => fmt.format(v)} />
                  <Legend />
                  <Bar dataKey="income" fill={palette.green} radius={[6,6,0,0]} />
                  <Bar dataKey="expenses" fill={palette.red} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Period info */}
        {sum?.period && (
          <div className="text-muted mt-2" style={{ color: '#94a3b8' }}>
            Period: {sum.period.start} → {sum.period.end}
          </div>
        )}
      </div>
    </div>
  )
}
