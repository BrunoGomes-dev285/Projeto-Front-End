interface ConnectivityLinkProps {
  name: string;
  status: boolean;
  onToggle: () => void;
}

export const ConnectivityLink = ({ name, status, onToggle }: ConnectivityLinkProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
      <span className="text-slate-300 font-mono text-xs uppercase">{name}</span>
      <button
        onClick={onToggle}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
          status
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}
      >
        {status ? 'ONLINE' : 'OFFLINE'}
      </button>
    </div>
  );
};