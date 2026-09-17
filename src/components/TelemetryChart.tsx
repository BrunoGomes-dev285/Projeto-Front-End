import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TelemetryChartProps {
  data: Array<{ time: string; speed: number }>;
}

export const TelemetryChart = ({ data }: TelemetryChartProps) => {
  return (
    <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4">
      {/* Luz Neon no topo do card */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="flex items-center justify-between">
        <h3 className="text-slate-200 text-sm font-semibold tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Telemetria de Velocidade Média (km/h)
        </h3>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
          STREAM LIVE
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
            <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#1e293b',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#speedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};