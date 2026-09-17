interface FleetItem {
  id: string;
  category: string;
  driver: string;
}

interface FleetTableProps {
  fleet: FleetItem[];
  isCategoryOnline: (category: string) => boolean;
}

export const FleetTable = ({ fleet, isCategoryOnline }: FleetTableProps) => {
  return (
    <div className="bg-noc-card p-6 rounded-2xl border border-slate-800">
      <h3 className="text-slate-200 text-sm font-semibold mb-4">Status da Frota em Tempo Real</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Motorista</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {fleet.map((item) => {
              const online = isCategoryOnline(item.category);
              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono font-medium text-white">{item.id}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.driver}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                        online
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                      {online ? 'Conectado' : 'Desconectado'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};