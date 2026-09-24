import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface FleetItem {
  id: string;
  category: string;
  driver?: string;
}

interface FleetDistributionChartProps {
  fleet: FleetItem[];
}

// Paleta de cores NOC
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const FleetDistributionChart = ({ fleet }: FleetDistributionChartProps) => {
  // Agrupa e conta a quantidade de veículos por categoria
  const distributionData = Object.entries(
    fleet.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4">
      {/* Brilho superior */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-blue-400" />

          <h3 className="text-slate-200 text-sm font-semibold tracking-wide">
            Distribuição de Frota por Categoria
          </h3>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {fleet.length} ATIVOS
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              stroke="none"
            >
              {distributionData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} veículo(s)`, 'Total']}
            />

            <Legend
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-slate-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};