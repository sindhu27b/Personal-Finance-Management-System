import React, { useEffect, useState } from 'react'
import { summary } from '../api.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Reports() {
  const { token } = useAuth()
  const today = new Date().toISOString().slice(0,10)
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10)

  const [start, setStart] = useState(firstOfMonth)
  const [end, setEnd] = useState(today)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const run = async () => {
    try { setData(await summary(token, start, end)); setError('') }
    catch (e) { setError(e.message || 'Failed') }
  }

  useEffect(() => { run() }, [])

  return (
    <div className="mt-3">
      <h4 className="mb-3">Reports</h4>
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Start</label>
              <input type="date" className="form-control" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">End</label>
              <input type="date" className="form-control" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
            <div className="col-md-3 d-flex align-items-end gap-2">
              <button className="btn btn-primary" onClick={run}>Run</button>
              <button className="btn btn-outline-secondary" onClick={() => { setStart(firstOfMonth); setEnd(today); setTimeout(run, 0) }}>This month</button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {data && (
        <div className="row g-3">
          <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><div className="text-secondary">Income</div><div className="fs-4 fw-bold">{data.income}</div></div></div></div>
          <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><div className="text-secondary">Expenses</div><div className="fs-4 fw-bold">{data.expenses}</div></div></div></div>
          <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><div className="text-secondary">Net</div><div className="fs-4 fw-bold">{data.net}</div></div></div></div>
          <div className="col-md-3"><div className="card shadow-sm"><div className="card-body"><div className="text-secondary">Investment Value</div><div className="fs-4 fw-bold">{data.investmentValue}</div></div></div></div>
        </div>
      )}
    </div>
  )
}
