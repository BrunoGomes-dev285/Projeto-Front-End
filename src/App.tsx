import { useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Radio,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import { StatusCard } from './components/StatusCard';
import { ConnectivityMonitor } from './components/ConnectivityMonitor';
import { FleetConnectivityGrid } from './components/FleetConnectivityGrid';
import { TelemetryChart } from './components/TelemetryChart';
import { FleetDistributionChart } from './components/FleetDistributionChart';
import { FleetTable } from './components/FleetTable';
import { IncidentLog } from './components/IncidentLog';
import { useFleetMonitor } from './hooks/useFleetMonitor';

const mockTelemetry = [
  { time: '10:00', speed: 65 },
  { time: '10:05', speed: 72 },
  { time: '10:10', speed: 68 },
  { time: '10:15', speed: 80 },
];

const mockFleet = [
  {
    id: 'AST-101',
    category: 'Veículo Leve (Patrulha)',
    driver: 'Carlos Silva [OP-01]',
  },
  {
    id: 'AST-102',
    category: 'Veículo Médio (Operacional)',
    driver: 'Ana Souza [OP-02]',
  },
  {
    id: 'AST-103',
    category: 'Veículo Pesado (Logística)',
    driver: 'Marcos Lima [OP-03]',
  },
  {
    id: 'AST-104',
    category: 'Veículo Leve (Patrulha)',
    driver: 'Juliana Costa [OP-04]',
  },
];

export default function App() {
  const {
    linksStatus,
    toggleLink,
    isCategoryOnline,
    criticalAlerts,
    activeVehiclesCount,
    totalVehiclesCount,
    logs,
  } = useFleetMonitor(mockFleet);

  const allAssetsOnline = activeVehiclesCount === totalVehiclesCount;
  const isSystemHealthy = criticalAlerts === 0 && allAssetsOnline;

  // Dados estáticos: o log de sincronização roda só na montagem.
  useEffect(() => {
    const traceId = Math.random().toString(16).slice(2);
    console.log(`[OTel] TraceID: ${traceId} - Telemetria sincronizada.`);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Glow
          Fica fora do container com space-y-8: como primeiro filho,
          ele empurrava o header 2rem para baixo. */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"
      />

      <div className="relative z-10 p-6 md:p-10 space-y-8">
        {/* Header Mission Control */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {/* Status Radar Dot */}
              <span
                role="status"
                aria-label={
                  isSystemHealthy
                    ? 'Operação Normal'
                    : 'Degradação Detectada'
                }
                title={
                  isSystemHealthy
                    ? 'Operação Normal'
                    : 'Degradação Detectada'
                }
                className="relative flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSystemHealthy ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />

                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${
                    isSystemHealthy
                      ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                      : 'bg-amber-500 shadow-[0_0_12px_#f59e0b]'
                  }`}
                />
              </span>

              <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                NOC Global Mission Control
              </h1>

              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Zap className="w-3 h-3" aria-hidden="true" />
                v2.4.0
              </span>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Plataforma de Observabilidade Edge & Telemetria em Tempo Real
            </p>
          </div>

          {/* Badge do Status Geral */}
          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
            <ShieldCheck
              aria-hidden="true"
              className={`w-5 h-5 ${
                isSystemHealthy ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />

            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                Status do Cluster
              </p>

              <p
                className={`text-xs font-semibold ${
                  isSystemHealthy ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isSystemHealthy
                  ? 'SISTEMA OPERACIONAL'
                  : 'ALERTA DE DEGRADAÇÃO'}
              </p>
            </div>
          </div>
        </header>

        {/* Cards KPI Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatusCard
            label="SLA DE CONECTIVIDADE CORE"
            value="99.9%"
            subtext="Enlaces Backbone Ativos"
            icon={Radio}
            variant="success"
          />

          <StatusCard
            label="ATIVOS CONECTADOS (EDGE)"
            value={`${activeVehiclesCount} / ${totalVehiclesCount}`}
            subtext={
              allAssetsOnline
                ? '100% da frota sincronizada'
                : `${totalVehiclesCount - activeVehiclesCount} ativo(s) sem sinal`
            }
            icon={Activity}
            variant={allAssetsOnline ? 'success' : 'danger'}
          />

          <StatusCard
            label="INCIDENTES CRÍTICOS (SEV-1)"
            value={String(criticalAlerts)}
            subtext="Falhas de Enlace / Telemetria"
            icon={AlertTriangle}
            variant={criticalAlerts > 0 ? 'danger' : 'success'}
          />
        </div>

        {/* Painel de Controle das Redes Backbone */}
        <ConnectivityMonitor
          linksStatus={linksStatus}
          onToggleLink={(linkKey) =>
            toggleLink(linkKey as Parameters<typeof toggleLink>[0])
          }
        />

        {/* QUADROS DE CONECTIVIDADE DAS FROTAS */}
        <FleetConnectivityGrid
          fleet={mockFleet}
          isCategoryOnline={isCategoryOnline}
        />

        {/* Grid Inferior: Telemetria, Gráficos e Tabela */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TelemetryChart data={mockTelemetry} />
              <FleetDistributionChart fleet={mockFleet} />
            </div>

            <FleetTable
              fleet={mockFleet}
              isCategoryOnline={isCategoryOnline}
            />
          </div>

          {/* Coluna Lateral: Log de Incidentes (altura limitada, com scroll) */}
          <div className="space-y-6">
            <div className="max-h-[520px] overflow-y-auto rounded-2xl">
              <IncidentLog logs={logs.slice(0, 20)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}