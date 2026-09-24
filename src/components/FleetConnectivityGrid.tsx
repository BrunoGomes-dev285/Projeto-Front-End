import { useState } from 'react';
import {
  Wifi,
  Radio,
  Signal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export interface VehicleConnectivityUnit {
  id: string;
  driver: string;
  category: string;
  connectionType: '5G NR' | '4G LTE' | 'VSAT Satelital' | 'Sem Sinal';
  signalDb: number; // Ex: -65 dBm
  signalPercent: number; // 0-100%
  latencyMs: number;
  status: 'online' | 'degraded' | 'offline';
  ipAddress: string;
  dataRateKbps: number;
  lastPing: string;
  telemetryHealth: number; // %
}

interface FleetConnectivityGridProps {
  fleet: Array<{ id: string; category: string; driver: string }>;
  isCategoryOnline: (category: string) => boolean;
}

export const FleetConnectivityGrid = ({
  fleet,
  isCategoryOnline,
}: FleetConnectivityGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'online' | 'degraded' | 'offline'
  >('all');

  // Mapeamento dos dados da frota para os Quadros de Conectividade
  const fleetCards: VehicleConnectivityUnit[] = fleet.map((vehicle, idx) => {
    const isOnline = isCategoryOnline(vehicle.category);

    let status: 'online' | 'degraded' | 'offline' = isOnline
      ? 'online'
      : 'offline';
    let connectionType: VehicleConnectivityUnit['connectionType'] = '5G NR';
    let signalPercent = 95 - idx * 10;
    let signalDb = -62 - idx * 8;
    let latencyMs = 22 + idx * 8;
    let dataRateKbps = 1240 - idx * 120;
    let telemetryHealth = 99;

    if (vehicle.category.includes('Patrulha')) {
      connectionType = isOnline ? '5G NR' : 'Sem Sinal';
      signalPercent = isOnline ? 92 : 0;
      signalDb = isOnline ? -68 : -120;
      latencyMs = isOnline ? 24 : 0;
      dataRateKbps = isOnline ? 2400 : 0;
      telemetryHealth = isOnline ? 100 : 0;
    } else if (vehicle.category.includes('Operacional')) {
      connectionType = isOnline ? 'VSAT Satelital' : 'Sem Sinal';
      signalPercent = isOnline ? 68 : 0;
      signalDb = isOnline ? -85 : -120;
      latencyMs = isOnline ? 540 : 0;
      dataRateKbps = isOnline ? 450 : 0;
      telemetryHealth = isOnline ? 88 : 0;
      if (isOnline) status = 'degraded';
    } else if (vehicle.category.includes('Logística')) {
      connectionType = isOnline ? '4G LTE' : 'Sem Sinal';
      signalPercent = isOnline ? 78 : 0;
      signalDb = isOnline ? -76 : -120;
      latencyMs = isOnline ? 45 : 0;
      dataRateKbps = isOnline ? 980 : 0;
      telemetryHealth = isOnline ? 95 : 0;
    }

    return {
      id: vehicle.id,
      driver: vehicle.driver,
      category: vehicle.category,
      connectionType,
      signalDb,
      signalPercent,
      latencyMs,
      status,
      ipAddress: `10.240.12.${101 + idx}`,
      dataRateKbps,
      lastPing: isOnline ? 'há 1s' : 'há 8m',
      telemetryHealth,
    };
  });

  const filteredCards = fleetCards.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Barra Superior de Estatísticas e Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-slate-200 text-sm font-semibold tracking-wide">
            Painel de Quadros: Conectividade da Frota
          </h3>

          <p className="text-xs text-slate-400">
            Cartões de status dos modems e enlaces RF por unidade operacional
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />

            <input
              type="text"
              value={searchTerm}
              placeholder="Buscar por ID, motorista ou categoria"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />

            {(['all', 'online', 'degraded', 'offline'] as const).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                    statusFilter === filter
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'Todos' : filter}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Grade de Quadros de Conectividade */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCards.map((unit) => {
          const isOnline = unit.status === 'online';
          const isDegraded = unit.status === 'degraded';

          return (
            <div
              key={unit.id}
              className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4"
            >
              {/* Linha Glowing no Topo do Quadro */}
              <div
                className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent ${
                  isOnline
                    ? 'via-emerald-500/60'
                    : isDegraded
                      ? 'via-amber-500/60'
                      : 'via-rose-500/60'
                }`}
              />

              {/* Cabeçalho do Quadro */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-200">
                    {unit.category}
                  </p>

                  <p className="text-[11px] font-mono text-slate-500">
                    <span className="text-slate-400">{unit.id}</span>
                    {' • '}
                    {unit.driver}
                  </p>
                </div>

                {/* Badge de Status em LED */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                    isOnline
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isDegraded
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {isOnline ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : isDegraded ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {isOnline ? 'ONLINE' : isDegraded ? 'DEGRADADO' : 'OFFLINE'}
                </span>
              </div>

              {/* Quadro Interno: Tipo de Conexão e IP */}
              <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                <div className="p-2 rounded-lg bg-slate-800/80 text-slate-300">
                  {unit.connectionType.includes('VSAT') ? (
                    <Radio className="w-4 h-4" />
                  ) : unit.connectionType.includes('Sem') ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <Wifi className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Enlace Edge:
                    </p>

                    <p className="font-semibold text-slate-200">
                      {unit.connectionType}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Endereço IP:
                    </p>

                    <p className="font-mono text-slate-300">
                      {unit.ipAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicador Visual do Sinal RF (Barra Gradiente) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Signal className="w-3 h-3" />
                    Sinal da Antena (RF)
                  </span>

                  <span className="font-mono text-slate-300">
                    {unit.signalDb} dBm ({unit.signalPercent}%)
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      unit.signalPercent > 70
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : unit.signalPercent > 30
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-600 to-rose-400'
                    }`}
                    style={{ width: `${unit.signalPercent}%` }}
                  />
                </div>
              </div>

              {/* Grade de Métricas do Quadro (Latência, Vazão e Telemetria) */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Latência
                  </p>

                  <p
                    className={`text-sm font-mono font-semibold ${
                      unit.latencyMs > 300
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {unit.latencyMs > 0 ? `${unit.latencyMs}ms` : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Taxa Dados
                  </p>

                  <p className="text-sm font-mono font-semibold text-slate-300">
                    {unit.dataRateKbps > 0 ? `${unit.dataRateKbps}k` : '0k'}
                  </p>
                </div>

                <div>
                  <p className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-mono">
                    <Cpu className="w-3 h-3" />
                    Pacotes
                  </p>

                  <p className="text-sm font-mono font-semibold text-slate-300">
                    {unit.telemetryHealth}%
                  </p>
                </div>
              </div>

              {/* Rodapé do Quadro */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px]">
                <span className="flex items-center gap-1 text-slate-500 font-mono">
                  <RefreshCw className="w-3 h-3" />
                  {unit.lastPing}
                </span>

                <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  <Activity className="w-3 h-3" />
                  Diagnóstico RF →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};