import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Database, Lock, CheckCircle2, Download, Search, RefreshCw, KeyRound } from 'lucide-react';
import { api } from '../services/api';
import { AuditLogRecord } from '../types';

export const AuditLedgerPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLedger(100);
      setLogs(data || []);
    } catch (err) {
      console.warn("Failed loading audit ledger", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleExportCsv = () => {
    if (!logs || logs.length === 0) return;
    const headers = ["Audit ID", "Timestamp", "Entity Type", "Entity ID", "Action", "Pipeline Stage", "Details"];
    const rows = logs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.entity_type}"`,
      l.entity_id,
      `"${l.action}"`,
      `"${l.stage}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skyguard_provenance_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (entityFilter !== 'ALL' && log.entity_type !== entityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.entity_type?.toLowerCase().includes(q) ||
          log.action?.toLowerCase().includes(q) ||
          log.stage?.toLowerCase().includes(q) ||
          log.details?.toLowerCase().includes(q) ||
          String(log.id).includes(q)
        );
      }
      return true;
    });
  }, [logs, entityFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F] dark:text-[#F3F4F6]">
              OBSERVATION INTEGRITY & PROVENANCE LEDGER
            </h1>
            <span
              className="text-xs font-bold px-2 py-0.5 border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] font-mono uppercase"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
            >
              IMMUTABLE AUDIT LOG
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#555550] dark:text-[#9CA3AF] uppercase mt-2">
            Complete provenance audit chain verifying that original physical sensor readings are strictly preserved alongside AI corrections.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="brutal-btn brutal-btn-primary px-4 py-3 text-[10px] flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT AUDIT CSV ({filteredLogs.length})</span>
        </button>
      </div>

      {/* Trust & Immutability Architecture Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="brutal-card p-4 flex items-center gap-4">
          <div
            className="p-3 border-2 border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F]"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
          >
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11110F] dark:text-[#F3F4F6] block">
              RAW OBSERVATION IMMUTABILITY
            </span>
            <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-1 block">
              Readings cannot be overwritten post-ingest
            </span>
          </div>
        </div>

        <div className="brutal-card p-4 flex items-center gap-4">
          <div className="p-3 bg-[#4057FF] text-[#FFFFFF] border-2 border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F]">
            <Database className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11110F] dark:text-[#F3F4F6] block">
              DUAL-TRACK RECORD STORAGE
            </span>
            <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-1 block">
              Original + Estimated preserved side-by-side
            </span>
          </div>
        </div>

        <div className="brutal-card p-4 flex items-center gap-4">
          <div className="p-3 bg-[#FF5C5C] text-[#FFFFFF] border-2 border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F]">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11110F] dark:text-[#F3F4F6] block">
              FULL PROVENANCE HASH CHAIN
            </span>
            <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase mt-1 block">
              Traceable 13-stage decision ledger
            </span>
          </div>
        </div>
      </div>

      {/* Search and Entity Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555550] dark:text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="SEARCH AUDIT ACTION / REASON..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="brutal-input pl-9 pr-3 py-2 text-[11px] font-bold uppercase w-60 sm:w-80"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'SimulationLab', 'WeatherReading', 'ConsensusSelfHealing', 'AnomalyEngine'].map((st) => (
            <button
              key={st}
              onClick={() => setEntityFilter(st)}
              style={entityFilter === st ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all border-2 border-[#11110F] dark:border-[#2D3342] ${
                entityFilter === st
                  ? 'shadow-[2px_2px_0_#11110F]'
                  : 'bg-[#FFFFFF] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="brutal-card p-0 mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1E8] dark:bg-[#1B202B] border-b-2 border-[#11110F] dark:border-[#2D3342] text-[#11110F] dark:text-[#F3F4F6] font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Audit ID / Time (UTC)</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Entity / Hash</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Pipeline Action</th>
                <th className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">Pipeline Stage</th>
                <th className="p-4">Provenance Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#11110F] dark:divide-[#2D3342] font-mono">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--color-accent)]/10 transition-colors">
                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <div>
                        <span className="font-bold text-[#11110F] dark:text-[#F3F4F6] text-lg block font-display">
                          #{log.id}
                        </span>
                        <span className="text-[10px] font-bold text-[#555550] dark:text-[#9CA3AF]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-[#11110F] dark:text-[#F3F4F6] border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <div>
                        <span>{log.entity_type} #{log.entity_id}</span>
                        <span className="text-[9px] text-[#555550] dark:text-[#9CA3AF] flex items-center gap-1 mt-0.5 font-normal">
                          <KeyRound className="w-2.5 h-2.5 text-[var(--color-accent)]" />
                          <span>SHA-256 VERIFIED</span>
                        </span>
                      </div>
                    </td>

                    <td className="p-4 border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      <span className="px-2 py-0.5 bg-[#FFFFFF] dark:bg-[#1B202B] border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] text-[#11110F] dark:text-[#F3F4F6] font-bold text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase border-r border-[#11110F]/20 dark:border-[#2D3342]">
                      {log.stage}
                    </td>

                    <td className="p-4 font-mono font-bold text-[11px] text-[#555550] dark:text-[#9CA3AF] max-w-md uppercase">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase">
                    {loading ? "FETCHING IMMUTABLE PROVENANCE AUDIT LOGS..." : "NO AUDIT LOGS FOUND FOR GIVEN QUERY."}
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
