import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const MAPA_DEPENDENCIAS = {
  Caminhão: { id: 2, nome: 'Link VSAT BGAN' },
  Ônibus: { id: 4, nome: 'Sessão BGP' },
  Moto: { id: 5, nome: 'LTE-Móvel' },
  Carro: { id: 1, nome: 'Link VSAT Principal' },
  Caminhonete: { id: 1, nome: 'Link VSAT Principal' },
};

const DEPENDENCIA_PADRAO = { id: 3, nome: 'Roteamento OSPF' };

export function FrotaCategoria({ frota = [], statusLinks = {} }) {
  const { categoria: rawCategoria } = useParams();
  const categoria = rawCategoria ? decodeURIComponent(rawCategoria) : '';
  const sireneRef = useRef(null);
  const veiculosExibidos = frota.filter((veiculo) => veiculo.tipo === categoria);
  const { id: dependenciaId, nome: nomeLink } = MAPA_DEPENDENCIAS[categoria] || DEPENDENCIA_PADRAO;
  const linkCategoriaOnline = Boolean(statusLinks[dependenciaId]);
  const ehAmbulancia = categoria === 'Ambulância';

  const ativarSirene = async () => {
    if (sireneRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioCtx = new AudioContextClass();
      await audioCtx.resume();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      gainNode.gain.value = 0.15;
      oscillator.frequency.setValueAtTime(700, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      let tomAlto = false;
      const intervalId = setInterval(() => {
        tomAlto = !tomAlto;
        oscillator.frequency.setValueAtTime(tomAlto ? 960 : 700, audioCtx.currentTime);
      }, 500);

      sireneRef.current = { audioCtx, oscillator, intervalId };
    } catch (erro) {
      console.warn('Não foi possível ativar a sirene.', erro);
    }
  };

  useEffect(() => () => {
    const sirene = sireneRef.current;
    if (!sirene) return;

    clearInterval(sirene.intervalId);
    sirene.oscillator.stop();
    sirene.oscillator.disconnect();
    sirene.audioCtx.close();
    sireneRef.current = null;
  }, [categoria]);

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-4">
        <h4 className="fw-light text-info m-0">
          Telemetria Tática: <span className="fw-bold text-white">{categoria}</span>
        </h4>
        <div className="d-flex align-items-center gap-2">
          {ehAmbulancia && linkCategoriaOnline && <button type="button" className="btn btn-sm btn-danger fw-bold" onClick={ativarSirene}>🚨 Ativar sirene</button>}
          {!linkCategoriaOnline && <span className="badge bg-danger fs-6 p-2">⚠️ COMUNICAÇÃO PERDIDA ({nomeLink})</span>}
        </div>
      </div>

      <div className="row">
        {veiculosExibidos.map((veiculo, index) => {
          const combustivel = Math.max(0, 100 - index * 15);
          return (
            <div key={veiculo.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className={`card glass-card h-100 ${!linkCategoriaOnline ? 'offline-mode border-danger' : ''}`}>
                <div className="cenario">
                  <div className="parallax-bg" style={{ animationPlayState: linkCategoriaOnline ? 'running' : 'paused' }} />
                  <div className="estrada"><div className="linhas-estrada" style={{ animationPlayState: linkCategoriaOnline ? 'running' : 'paused' }} /></div>
                  {linkCategoriaOnline && <div className="vento"><div className="linha-vento" style={{ top: '15px', width: '50px', animationDuration: '0.4s' }} /><div className="linha-vento" style={{ top: '35px', width: '30px', animationDuration: '0.6s', animationDelay: '0.2s' }} /></div>}
                  <div className="veiculo-container" style={{ animationPlayState: linkCategoriaOnline ? 'running' : 'paused' }}>{veiculo.modelo}</div>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <h5 className="fw-bold text-info m-0">{veiculo.id}</h5>
                    <span className={`badge ${linkCategoriaOnline ? 'bg-success' : 'bg-danger'}`}>{linkCategoriaOnline ? 'SINAL OK' : 'LINK PERDIDO'}</span>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-white"><span>Bateria / Combustível</span><span>{combustivel}%</span></div>
                    <div className="progress-tech"><div className="progress-tech-bar" style={{ width: `${combustivel}%`, background: combustivel < 30 ? '#dc3545' : '#0dcaf0' }} /></div>
                  </div>
                  <div className="row text-secondary small">
                    <div className="col-6 mb-2"><strong className="text-white">Velocidade:</strong><br /><span className={linkCategoriaOnline ? 'text-info fw-bold' : ''}>{linkCategoriaOnline ? `${veiculo.vel} km/h` : '0 km/h'}</span></div>
                    <div className="col-6 mb-2 text-end"><strong className="text-white">GPS:</strong><br /><span className="font-monospace text-warning">{linkCategoriaOnline ? veiculo.gps : 'OFFLINE'}</span></div>
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
