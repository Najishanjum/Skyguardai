import React, { useState, useEffect, useMemo } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, PlusCircle, Search, RefreshCw, Activity } from 'lucide-react';
import { api } from '../services/api';
import { MaintenanceAlertRecord } from '../types';

export const MaintenancePage: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlertRecord[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getMaintenanceAlerts();
      setAlerts(data || []);
    } catch (err) {
      console.warn("Failed fetching maintenance alerts", err);
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

  const handleDispatchOrder = async () => {
    setCreating(true);
    try {
      const newAlert = await api.createTestAlert({
        title: "Dispatched Calibration & Harness Maintenance Order",
        sensor_type: "PT100 RTD Thermal Assembly",
        severity: "CRITICAL",
        recommendation: "Immediate on-site terminal grounding re-tightening and radiation shield cleaning."
      });
      setAlerts(prev => [newAlert, ...prev]);
    } finally {
      setCreating(false);
    }
  };

  const filtered = useMemo(() => {
    return alerts.filter((alert) => {
      if (filter !== 'ALL' && alert.status !== filter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          alert.title?.toLowerCase().includes(q) ||
          alert.recommendation?.toLowerCase().includes(q) ||
          alert.sensor_type?.toLowerCase().includes(q) ||
          String(alert.station_id).includes(q)
        );
      }
      return true;
    });
  }, [alerts, filter, searchQuery]);

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const resolvedCount = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F] dark:text-[#F3F4F6]">
              PREDICTIVE MAINTENANCE & WORK ORDERS
            </h1>
            <span
              className="text-xs font-bold px-2 py-0.5 border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] font-mono uppercase"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
            >
              PROACTIVE DISPATCH
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#555550] dark:text-[#9CA3AF] uppercase mt-1">
            Automated transducer failure risk classification and prioritized operational maintenance recommendations.
          </p>
        </div>

        <button
          onClick={handleDispatchOrder}
          disabled={creating}
          className="brutal-btn brutal-btn-primary px-4 py-3 text-xs flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{creating ? "DISPATCHING..." : "DISPATCH WORK ORDER"}</span>
        </button>
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="brutal-card p-5 text-center">
          <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase block">
            ACTIVE WORK ORDERS
          </span>
          <span className="text-3xl font-display text-[#11110F] dark:text-[#F3F4F6] mt-2 block">
            {activeCount}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-1 block">
            REQUIRES CREW ATTENTION
          </span>
        </div>

        <div className="brutal-card p-5 text-center">
          <span className="text-[10px] font-mono font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase block border-b-2 border-current pb-1 w-max mx-auto">
            CRITICAL HARDWARE RISKS
          </span>
          <span className="text-3xl font-display text-[#FF5C5C] mt-2 block">
            {criticalCount}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-1 block">
            IMMEDIATE SENSOR DEGRADATION
          </span>
        </div>

        <div className="brutal-card p-5 text-center">
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 border border-current uppercase block w-max mx-auto"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
          >
            RESOLVED WORK ORDERS
          </span>
          <span className="text-3xl font-display text-[#11110F] dark:text-[#F3F4F6] mt-2 block">
            {resolvedCount}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-1 block">
            PROVENANCE PRESERVED
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555550] dark:text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="SEARCH WORK ORDER / SENSOR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="brutal-input pl-9 pr-3 py-2 text-[11px] font-bold uppercase w-60 sm:w-80"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={filter === st ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all border-2 border-[#11110F] dark:border-[#2D3342] ${
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

      {/* Alerts List */}
      <div className="space-y-4 pt-1">
        {filtered.length > 0 ? (
          filtered.map((alert) => (
            <div key={alert.id} className="brutal-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 border-2 border-[#11110F] dark:border-white shadow-[2px_2px_0_#11110F] ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-[#FF5C5C] text-[#FFFFFF]' 
                    : 'bg-[#4057FF] text-[#FFFFFF]'
                }`}>
                  <Wrench className="w-5 h-5 stroke-[2.5]" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg font-display uppercase text-[#11110F] dark:text-[#F3F4F6]">
                      {alert.title}
                    </h3>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] ${
                      alert.severity === 'CRITICAL' ? 'bg-[#FF5C5C] text-[#FFFFFF]' : 'bg-[var(--color-accent)] text-[#11110F]'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase">
                      STATION #{alert.station_id} ({alert.sensor_type})
                    </span>
                  </div>

                  <p className="text-xs font-mono font-bold text-[#11110F] dark:text-[#F3F4F6] mt-2 max-w-2xl uppercase">
                    {alert.recommendation}
                  </p>

                  <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] mt-2 block uppercase">
                    LOGGED: {new Date(alert.created_at).toLocaleString()} • STATUS: <strong className="uppercase text-[#11110F] dark:text-[#F3F4F6]">{alert.status}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="brutal-btn brutal-btn-tertiary text-[10px] py-2 px-4"
                  >
                    ACKNOWLEDGE
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="brutal-btn brutal-btn-primary text-[10px] py-2 px-4"
                  >
                    RESOLVE ORDER
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="brutal-card p-10 text-center text-xs font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase">
            {loading ? "FETCHING PREDICTIVE MAINTENANCE MATRIX..." : "NO WORK ORDERS MATCH CURRENT FILTERS."}
          </div>
        )}
      </div>

    </div>
  );
};
