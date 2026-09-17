import { Terminal } from 'lucide-react';
import { LogEntry } from '../hooks/useFleetMonitor';

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel = ({ logs }: LogPanelProps) => {
  const getTypeBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  return (
    <div className="bg-noc-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <h3 className="text-slate-200 text-sm font-semibold">Logs do Sistema & Observabilidade</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">{logs.length} eventos</span>
      </div>

      <div className="h-44 overflow-y-auto space-y-2 font-mono text-xs pr-1">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-center py-4">Nenhum evento registrado.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded bg-slate-900/70 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border shrink-0 ${getTypeBadge(
                    log.type
                  )}`}
                >
                  {log.type}
                </span>
                <span className="text-slate-300 truncate">{log.message}</span>
              </div>
              {log.traceId && (
                <span className="text-[10px] text-slate-600 shrink-0 font-mono">
                  Trace: {log.traceId}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};