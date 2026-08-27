const { useState, useEffect } = React;

// BANCO DE DADOS EM MEMÓRIA
const dadosIniciais = {
  infraestrutura: [
    { id: 1, tipo: "Link VSAT (Hub Principal)", target: "Satélite Star One D2", latencia: "580ms" },
    { id: 2, tipo: "Link VSAT (BGAN Backup)", target: "Satélite Inmarsat", latencia: "850ms" },
    { id: 3, tipo: "Roteamento OSPF", target: "Core Interno (10.0.0.1)", latencia: "2ms" },
    { id: 4, tipo: "Sessão BGP", target: "Operadora AS-1042", latencia: "12ms" },
    { id: 5, tipo: "Link LTE-Móvel", target: "Antena Celular ERB", latencia: "45ms" }
  ],
  frota: [
    { id: "V-01", modelo: "🚌", tipo: "Ônibus", vel: "85", gps: "-23.55, -46.63" },
    { id: "V-02", modelo: "🚚", tipo: "Caminhão", vel: "70", gps: "-22.90, -43.20" },
    { id: "V-03", modelo: "🏍", tipo: "Moto", vel: "110", gps: "-19.92, -43.93" },
    { id: "V-04", modelo: "🚗", tipo: "Carro", vel: "110", gps: "-25.42, -49.27" },
    { id: "V-05", modelo: "🛻", tipo: "Caminhonete", vel: "80", gps: "-30.03, -51.23" },
    { id: "V-06", modelo: "🚐", tipo: "Van", vel: "75", gps: "-15.79, -47.88" },
    { id: "V-07", modelo: "🚙", tipo: "SUV", vel: "100", gps: "-12.97, -38.50" },
    { id: "V-08", modelo: "🏎", tipo: "Esportivo", vel: "140", gps: "-03.11, -60.02" },
    { id: "V-09", modelo: "🚜", tipo: "Trator", vel: "30", gps: "-16.68, -49.25" },
    { id: "V-10", modelo: "🚑", tipo: "Ambulância", vel: "120", gps: "-20.31, -40.31" }
  ]
};

// LISTAS ESTÁTICAS
const categoriasVeiculos = [
  "Ônibus", "Caminhão", "Moto", "Carro", "Caminhonete", 
  "Van", "SUV", "Esportivo", "Trator", "Ambulância"
];
const ordemTelas = ["links", ...categoriasVeiculos];

