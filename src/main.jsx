import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App(){
  const [tab, setTab] = useState('home')
  const [apiBase, setApiBase] = useState(localStorage.getItem('API_BASE') || '')
  const [donations, setDonations] = useState([])

  function saveCfg(){
    localStorage.setItem('API_BASE', apiBase)
    alert('Configurações salvas.')
  }

  async function loadDonations(){
    if(!apiBase) return alert('Defina API_BASE nas Configurações.')
    const r = await fetch(apiBase.replace(/\/$/, '') + '/v1/donations')
    const j = await r.json()
    setDonations(j)
  }

  async function createDonation(){
    if(!apiBase) return alert('Defina API_BASE nas Configurações.')
    const r = await fetch(apiBase.replace(/\/$/, '') + '/v1/donations', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ donor_name:'Teste', gross_amount: 50, payment_method:'pix', status:'pending' })
    })
    const j = await r.json()
    alert('Doação criada (mock): ' + j.id)
    loadDonations()
  }

  return (
    <div className="wrap">
      <nav>
        <a className={tab==='home'?'active':''} href="#" onClick={()=>setTab('home')}>Resumo</a>
        <a className={tab==='donations'?'active':''} href="#" onClick={()=>setTab('donations')}>Doações</a>
        <a className={tab==='settings'?'active':''} href="#" onClick={()=>setTab('settings')}>Configurações</a>
      </nav>
      <main>
        {tab==='home' && (
          <section>
            <div className="card">
              <h2>Resumo</h2>
              <p className="muted">Conecte a API em “Configurações” para ver dados reais.</p>
              <div className="kpis">
                <div className="card"><b>Total Doado</b><div>R$ 0,00</div></div>
                <div className="card"><b>Repasses</b><div>R$ 0,00</div></div>
                <div className="card"><b>Saldo a Repassar</b><div>R$ 0,00</div></div>
                <div className="card"><b>Taxas</b><div>R$ 0,00</div></div>
              </div>
            </div>
          </section>
        )}
        {tab==='donations' && (
          <section>
            <div className="card">
              <h2>Doações</h2>
              <button className="btn" onClick={loadDonations}>Atualizar</button>
              <button className="btn" style={{marginLeft:8}} onClick={createDonation}>Criar Doação (mock)</button>
              <table style={{marginTop:12}}>
                <thead><tr><th>ID</th><th>Doador</th><th>Método</th><th>Status</th><th>Valor</th></tr></thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id}><td>{d.id}</td><td>{d.donor_name||'-'}</td><td>{d.payment_method}</td><td>{d.status}</td><td>{d.gross_amount}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {tab==='settings' && (
          <section>
            <div className="card">
              <h2>Configurações</h2>
              <div>
                <label>API_BASE</label><br/>
                <input style={{width:'100%', padding:'8px'}} value={apiBase} onChange={e=>setApiBase(e.target.value)} placeholder="https://doafacil-api.onrender.com" />
              </div>
              <button className="btn" style={{marginTop:12}} onClick={saveCfg}>Salvar</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
