import { useState } from 'react';

export interface Vehicle {
  id: string;
  category: string;
  driver: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  traceId?: string;
}

export const useFleetMonitor = (fleet: Vehicle[] = []) => {
  const [linksStatus, setLinksStatus] = useState<Record<string, boolean>>({
    vsat: true,
    ospf: true,
    bgp: true,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      message: 'Telemetria Core e pipeline OpenTelemetry inicializados com sucesso.',
      type: 'info',
      traceId: 'sys-init-001',
    },
  ]);

  const addLog = (message: string, type: LogEntry['type']) => {
    const traceId = Math.random().toString(16).slice(2, 10);
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      traceId,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const toggleLink = (linkKey: string) => {
    setLinksStatus((prev) => {
      const nextStatus = !prev[linkKey];
      const linkName = linkKey.toUpperCase();

      if (nextStatus) {
        addLog(`Link de comunicação [${linkName}] restabelecido (SLA OK).`, 'success');
      } else {
        addLog(`SEV-1: Queda crítica detectada no enlace de rede [${linkName}].`, 'error');
      }

      return {
        ...prev,
        [linkKey]: nextStatus,
      };
    });
  };

  // Regra de Negócio atualizada para a nova nomenclatura de ativos
  const isCategoryOnline = (category: string) => {
    if (['Veículo Leve (Patrulha)', 'Veículo Médio (Operacional)'].includes(category)) {
      return linksStatus.vsat;
    }
    if (category === 'Veículo Pesado (Logística)') {
      return linksStatus.bgp;
    }
    return true;
  };

  const activeVehiclesCount = fleet.filter((v) => isCategoryOnline(v.category)).length;
  const totalVehiclesCount = fleet.length;
  const offlineVehiclesCount = totalVehiclesCount - activeVehiclesCount;
  const offlineLinksCount = Object.values(linksStatus).filter((isOnline) => !isOnline).length;

  const criticalAlerts = offlineVehiclesCount + offlineLinksCount;

  return {
    linksStatus,
    setLinksStatus,
    toggleLink,
    isCategoryOnline,
    criticalAlerts,
    activeVehiclesCount,
    totalVehiclesCount,
    logs,
    addLog,
  };
};