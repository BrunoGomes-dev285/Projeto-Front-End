import { useState } from 'react';

export function CardStatus({ protocolo, ip, statusInicial = 'Inativo', onInteract }) {
  const [status, setStatus] = useState(statusInicial);

  const handleInteract = () => {
    const novoStatus = status === 'Ativo' ? 'Inativo' : 'Ativo';
    setStatus(novoStatus);
    
    // Dispara retorno para o componente pai, se fornecido
    if (onInteract) {
      onInteract({ protocolo, ip, novoStatus });
    }
  };

  return (
    <div className="card-status" style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
      <h3>Protocolo: {protocolo}</h3>
      <p>Target: <code>{ip}</code></p>
      <p>Status Atual: <strong>{status}</strong></p>
      
      <button onClick={handleInteract}>
        Interagir
      </button>
    </div>
  );
}