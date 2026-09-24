import { Radio, Wifi, Network, Activity, RefreshCw } from 'lucide-react';

export interface LinkDetail {
  id: string;
  name: string;
  type: 'SATELITE' | 'BACKBONE' | 'CELLULAR';
  status: boolean;
  latencyMs: number;
  packetLoss: number;
  bandwidthMbps: number;
  affectedCategories: string[];
}

interface ConnectivityMonitorProps {
  linksStatus: Record<string, boolean>;
  onToggleLink: (linkKey: string) => void;
}

export const ConnectivityMonitor = ({
  linksStatus,
  onToggleLink,
}: ConnectivityMonitorProps) => {
  // Configuração detalhada dos enlaces com métricas de monitoramento
  const linksDetails: LinkDetail[] = [
    {
      id: 'vsat',
      name: 'VSAT Satelital (Ka-Band)',
      type: 'SATELITE',
      status: linksStatus['vsat'] ?? true,
      latencyMs: linksStatus['vsat'] ? 580 : 0,
      packetLoss: linksStatus['vsat'] ? 0.2 : 100,
      bandwidthMbps: linksStatus['vsat'] ? 25 : 0,
      affectedCategories: ['Patrulha', 'Operacional'],
    },
    {
      id: 'ospf',
      name: 'OSPF Core Mesh (SD-WAN)',
      type: 'BACKBONE',
      status: linksStatus['ospf'] ?? true,
      latencyMs: linksStatus['ospf'] ? 18 : 0,
      packetLoss: linksStatus['ospf'] ? 0.01 : 100,
      bandwidthMbps: linksStatus['ospf'] ? 1000 : 0,
      affectedCategories: ['Core Network', 'Central'],
    },
    {
      id: 'bgp',
      name: 'BGP Transit Edge (5G/LTE)',
      type: 'CELLULAR',
      status: linksStatus['bgp'] ?? true,
      latencyMs: linksStatus['bgp'] ? 42 : 0,
      packetLoss: linksStatus['bgp'] ? 0.1 : 100,
      bandwidthMbps: linksStatus['bgp'] ? 150 : 0,
      affectedCategories: ['Logística'],
    },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-5">
      {/* Linha de brilho superior */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-slate-200 text-sm font-semibold tracking-wide">
            <Activity className="w-4 h-4 text-blue-400" />
            Monitoramento de Conectividade Edge & Backbone
          </h3>

          <p className="text-xs text-slate-400">
            Status dos canais de transmissão e injeção de falhas em tempo real
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <RefreshCw className="w-3 h-3" />
          Sincronizado (1s)
        </span>
      </div>

      {/* Lista de Enlaces */}
      <div className="space-y-3">
        {linksDetails.map((link) => {
          const isOnline = link.status;

          return (
            <div
              key={link.id}
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border ${
                isOnline
                  ? 'bg-slate-950/40 border-slate-800'
                  : 'bg-rose-950/20 border-rose-900/50'
              }`}
            >
              {/* Info Principal do Enlace */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800/80 text-slate-300">
                  {link.type === 'SATELITE' ? (
                    <Radio className="w-4 h-4" />
                  ) : link.type === 'BACKBONE' ? (
                    <Network className="w-4 h-4" />
                  ) : (
                    <Wifi className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-200">
                      {link.name}
                    </p>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        isOnline
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {isOnline ? 'Online' : 'Falha Injetada'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Afeta: {link.affectedCategories.join(', ')}
                  </p>
                </div>
              </div>

              {/* Métricas Técnicas */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Latência
                  </p>

                  <p
                    className={`text-sm font-mono font-semibold ${
                      link.latencyMs > 300
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {isOnline ? `${link.latencyMs} ms` : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Perda Pacotes
                  </p>

                  <p
                    className={`text-sm font-mono font-semibold ${
                      link.packetLoss > 1
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {link.packetLoss}%
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Banda Max
                  </p>

                  <p className="text-sm font-mono font-semibold text-slate-300">
                    {isOnline ? `${link.bandwidthMbps} Mbps` : '0 Mbps'}
                  </p>
                </div>
              </div>

              {/* Botão de Toggle de Falha */}
              <button
                onClick={() => onToggleLink(link.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-200 border ${
                  isOnline
                    ? 'bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border-slate-700 hover:border-rose-800/60'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60'
                }`}
              >
                {isOnline ? 'Simular Falha' : 'Restabelecer Enlace'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};