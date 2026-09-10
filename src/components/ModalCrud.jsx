import React, { useState, useEffect, useRef } from 'react';

export function ModalCrud({ fechar, frota, atualizarDados }) {
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    id: '',
    tipo: 'Carro',
    modelo: '',
    vel: 0,
    latitude: -23.5258,
    longitude: -46.7348
  });

  // Estado dos logs embutidos
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), type: 'SYS', msg: 'Módulo CRUD & Terminal inicializado.', color: 'text-info' },
    { id: 2, time: new Date().toLocaleTimeString(), type: 'SQL', msg: `Banco ativo com ${frota.length} veículos carregados.`, color: 'text-success' }
  ]);

  const terminalEndRef = useRef(null);

  const adicioneLog = (type, msg, color = 'text-info') => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), type, msg, color }
    ]);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const categorias = ['Ônibus', 'Caminhão', 'Moto', 'Carro', 'Caminhonete', 'Van', 'SUV', 'Esportivo', 'Trator', 'Ambulância'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (veiculo) => {
    setEditandoId(veiculo.id);
    setForm({
      id: veiculo.id,
      tipo: veiculo.tipo,
      modelo: veiculo.modelo || '',
      vel: veiculo.vel || 0,
      latitude: veiculo.latitude || -23.5258,
      longitude: veiculo.longitude || -46.7348
    });
    adicioneLog('EDIT', `Carregando dados do veículo ${veiculo.id} no formulário...`, 'text-warning');
  };

  const resetForm = () => {
    setEditandoId(null);
    setForm({ id: '', tipo: 'Carro', modelo: '', vel: 0, latitude: -23.5258, longitude: -46.7348 });
    adicioneLog('SYS', 'Formulário resetado.', 'text-secondary');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editandoId 
      ? `http://localhost:3000/api/frota/${editandoId}` 
      : 'http://localhost:3000/api/frota';
    const method = editandoId ? 'PUT' : 'POST';

    adicioneLog('HTTP', `Enviando ${method} para ${url}...`, 'text-info');

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        if (editandoId) {
          adicioneLog('SQL', `[200 OK] Veículo ${form.id} atualizado com sucesso!`, 'text-success');
        } else {
          adicioneLog('SQL', `[201 CREATED] Veículo ${form.id} (${form.tipo}) cadastrado com sucesso!`, 'text-success');
        }
        atualizarDados();
        resetForm();
      } else {
        adicioneLog('ERR', `[${res.status}] Falha ao salvar veículo ${form.id}.`, 'text-danger');
        alert('Erro ao salvar veículo no servidor.');
      }
    } catch (err) {
      console.error(err);
      adicioneLog('ERR', 'Erro de conexão com a API Node backend.', 'text-danger');
      alert('Falha na conexão com o backend.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Deseja remover o veículo ${id}?`)) return;
    adicioneLog('DELETE', `Enviando requisição DELETE para /api/frota/${id}...`, 'text-warning');
    try {
      const res = await fetch(`http://localhost:3000/api/frota/${id}`, { method: 'DELETE' });
      if (res.ok) {
        adicioneLog('SQL', `[200 OK] Veículo ${id} removido do banco de dados!`, 'text-danger');
        atualizarDados();
      } else {
        adicioneLog('ERR', `[${res.status}] Erro ao excluir veículo ${id}.`, 'text-danger');
        alert('Erro ao excluir veículo.');
      }
    } catch (err) {
      console.error(err);
      adicioneLog('ERR', 'Erro de conexão ao tentar excluir veículo.', 'text-danger');
      alert('Falha na conexão com o backend.');
    }
  };

  return (
    <div className="modal show d-block bg-black bg-opacity-75" style={{ zIndex: 1050 }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content bg-dark text-white border border-info">
          
          <div className="modal-header border-secondary">
            <h5 className="modal-title text-info fw-bold">
              <i className="bi bi-database-gear me-2"></i>Gerenciador de Frota & Terminal de Logs
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={fechar}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              
              {/* Coluna Esquerda: Formulário e Tabela */}
              <div className="col-lg-7">
                <form onSubmit={handleSubmit} className="card bg-black p-3 border-secondary mb-3">
                  <h6 className="text-warning mb-2">
                    {editandoId ? `Editando Veículo: ${editandoId}` : 'Cadastrar Novo Veículo'}
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-3">
                      <label className="form-label small">ID / Placa</label>
                      <input
                        type="text"
                        name="id"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        value={form.id}
                        onChange={handleChange}
                        disabled={!!editandoId}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small">Categoria</label>
                      <select
                        name="tipo"
                        className="form-select form-select-sm bg-dark text-white border-secondary"
                        value={form.tipo}
                        onChange={handleChange}
                      >
                        {categorias.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small">Modelo</label>
                      <input
                        type="text"
                        name="modelo"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        value={form.modelo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small">Velocidade</label>
                      <input
                        type="number"
                        name="vel"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        value={form.vel}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className={`btn btn-sm ${editandoId ? 'btn-warning' : 'btn-info'}`}>
                      {editandoId ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
                    </button>
                    {editandoId && (
                      <button type="button" className="btn btn-sm btn-outline-light" onClick={resetForm}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                <h6 className="text-info mb-2">Veículos Registrados ({frota.length})</h6>
                <div className="table-responsive" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                  <table className="table table-dark table-hover align-middle small">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Modelo</th>
                        <th>Vel.</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frota.map((v) => (
                        <tr key={v.id}>
                          <td className="fw-bold text-info">{v.id}</td>
                          <td>{v.tipo}</td>
                          <td>{v.modelo || '-'}</td>
                          <td>{v.vel || 0} km/h</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-warning" onClick={() => handleEdit(v)} title="Editar">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => handleDelete(v.id)} title="Excluir">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Coluna Direita: Terminal de Logs de Operação */}
              <div className="col-lg-5">
                <div className="card bg-black border-success h-100 d-flex flex-column font-monospace">
                  <div className="card-header bg-dark border-success py-1 d-flex justify-content-between align-items-center">
                    <span className="small text-success fw-bold">
                      <i className="bi bi-terminal me-1"></i> LOGS DE OPERAÇÕES SQL
                    </span>
                    <button 
                      className="btn btn-link text-secondary p-0 text-decoration-none small"
                      onClick={() => setLogs([])}
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="card-body p-2 flex-grow-1" style={{ backgroundColor: '#020b02', maxHeight: '410px', overflowY: 'auto' }}>
                    {logs.map((log) => (
                      <div key={log.id} className="small mb-1 leading-tight" style={{ fontSize: '0.75rem' }}>
                        <span className="text-secondary">[{log.time}]</span>{' '}
                        <span className="fw-bold text-white">[{log.type}]</span>{' '}
                        <span className={log.color}>{log.msg}</span>
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-secondary btn-sm" onClick={fechar}>
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}