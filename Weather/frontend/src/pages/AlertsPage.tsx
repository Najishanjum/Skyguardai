import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { MaintenanceAlertRecord } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlertRecord[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMaintenanceAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const handleAcknowledge = async (id: number) => {
    await api.acknowledgeAlert(id);
    const updated = await api.getMaintenanceAlerts();
    setAlerts(updated);
  };

  const handleResolve = async (id: number) => {
    await api.resolveAlert(id);
    const updated = await api.getMaintenanceAlerts();
    setAlerts(updated);
  };

  const filtered = alerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            ALERTS & INCIDENT COMMAND CENTER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
            Real-time critical anomaly, sensor degradation, and meteorological hardware alert management.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 text-[10px] font-bold font-mono uppercase transition-all ${
                filter === st
                  ? 'bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]'
                  : 'bg-[#FFFFFF] text-[#11110F] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F] hover:bg-[#F4F1E8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4 pt-2">
        {filtered.map((a) => (
          <div key={a.id} className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 border-2 border-[#11110F] shadow-[1px_1px_0_#11110F] ${
                a.severity === 'CRITICAL' ? 'bg-[#FF5C5C] text-[#FFFFFF]' : 'bg-[#C8FF2E] text-[#11110F]'
              }`}>
                <Bell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold font-display text-lg uppercase text-[#11110F]">{a.title}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase border border-[#11110F] ${
                    a.severity === 'CRITICAL' ? 'bg-[#FF5C5C] text-[#FFFFFF]' : 'bg-[#C8FF2E] text-[#11110F]'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#555550] uppercase">
                    STATION #{a.station_id}
                  </span>
                </div>
                <p className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-2 max-w-2xl">
                  {a.recommendation}
                </p>
                <span className="text-[10px] font-mono font-bold text-[#11110F] uppercase mt-3 pt-2 border-t-2 border-[#11110F]/10 block">
                  LOGGED: {new Date(a.created_at).toLocaleString()} • STATUS: <strong className="uppercase text-[#4057FF]">{a.status}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {a.status === 'ACTIVE' && (
                <button
                  onClick={() => handleAcknowledge(a.id)}
                  className="brutal-btn brutal-btn-tertiary px-4 py-3 text-[10px]"
                >
                  ACKNOWLEDGE
                </button>
              )}
              {a.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolve(a.id)}
                  className="brutal-btn brutal-btn-primary px-4 py-3 text-[10px]"
                >
                  RESOLVE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
