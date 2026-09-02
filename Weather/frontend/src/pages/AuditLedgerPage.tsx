import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Lock, CheckCircle2, Download } from 'lucide-react';
import { api } from '../services/api';
import { AuditLogRecord } from '../types';

export const AuditLedgerPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLedger(100).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
              OBSERVATION INTEGRITY & PROVENANCE LEDGER
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[1px_1px_0_#11110F] font-mono uppercase">
              IMMUTABLE AUDIT LOG
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
            Complete provenance audit chain verifying that original physical sensor readings are strictly preserved alongside AI corrections.
          </p>
        </div>

        <a
          href="http://localhost:8000/api/v1/reports/audit-ledger/csv"
          target="_blank"
          rel="noreferrer"
          className="brutal-btn brutal-btn-tertiary px-4 py-3 text-[10px] flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT AUDIT CSV</span>
        </a>
      </div>

      {/* Trust & Immutability Architecture Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center gap-4">
          <div className="p-3 bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11110F] block">RAW OBSERVATION IMMUTABILITY</span>
            <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">Readings cannot be altered post-ingest</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center gap-4">
          <div className="p-3 bg-[#4057FF] text-[#FFFFFF] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
            <Database className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11110F] block">DUAL-TRACK RECORD STORAGE</span>
            <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">Original + Estimated preserved side-by-side</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center gap-4">
          <div className="p-3 bg-[#FF5C5C] text-[#FFFFFF] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11110F] block">FULL PROVENANCE HASH CHAIN</span>
            <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">Traceable 13-stage decision ledger</span>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="brutal-card p-0 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1E8] border-b-2 border-[#11110F] text-[#11110F] font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-r border-[#11110F]/20">Audit ID / Time (UTC)</th>
                <th className="p-4 border-r border-[#11110F]/20">Entity Type</th>
                <th className="p-4 border-r border-[#11110F]/20">Pipeline Action</th>
                <th className="p-4 border-r border-[#11110F]/20">Pipeline Stage</th>
                <th className="p-4">Provenance Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#11110F] font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#C8FF2E]/10 transition-colors">
                  <td className="p-4 border-r border-[#11110F]/20">
                    <div>
                      <span className="font-bold text-[#11110F] text-lg block">
                        #{log.id}
                      </span>
                      <span className="text-[10px] font-bold text-[#555550]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-[#11110F] border-r border-[#11110F]/20">
                    {log.entity_type} #{log.entity_id}
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#11110F] shadow-[1px_1px_0_#11110F] text-[#11110F] font-bold text-[10px] uppercase">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-[#11110F] uppercase border-r border-[#11110F]/20">
                    {log.stage}
                  </td>

                  <td className="p-4 font-mono font-bold text-[10px] text-[#555550] max-w-md uppercase">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
