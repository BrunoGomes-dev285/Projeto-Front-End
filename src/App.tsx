import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Radio, ShieldCheck, Zap } from 'lucide-react';
import { StatusCard } from './components/StatusCard';
import { ConnectivityLink } from './components/ConnectivityLink';
import { TelemetryChart } from './components/TelemetryChart';
import { FleetTable } from './components/FleetTable';
import { LogPanel } from './components/LogPanel';
import { useFleetMonitor } from './hooks/useFleetMonitor';

const mockTelemetry = [
  { time: '10:00', speed: 65 },
  { time: '10:05', speed: 72 },
  { time: '10:10', speed: 68 },
  { time: '10:15', speed: 80 },
];

const mockFleet = [
  { id: 'AST-101', category: 'Veículo Leve (Patrulha)', driver: 'Carlos Silva [OP-01]' },
  { id: 'AST-102', category: 'Veículo Médio (Operacional)', driver: 'Ana Souza [OP-02]' },
  { id: 'AST-103', category: 'Veículo Pesado (Logística)', driver: 'Marcos Lima [OP-03]' },
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

  const [metrics] = useState(mockTelemetry);
  const isSystemHealthy = criticalAlerts === 0;

  useEffect(() => {
    const traceId = Math.random().toString(16).slice(2);
    console.log(`[OTel] TraceID: ${traceId} - Telemetria sincronizada.`);
  }, [metrics]);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-slate-100 p-6 md:p-10 space-y-8 font-sans selection:bg-blue-500 selection:text-white">
      {/* Glow de Iluminação no Fundo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Mission Control */}
      <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {/* Status Radar Dot */}
            <span
              className="relative flex h-4 w-4 items-center justify-center"
              title={isSystemHealthy ? 'Operação Normal' : 'Degradação Detectada'}
            >
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSystemHealthy ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex h-3 w-3 rounded-full ${
                  isSystemHealthy ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-amber-500 shadow-[0_0_12px_#f59e0b]'
                }`}
              />
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              NOC Global Mission Control
            </h1>

            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="w-3 h-3" /> v2.4.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Plataforma de Observabilidade Edge & Telemetria em Tempo Real
          </p>
        </div>

        {/* Badge do Status Geral */}
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
          <ShieldCheck className={`w-5 h-5 ${isSystemHealthy ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Status do Cluster</p>
            <p className={`text-xs font-semibold ${isSystemHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isSystemHealthy ? 'SISTEMA OPERACIONAL' : 'ALERTA DE DEGRADAÇÃO'}
            </p>
          </div>
        </div>
      </header>

      {/* Cards Indicadores */}
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
            activeVehiclesCount === totalVehiclesCount
              ? '100% da frota sincronizada'
              : `${totalVehiclesCount - activeVehiclesCount} ativo(s) sem sinal`
          }
          icon={Activity}
          variant={activeVehiclesCount === totalVehiclesCount ? 'success' : 'danger'}
        />
        <StatusCard
          label="INCIDENTES CRÍTICOS (SEV-1)"
          value={criticalAlerts}
          subtext="Falhas de Enlace / Telemetria"
          icon={AlertTriangle}
          variant={criticalAlerts > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TelemetryChart data={metrics} />
          <FleetTable fleet={mockFleet} isCategoryOnline={isCategoryOnline} />
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <h3 className="text-slate-200 text-sm font-semibold tracking-wide">
              Mesh de Conectividade
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Injeção de falhas nos enlaces de transporte (VSAT afeta Patrulha/Operacional; BGP afeta Logística).
            </p>
            <div className="space-y-2.5 pt-2">
              {Object.entries(linksStatus).map(([key, value]) => (
                <ConnectivityLink
                  key={key}
                  name={key === 'vsat' ? 'VSAT Satelital' : key === 'ospf' ? 'OSPF Core Mesh' : 'BGP Transit Edge'}
                  status={value}
                  onToggle={() => toggleLink(key)}
                />
              ))}
            </div>
          </div>

          <LogPanel logs={logs} />
        </div>
      </div>
    </div>
  );
}