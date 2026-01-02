import React, { useEffect, useState } from 'react'
import { listIncome, createIncome, updateIncome, deleteIncome } from '../api.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

function FieldErrors({ details }) {
  if (!details) return null
  return <ul className="text-danger small mb-2">
    {Object.entries(details).map(([k,v]) => <li key={k}><strong>{k}:</strong> {String(v)}</li>)}
  </ul>
}

export default function Income() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ amount: '', source: '', date: '', description: '' })
  const [details, setDetails] = useState(null)

  const load = async () => {
    setLoading(true); setError('')
    try { setItems(await listIncome(token)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [token])

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const create = async (e) => {
    e.preventDefault()
    setDetails(null); setError('')
    try {
      await createIncome(token, { ...form, amount: Number(form.amount) })
      setForm({ amount: '', source: '', date: '', description: '' })
      await load()
    } catch (e) { setError(e.message); setDetails(e.details) }
  }
  const remove = async (id) => {
    if (!confirm('Delete this income item?')) return
    try { await deleteIncome(token, id); await load() }
    catch (e) { alert(e.message) }
  }
  const save = async (it) => {
    try { await updateIncome(token, it.id, it); await load() }
    catch (e) { alert(e.message) }
  }

  return (
    <div className="mt-3">
      <h4 className="mb-3">Income</h4>
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <h6 className="mb-3">Add Income</h6>
          {error && <div className='alert alert-danger'>{error}</div>}
          <FieldErrors details={details} />
          <form className="row g-2" onSubmit={create}>
            <div className="col-md-2"><label className="form-label required">Amount</label><input name="amount" className="form-control" value={form.amount} onChange={onChange} required /></div>
            <div className="col-md-3"><label className="form-label required">Source</label><input name="source" className="form-control" value={form.source} onChange={onChange} required /></div>
            <div className="col-md-3"><label className="form-label required">Date</label><input name="date" type="date" className="form-control" value={form.date} onChange={onChange} required /></div>
            <div className="col-md-3"><label className="form-label">Description</label><input name="description" className="form-control" value={form.description} onChange={onChange} /></div>
            <div className="col-md-1 d-flex align-items-end"><button className="btn btn-primary w-100">Add</button></div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Your Income</h6>
            <button className="btn btn-outline-secondary btn-sm" onClick={load}>Refresh</button>
          </div>
          {loading ? <p>Loading…</p> : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>ID</th><th>Amount</th><th>Source</th><th>Date</th><th>Description</th><th></th></tr></thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td><input className="form-control form-control-sm" type="number" step="0.01" value={it.amount} onChange={e => it.amount = Number(e.target.value)} /></td>
                      <td><input className="form-control form-control-sm" value={it.source} onChange={e => it.source = e.target.value} /></td>
                      <td><input className="form-control form-control-sm" type="date" value={it.date} onChange={e => it.date = e.target.value} /></td>
                      <td><input className="form-control form-control-sm" value={it.description || ''} onChange={e => it.description = e.target.value} /></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => save(it)}>Save</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