// COMPONENTE 1: Links de Comunicação
function LinksComunicacao({ dados = [], statusLinks = {}, toggleLink }) {
  return (
    <div className="container-fluid px-4 mt-4">
      <h4 className="fw-light text-info border-bottom border-secondary pb-2 mb-4">
        Monitoramento de Conectividade
      </h4>

      <div className="row">
        {dados.map(item => {
          const isOnline = !!statusLinks[item.id];
          const latenciaAtual = isOnline ? item.latencia : 'TIMEOUT';
          const usoBanda = isOnline ? 65 : 0;

          return (
            <div key={item.id} className="col-12 col-md-6 col-xl-3 mb-4">
              <div className={`card glass-card h-100 ${!isOnline ? 'border-danger' : 'border-info'}`}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-0 fw-bold d-flex align-items-center">
                        <span className={`led-indicator ${isOnline ? 'led-up' : 'led-down'}`}></span>
                        {item.tipo}
                      </h6>
                      <small className="text-secondary d-block mt-1">Alvo: {item.target}</small>
                    </div>
                    <div className="text-end">
                      <small className="text-secondary d-block">Latência</small>
                      <strong className={latenciaAtual === 'TIMEOUT' ? "text-danger" : "text-success"}>
                        {latenciaAtual}
                      </strong>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between small text-secondary">
                      <span>Tráfego de Dados</span>
                      <span>{usoBanda}%</span>
                    </div>
                    <div className="progress-tech">
                      <div className="progress-tech-bar bg-info" style={{ width: `${usoBanda}%` }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleLink && toggleLink(item.id)} 
                    className={`btn btn-sm w-100 fw-bold shadow-sm ${isOnline ? 'btn-outline-danger' : 'btn-success'}`}
                  >
                    {isOnline ? '⚠ Simular Queda' : '🔄 Restaurar Conexão'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// COMPONENTE 2: Telemetria da Frota (Web Audio API)
function FrotaCategoria({ frota = [], categoria, statusLinks = {} }) {
  const veiculosExibidos = frota.filter(v => v.tipo === categoria);

  useEffect(() => {
    let audioCtx = null;
    let osc = null;
    let intervalId = null;

    if (categoria === "Ambulância") {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        gainNode.gain.value = 0.15;

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();

        let isHigh = false;
        osc.frequency.setValueAtTime(700, audioCtx.currentTime);

        intervalId = setInterval(() => {
          if (osc && audioCtx && audioCtx.state === 'running') {
            isHigh = !isHigh;
            osc.frequency.setValueAtTime(isHigh ? 960 : 700, audioCtx.currentTime);
          }
        }, 500);
      } catch (e) {
        console.warn("Áudio bloqueado pelo navegador até interação do usuário.");
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (osc) {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      }
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, [categoria]);

  let dependenciaId = 3;
  let nomeLink = "Roteamento OSPF";

  if (categoria === "Caminhão") {
    dependenciaId = 2;
    nomeLink = "Link VSAT BGAN";
  } else if (categoria === "Ônibus") {
    dependenciaId = 4;
    nomeLink = "Sessão BGP";
  } else if (categoria === "Moto") {
    dependenciaId = 5;
    nomeLink = "LTE-Móvel";
  } else if (categoria === "Carro" || categoria === "Caminhonete") {
    dependenciaId = 1;
    nomeLink = "Link VSAT Principal";
  }

  const linkCategoriaOnline = !!statusLinks[dependenciaId];

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-4">
        <h4 className="fw-light text-info m-0">
          Telemetria Tática: <span className="fw-bold text-white">{categoria}</span>
        </h4>

        {!linkCategoriaOnline && (
          <span className="badge bg-danger fs-6 p-2">
            ⚠ COMUNICAÇÃO PERDIDA ({nomeLink})
          </span>
        )}
      </div>

      <div className="row">
        {veiculosExibidos.map((veiculo, index) => {
          const veiculoAtivo = linkCategoriaOnline;
          const combustivel = Math.max(10, 100 - (index * 15));

          return (
            <div key={veiculo.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className={`card glass-card h-100 ${!veiculoAtivo ? 'offline-mode border-danger' : ''}`}>
                <div className="cenario">
                  <div className="parallax-bg" style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}></div>
                  <div className="estrada">
                    <div className="linhas-estrada" style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}></div>
                  </div>
                  {veiculoAtivo && (
                    <div className="vento">
                      <div className="linha-vento" style={{ top: '15px', width: '50px', animationDuration: '0.4s' }}></div>
                      <div className="linha-vento" style={{ top: '35px', width: '30px', animationDuration: '0.6s', animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                  <div className="veiculo-container" style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}>
                    {veiculo.modelo}
                  </div>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <h5 className="fw-bold text-info m-0">{veiculo.id}</h5>
                    <span className={`badge ${veiculoAtivo ? 'bg-success' : 'bg-danger'}`}>
                      {veiculoAtivo ? 'SINAL OK' : 'LINK PERDIDO'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-white">
                      <span>Bateria / Combustível</span>
                      <span>{combustivel}%</span>
                    </div>
                    <div className="progress-tech">
                      <div 
                        className="progress-tech-bar" 
                        style={{ 
                          width: `${combustivel}%`, 
                          background: combustivel < 30 ? '#dc3545' : '#0dcaf0' 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="row text-secondary small">
                    <div className="col-6 mb-2">
                      <strong className="text-white">Velocidade:</strong><br/>
                      <span className={veiculoAtivo ? "text-info fw-bold" : ""}>
                        {veiculoAtivo ? `${veiculo.vel} km/h` : '0 km/h'}
                      </span>
                    </div>
                    <div className="col-6 mb-2 text-end">
                      <strong className="text-white">GPS Atual:</strong><br/>
                      <span className="font-monospace text-warning">
                        {veiculoAtivo ? veiculo.gps : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL (Orquestrador)
function App() {
  const [statusLinks, setStatusLinks] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });
  const [indiceTela, setIndiceTela] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(5);

  const toggleLink = (id) => {
    setStatusLinks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIndiceTela(prev => (prev + 1) % ordemTelas.length);
      setTempoRestante(5);
    }
  }, [tempoRestante]);

  const telaAtual = ordemTelas[indiceTela];

  return (
    <div>
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info sticky-top">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0 d-flex align-items-center">
              <a 
                href="https://www.google.com/maps" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Abrir Google Maps" 
                className="spinning-globe"
              ></a>
              NOC COMMAND CENTER
            </span>
            <span className="badge bg-transparent border border-info text-info px-3 py-2">
              AUTO-SWAP: 00:{tempoRestante.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="nav-scroll w-100 gap-2">
            <button
              onClick={() => { setIndiceTela(0); setTempoRestante(5); }}
              className={`btn btn-sm text-nowrap px-4 py-2 ${telaAtual === 'links' ? 'btn-info text-dark fw-bold shadow' : 'btn-outline-info text-white'}`}
            >
              📡 Links Comunicação
            </button>

            {categoriasVeiculos.map((cat, idx) => {
              let iconeBotao = "🚚";
              if (cat === "Moto") iconeBotao = "🏍";
              else if (cat === "Carro" || cat === "SUV" || cat === "Esportivo") iconeBotao = "🚗";
              else if (cat === "Ônibus" || cat === "Van") iconeBotao = "🚌";
              else if (cat === "Ambulância") iconeBotao = "🚑";
              else if (cat === "Trator") iconeBotao = "🚜";

              return (
                <button
                  key={cat}
                  onClick={() => { setIndiceTela(idx + 1); setTempoRestante(5); }}
                  className={`btn btn-sm text-nowrap px-3 py-2 ${telaAtual === cat ? 'btn-light text-dark fw-bold shadow' : 'btn-outline-light text-white'}`}
                >
                  {iconeBotao} {cat}
                </button>
              );
            })}
          </div>

        </div>
      </nav>

      <main>
        {telaAtual === 'links' ? (
          <LinksComunicacao 
            dados={dadosIniciais.infraestrutura} 
            statusLinks={statusLinks} 
            toggleLink={toggleLink} 
          />
        ) : (
          <FrotaCategoria 
            frota={dadosIniciais.frota} 
            categoria={telaAtual} 
            statusLinks={statusLinks} 
          />
        )}
      </main>
    </div>
  );
}

// Injeção da aplicação na DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);