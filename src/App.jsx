
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; //[cite: 1]
import { Redes } from './pages/Redes'; //[cite: 1]
import { Telemetria } from './pages/Telemetria'; //[cite: 1]

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar Global[cite: 1] */}
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">C.C.U. Dashboard</span>
          <div>
            <Link to="/" className="btn btn-outline-light me-2">Monitoramento de Rede</Link>
            <Link to="/telemetria" className="btn btn-outline-light">Telemetria de Frota</Link>
          </div>
        </div>
      </nav>

      {/* Troca de Telas (Onde a mágica da SPA acontece)[cite: 1] */}
      <Routes>
        <Route path="/" element={<Redes />} />
        <Route path="/telemetria" element={<Telemetria />} />
      </Routes>
    </BrowserRouter>
  );
}



