import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { dadosIniciais } from './dados';
import { LinksComunicacao } from './components/LinksComunicacao';
import { FrotaCategoria } from './components/FrotaCategoria';

const categoriasVeiculos = [
  'Ônibus', 'Caminhão', 'Moto', 'Carro', 'Caminhonete',
  'Van', 'SUV', 'Esportivo', 'Trator', 'Ambulância',
];

const iconesPorCategoria = {
  Ônibus: '🚌', Caminhão: '🚚', Moto: '🏍️', Carro: '🚗', Caminhonete: '🛻',
  Van: '🚐', SUV: '🚙', Esportivo: '🏎️', Trator: '🚜', Ambulância: '🚑',
};

const rotasDisponiveis = ['/', ...categoriasVeiculos.map((categoria) => `/frota/${encodeURIComponent(categoria)}`)];

function DashboardRouter() {
  const [statusLinks, setStatusLinks] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });
  const [tempoRestante, setTempoRestante] = useState(5);
  const [isPausado, setIsPausado] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLink = (id) => setStatusLinks((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    if (isPausado) return undefined;

    const timer = setTimeout(() => {
      if (tempoRestante > 1) {
        setTempoRestante((prev) => prev - 1);
        return;
      }

      const indiceAtual = rotasDisponiveis.indexOf(location.pathname);
      const proximoIndice = (indiceAtual + 1) % rotasDisponiveis.length;
      navigate(rotasDisponiveis[proximoIndice]);
      setTempoRestante(5);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tempoRestante, isPausado, location.pathname, navigate]);

  return (
    <div>
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info sticky-top">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0 d-flex align-items-center">
              <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" title="Google Maps" className="spinning-globe" />
              NOC COMMAND CENTER
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setIsPausado((prev) => !prev)}
                className={`btn btn-sm ${isPausado ? 'btn-warning text-dark' : 'btn-outline-info text-info'}`}
              >
                {isPausado ? '⏸️ PAUSADO' : '🔄 AUTO-SWAP'}
              </button>
              <span className="badge bg-transparent border border-info text-info px-3 py-2">00:0{tempoRestante}</span>
            </div>
          </div>

          <div className="nav-scroll w-100 gap-2">
            <Link to="/" onClick={() => setTempoRestante(5)} className={`btn btn-sm text-nowrap px-4 py-2 ${location.pathname === '/' ? 'btn-info text-dark fw-bold shadow' : 'btn-outline-info text-white'}`}>
              📡 Links de Comunicação
            </Link>

            {categoriasVeiculos.map((categoria) => {
              const rotaTarget = `/frota/${encodeURIComponent(categoria)}`;
              const rotaAtiva = location.pathname === rotaTarget;
              return (
                <Link key={categoria} to={rotaTarget} onClick={() => setTempoRestante(5)} className={`btn btn-sm text-nowrap px-3 py-2 ${rotaAtiva ? 'btn-light text-dark fw-bold shadow' : 'btn-outline-light text-white'}`}>
                  {iconesPorCategoria[categoria]} {categoria}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<LinksComunicacao dados={dadosIniciais.infraestrutura} statusLinks={statusLinks} toggleLink={toggleLink} />} />
          <Route path="/frota/:categoria" element={<FrotaCategoria frota={dadosIniciais.frota} statusLinks={statusLinks} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardRouter />
    </BrowserRouter>
  );
}
