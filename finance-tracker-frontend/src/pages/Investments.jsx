import React, { useEffect, useState } from 'react'
import { listInvestments, createInvestment, updateInvestment, deleteInvestment } from '../api.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

function FieldErrors({ details }) {
  if (!details) return null
  return <ul className="text-danger small mb-2">
    {Object.entries(details).map(([k,v]) => <li key={k}><strong>{k}:</strong> {String(v)}</li>)}
  </ul>
}

export default function Investments() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ assetType: 'STOCK', symbol: '', quantity: '', avgBuyPrice: '', currentPrice: '' })
  const [details, setDetails] = useState(null)

  const load = async () => {
    setLoading(true); setError('')
    try { setItems(await listInvestments(token)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [token])

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const create = async (e) => {
    e.preventDefault()
    setDetails(null); setError('')
    try {
      await createInvestment(token, {
        ...form,
        quantity: Number(form.quantity),
        avgBuyPrice: Number(form.avgBuyPrice),
        currentPrice: Number(form.currentPrice)
      })
      setForm({ assetType: 'STOCK', symbol: '', quantity: '', avgBuyPrice: '', currentPrice: '' })
      await load()
    } catch (e) { setError(e.message); setDetails(e.details) }
  }
  const remove = async (id) => {
    if (!confirm('Delete this investment?')) return
    try { await deleteInvestment(token, id); await load() }
    catch (e) { alert(e.message) }
  }
  const save = async (it) => {
    try {
      await updateInvestment(token, it.id, {
        ...it,
        quantity: Number(it.quantity),
        avgBuyPrice: Number(it.avgBuyPrice),
        currentPrice: Number(it.currentPrice)
      })
      await load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="mt-3">
      <h4 className="mb-3">Investments</h4>
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <h6 className="mb-3">Add Investment</h6>
          {error && <div className='alert alert-danger'>{error}</div>}
          <FieldErrors details={details} />
          <form className="row g-2" onSubmit={create}>
            <div className="col-md-2"><label className="form-label required">Asset Type</label>
              <select name="assetType" className="form-select" value={form.assetType} onChange={onChange}>
                <option value="STOCK">STOCK</option>
                <option value="CRYPTO">CRYPTO</option>
                <option value="MUTUAL_FUND">MUTUAL_FUND</option>
                <option value="BOND">BOND</option>
              </select>
            </div>
            <div className="col-md-2"><label className="form-label required">Symbol</label><input name="symbol" className="form-control" value={form.symbol} onChange={onChange} required /></div>
            <div className="col-md-2"><label className="form-label required">Qty</label><input name="quantity" type="number" step="0.00000001" className="form-control" value={form.quantity} onChange={onChange} required /></div>
            <div className="col-md-3"><label className="form-label required">Avg Buy</label><input name="avgBuyPrice" type="number" step="0.01" className="form-control" value={form.avgBuyPrice} onChange={onChange} required /></div>
            <div className="col-md-3"><label className="form-label required">Current Price</label><input name="currentPrice" type="number" step="0.01" className="form-control" value={form.currentPrice} onChange={onChange} required /></div>
            <div className="col-12 text-end mt-2"><button className="btn btn-primary">Add</button></div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Your Investments</h6>
            <button className="btn btn-outline-secondary btn-sm" onClick={load}>Refresh</button>
          </div>
          {loading ? <p>Loading…</p> : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>ID</th><th>Type</th><th>Symbol</th><th>Qty</th><th>Avg Buy</th><th>Price</th><th></th></tr></thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>
                        <select className="form-select form-select-sm" value={it.assetType} onChange={e => it.assetType = e.target.value}>
                          <option value="STOCK">STOCK</option>
                          <option value="CRYPTO">CRYPTO</option>
                          <option value="MUTUAL_FUND">MUTUAL_FUND</option>
                          <option value="BOND">BOND</option>
                        </select>
                      </td>
                      <td><input className="form-control form-control-sm" value={it.symbol} onChange={e => it.symbol = e.target.value} /></td>
                      <td><input className="form-control form-control-sm" type="number" step="0.00000001" value={it.quantity} onChange={e => it.quantity = Number(e.target.value)} /></td>
                      <td><input className="form-control form-control-sm" type="number" step="0.01" value={it.avgBuyPrice} onChange={e => it.avgBuyPrice = Number(e.target.value)} /></td>
                      <td><input className="form-control form-control-sm" type="number" step="0.01" value={it.currentPrice} onChange={e => it.currentPrice = Number(e.target.value)} /></td>
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
