import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface FleetItem {
  id: string;
  category: string;
  driver?: string;
}

interface FleetDistributionChartProps {
  fleet: FleetItem[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const FleetDistributionChart = ({ fleet }: FleetDistributionChartProps) => {
  // Processa a quantidade de veículos por categoria
  const distributionData = Object.entries(
    fleet.reduce<Record<string, number>>((acc, item) => {
      // Limpa ou encurta o nome da categoria para melhor exibição no eixo X
      const shortCategory = item.category.replace(/\s*\(.*?\)\s*/g, '');
      acc[shortCategory] = (acc[shortCategory] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      {/* Header do Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />

          <h3 className="text-slate-200 text-sm font-semibold tracking-wide">
            Distribuição de Frota por Categoria
          </h3>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {fleet.length} ATIVOS
        </span>
      </div>

      {/* Gráfico de Barras */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={distributionData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} veículo(s)`, 'Quantidade']}
            />

            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {distributionData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};