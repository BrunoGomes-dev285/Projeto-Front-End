
// src/pages/Redes.jsx
import { CardStatus } from '../components/CardStatus';

export function Redes() {
  const listaRedes = [
    { id: 1, protocolo: 'BGP - Core Router SP', ip: '200.219.140.1', statusInicial: 'Ativo' },
    { id: 2, protocolo: 'OSPF - Backbone Central', ip: '10.0.40.254', statusInicial: 'Ativo' },
    { id: 3, protocolo: 'SNMP - Torre Rádio Sul', ip: '192.168.10.15', statusInicial: 'Inativo' },
    { id: 4, protocolo: 'GTP - Core 5G Data', ip: '172.16.0.88', statusInicial: 'Ativo' }
  ];

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Monitoramento Core & Rádio</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {listaRedes.map((rede) => (
          <CardStatus
            key={rede.id}
            protocolo={rede.protocolo}
            ip={rede.ip}
            statusInicial={rede.statusInicial}
          />
        ))}
      </div>
    </main>
  );
}

import { useState } from 'react';

export function CardStatus({ protocolo, ip, statusInicial = 'UP' }) {
  // Estado local para alternar entre 'UP' e 'DOWN'
  const [status, setStatus] = useState(statusInicial);

  function alternarConexao() {
    setStatus((prevStatus) => (prevStatus === 'UP' ? 'DOWN' : 'UP'));
  }

  return (
    <div className="card bg-light shadow mb-3">
      <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
        <span>{protocolo}</span>
        {/* Badge dinâmica com cor verde (UP) ou vermelha (DOWN) */}
        <span className={`badge ${status === 'UP' ? 'bg-success' : 'bg-danger'}`}>
          {status}
        </span>
      </div>
      <div className="card-body">
        <p className="card-text mb-3">
          <strong>Target:</strong> {ip}
        </p>
        {/* Botão com evento onClick e estilo dinâmico */}
        <button
          onClick={alternarConexao}
          className={`btn btn-sm ${status === 'UP' ? 'btn-outline-danger' : 'btn-outline-success'}`}
        >
          {status === 'UP' ? 'Simular Queda' : 'Restabelecer'}
        </button>
      </div>
    </div>
  );
}