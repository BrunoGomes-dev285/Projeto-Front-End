const { useState, useEffect } = React;

// 1. TELA DE INFRAESTRUTURA E CORE
function Infraestrutura({ dados, vsatOnline, setVsatOnline }) {
  return (
    <div className="container mt-4">
      <h2 className="text-white mb-3">Core de Redes e Hub Satelital</h2>
      <div className="row">
        {dados.map((item) => {
          const isHub = item.id === 1;
          const statusAtual = isHub ? (vsatOnline ? 'UP' : 'DOWN') : item.status;
          const latenciaAtual = isHub ? (vsatOnline ? item.latencia : 'TIMEOUT') : item.latencia;
          return (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card glass-card p-3">
                <h5>{item.tipo || item.protocolo}</h5>
                <p className="mb-1">Alvo: {item.target}</p>
                <span className={`badge ${statusAtual === 'UP' ? 'bg-success' : 'bg-danger'}`}>
                  {statusAtual}
                </span>
                <p className="mt-2 mb-0">
                  Latência:{' '}
                  <span className={latenciaAtual > 500 ? 'text-warning' : 'text-success'}>
                    {latenciaAtual}
                  </span>
                </p>

                {isHub && (
                  <button
                    onClick={() => setVsatOnline(!vsatOnline)}
                    className={`btn btn-sm w-100 mt-2 fw-bold shadow-sm ${
                      vsatOnline ? 'btn-outline-danger' : 'btn-success'
                    }`}
                  >
                    {vsatOnline ? '⚠ Simular Queda VSAT' : '🔄 Restaurar Conexão'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. TELA DE TELEMETRIA (FROTA SEGMENTADA)
function FrotaCategoria({ frota, categoria, vsatOnline }) {
  const veiculosExibidos = frota.filter((v) => v.tipo === categoria);
  return (
    <div className="container mt-4">
      <h3 className="text-white mb-3">Frota: {categoria}</h3>
      {!vsatOnline && (
        <div className="alert alert-danger fw-bold">⚠ SEM COMUNICAÇÃO COM O HUB</div>
      )}
      <div className="row">
        {veiculosExibidos.length === 0 ? (
          <p className="text-muted">Nenhum ativo operando nesta categoria.</p>
        ) : (
          veiculosExibidos.map((veiculo) => {
            const veiculoAtivo = vsatOnline && veiculo.vel !== '0';
            return (
              <div key={veiculo.id} className={`col-md-4 mb-3 ${!vsatOnline ? 'offline-mode' : ''}`}>
                <div className="card glass-card p-3">
                  <div className="cenario">
                    <div className="estrada"></div>
                    <div className={`veiculo ${veiculoAtivo ? 'animado' : ''}`}>
                      {veiculo.modelo}
                    </div>
                    <div className="grid-overlay"></div>
                  </div>
                  <div className="mt-2">
                    <h5>{veiculo.id}</h5>
                    <span className={`badge ${vsatOnline ? 'bg-success' : 'bg-secondary'}`}>
                      {vsatOnline ? 'ONLINE' : 'LINK PERDIDO'}
                    </span>
                    <p className="mt-2 mb-1">
                      Velocidade: {vsatOnline ? `${veiculo.vel} km/h` : '-- km/h'}
                    </p>
                    <p className="mb-1">
                      Uptime: {vsatOnline ? veiculo.uptime : 'DESCONECTADO'}
                    </p>
                    <p className="mb-0">Último GPS Conhecido: {veiculo.gps}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 3. MOTOR PRINCIPAL DA APLICAÇÃO (APP) E ROTEAMENTO
function App() {
  const [infra, setInfra] = useState([]);
  const [frota, setFrota] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [vsatOnline, setVsatOnline] = useState(true);

  const categoriasVeiculos = [
    'Ônibus', 'Caminhão', 'Moto', 'Carro', 'Caminhonete',
    'Van', 'SUV', 'Esportivo', 'Trator', 'Ambulância'
  ];
  const ordemTelas = ['infra', ...categoriasVeiculos];

  const [indiceTela, setIndiceTela] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(5);

  useEffect(() => {
    fetch('./dados.json')
      .then((resposta) => resposta.json())
      .then((dados) => {
        setInfra(dados.infraestrutura);
        setFrota(dados.frota);
        setCarregando(false);
      })
      .catch((erro) => console.error('Falha ao consultar banco de dados: ', erro));
  }, []);

  useEffect(() => {
    if (!carregando) {
      if (tempoRestante > 0) {
        const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIndiceTela((prev) => (prev + 1) % ordemTelas.length);
        setTempoRestante(5);
      }
    }
  }, [tempoRestante, carregando]);

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  const telaAtual = ordemTelas[indiceTela];

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3 mb-3">
        <span className="navbar-brand fw-bold">🌐 NOC COMMAND CENTER</span>
        <span className={`badge ${vsatOnline ? 'bg-success' : 'bg-danger'}`}>
          HUB VSAT: {vsatOnline ? 'OPERACIONAL' : 'FORA DO AR'}
        </span>
        <span className="badge bg-warning text-dark">
          AUTO-SWAP: 00:0{tempoRestante}
        </span>
      </nav>

      <div className="nav-scroll px-3 mb-3">
        <button
          onClick={() => { setIndiceTela(0); setTempoRestante(5); }}
          className={`btn btn-sm text-nowrap px-4 py-2 me-2 ${
            telaAtual === 'infra' ? 'btn-info text-dark fw-bold shadow' : 'btn-outline-info text-white'
          }`}
        >
          📡 Painel Core/VSAT
        </button>
        {categoriasVeiculos.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => { setIndiceTela(idx + 1); setTempoRestante(5); }}
            className={`btn btn-sm text-nowrap px-3 py-2 me-2 ${
              telaAtual === cat ? 'btn-light text-dark fw-bold shadow' : 'btn-outline-light text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {telaAtual === 'infra' ? (
        <Infraestrutura dados={infra} vsatOnline={vsatOnline} setVsatOnline={setVsatOnline} />
      ) : (
        <FrotaCategoria frota={frota} categoria={telaAtual} vsatOnline={vsatOnline} />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);