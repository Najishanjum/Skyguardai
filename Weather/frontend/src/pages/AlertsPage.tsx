import React, { useState, useEffect, useMemo } from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert, PlusCircle, Search, CheckCheck } from 'lucide-react';
import { api } from '../services/api';
import { MaintenanceAlertRecord } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlertRecord[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getMaintenanceAlerts();
      setAlerts(data || []);
    } catch (err) {
      console.warn("Failed fetching alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const } : a));
    await api.acknowledgeAlert(id);
  };

  const handleResolve = async (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' as const, resolved_at: new Date().toISOString() } : a));
    await api.resolveAlert(id);
  };

  const handleAcknowledgeAll = async () => {
    setAlerts(prev => prev.map(a => a.status === 'ACTIVE' ? { ...a, status: 'ACKNOWLEDGED' as const } : a));
    const activeIds = alerts.filter(a => a.status === 'ACTIVE').map(a => a.id);
    await Promise.all(activeIds.map(id => api.acknowledgeAlert(id)));
  };

  const handleSimulateAlert = async () => {
    setSimulating(true);
    try {
      const newAlert = await api.createTestAlert({
        title: "Barometric Pressure Transducer Drift Warning",
        sensor_type: "Piezoresistive Pressure Capsule",
        severity: "CRITICAL",
        recommendation: "Inspect sensor chamber port for dust obstruction and test secondary transducer reference."
      });
      setAlerts(prev => [newAlert, ...prev]);
    } finally {
      setSimulating(false);
    }
  };

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (filter !== 'ALL' && a.status !== filter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title?.toLowerCase().includes(q) ||
          a.recommendation?.toLowerCase().includes(q) ||
          a.sensor_type?.toLowerCase().includes(q) ||
          String(a.station_id).includes(q)
        );
      }
      return true;
    });
  }, [alerts, filter, searchQuery]);

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F] dark:text-[#F3F4F6]">
              ALERTS & INCIDENT COMMAND CENTER
            </h1>
            <span
              className="text-xs font-bold px-2 py-0.5 border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] font-mono uppercase"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
            >
              {activeCount} ACTIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#555550] dark:text-[#9CA3AF] uppercase mt-2">
            Real-time critical anomaly, sensor degradation, and meteorological hardware alert management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              className="brutal-btn brutal-btn-tertiary px-3 py-2 text-xs flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>ACKNOWLEDGE ALL ({activeCount})</span>
            </button>
          )}

          <button
            onClick={handleSimulateAlert}
            disabled={simulating}
            className="brutal-btn brutal-btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{simulating ? "SIMULATING..." : "SIMULATE TEST ALERT"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555550] dark:text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="SEARCH ALERT OR HARDWARE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="brutal-input pl-9 pr-3 py-2 text-[11px] font-bold uppercase w-60 sm:w-80"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={filter === st ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
              className={`px-3 py-1.5 text-[10px] font-bold font-mono uppercase transition-all border-2 border-[#11110F] dark:border-[#2D3342] ${
                filter === st
                  ? 'shadow-[2px_2px_0_#11110F]'
                  : 'bg-[#FFFFFF] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4 pt-2">
        {filtered.length > 0 ? (
          filtered.map((a) => (
            <div key={a.id} className="brutal-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 border-2 border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] ${
                  a.severity === 'CRITICAL' ? 'bg-[#FF5C5C] text-[#FFFFFF]' : 'bg-[var(--color-accent)] text-[#11110F]'
                }`}>
                  <Bell className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold font-display text-lg uppercase text-[#11110F] dark:text-[#F3F4F6]">{a.title}</h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase border border-[#11110F] dark:border-white ${
                      a.severity === 'CRITICAL' ? 'bg-[#FF5C5C] text-[#FFFFFF]' : 'bg-[var(--color-accent)] text-[#11110F]'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase">
                      STATION #{a.station_id} {a.sensor_type ? `(${a.sensor_type})` : ''}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-2 max-w-2xl">
                    {a.recommendation}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase mt-3 pt-2 border-t-2 border-current/10 block">
                    LOGGED: {new Date(a.created_at).toLocaleString()} • STATUS: <strong className="uppercase text-[var(--color-accent)]">{a.status}</strong>
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
          ))
        ) : (
          <div className="brutal-card p-10 text-center text-xs font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase">
            {loading ? "SCANNING INCIDENT COMMAND LOGS..." : "NO ALERTS RECORDED FOR THIS FILTER SELECTION."}
          </div>
        )}
      </div>

    </div>
  );
};
