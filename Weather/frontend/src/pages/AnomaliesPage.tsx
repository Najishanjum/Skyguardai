import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Filter, Search, ArrowRight, ShieldAlert, Sparkles, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { AnomalyRecord } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const AnomaliesPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const data = await api.getAnomalies({
        severity: severityFilter !== 'ALL' ? severityFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      setAnomalies(data || []);
    } catch (err) {
      console.warn("Failed fetching anomalies, fallback active", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [severityFilter, statusFilter]);

  const filteredAnomalies = useMemo(() => {
    if (!searchQuery.trim()) return anomalies;
    const q = searchQuery.toLowerCase();
    return anomalies.filter(a => 
      a.probable_cause?.toLowerCase().includes(q) ||
      a.station_name?.toLowerCase().includes(q) ||
      a.station_code?.toLowerCase().includes(q) ||
      String(a.station_id).includes(q) ||
      String(a.id).includes(q)
    );
  }, [anomalies, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F] dark:text-[#F3F4F6]">
              ANOMALY DETECTION & LIFECYCLE CENTER
            </h1>
            <span
              className="text-xs font-bold px-2 py-0.5 border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] font-mono uppercase"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
            >
              ACTIVE DEFENSE
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#555550] dark:text-[#9CA3AF] uppercase mt-2">
            Real-time hybrid AI/ML detection ledger with adaptive evidence verification lifecycle tracking.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555550] dark:text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="SEARCH STATION / CAUSE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="brutal-input pl-9 pr-3 py-2 uppercase text-[11px] font-bold w-48 sm:w-60"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="brutal-input py-2 px-3 uppercase text-[10px] font-bold min-w-[140px]"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL SEVERITY</option>
            <option value="HIGH">HIGH SEVERITY</option>
            <option value="SUSPICIOUS">SUSPICIOUS</option>
            <option value="WATCH">WATCH</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="brutal-input py-2 px-3 uppercase text-[10px] font-bold min-w-[150px]"
          >
            <option value="ALL">ALL LIFECYCLE STATES</option>
            <option value="UNDER_VERIFICATION">UNDER VERIFICATION</option>
            <option value="CONFIRMED_ANOMALY">CONFIRMED FAULT</option>
            <option value="CONFIRMED_GENUINE_WEATHER_EVENT">WEATHER SQUALL</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <button
            onClick={() => { setRefreshing(true); fetchAnomalies(); }}
            className="brutal-btn brutal-btn-tertiary px-3 py-2 text-[10px] flex items-center gap-1.5"
            title="Scan / Refresh Anomaly Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">SCAN</span>
          </button>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="brutal-card p-0 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1E8] dark:bg-[#1B202B] border-b-2 border-[#11110F] dark:border-[#2D3342] text-[#11110F] dark:text-[#F3F4F6] font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Anomaly ID / Time</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Station Code</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Probable Root Cause</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">AI Score / Severity</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Verification Lifecycle</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Diag. Conf</th>
                <th className="p-4 text-center">Deep Dive</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#11110F] dark:divide-[#2D3342] font-sans">
              {filteredAnomalies.length > 0 ? (
                filteredAnomalies.map((anom) => (
                  <tr key={anom.id} className="hover:bg-[var(--color-accent)]/10 transition-colors">
                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#FF5C5C] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#11110F] dark:text-[#F3F4F6] font-display text-lg block">
                            #{anom.id}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF]">
                            {new Date(anom.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-[#11110F] dark:text-[#F3F4F6] border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <div>
                        <span>STATION #{anom.station_id}</span>
                        {anom.station_code && (
                          <span className="text-[10px] text-[#555550] dark:text-[#9CA3AF] block font-mono">
                            {anom.station_code}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <span className="font-mono font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase block">
                        {anom.probable_cause}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] truncate max-w-xs block mt-1 uppercase">
                        {anom.evidence_summary || "Telemetry evaluated"}
                      </span>
                    </td>

                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xl text-[#11110F] dark:text-[#F3F4F6]">
                          {anom.composite_score}
                        </span>
                        <StatusBadge status={anom.severity} type="severity" />
                      </div>
                    </td>

                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <StatusBadge status={anom.status} type="lifecycle" />
                    </td>

                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <span className="font-mono font-bold text-[#FFFFFF] bg-[#FF5C5C] px-1 border border-[#11110F] dark:border-white uppercase">
                        {anom.confidence}%
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <Link
                        to={`/anomalies/${anom.id}`}
                        className="brutal-btn brutal-btn-primary px-3 py-2 text-[10px] whitespace-nowrap inline-flex items-center justify-center gap-2"
                      >
                        <span>DIAGNOSE</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase">
                    {loading ? "SCANNING REAL-TIME ANOMALY LEDGER..." : "NO ANOMALIES MATCH CURRENT SELECTION FILTERS."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
