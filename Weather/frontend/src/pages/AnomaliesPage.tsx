import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Filter, Search, ArrowRight, ShieldAlert, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { AnomalyRecord } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const AnomaliesPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnomalies({
      severity: severityFilter !== 'ALL' ? severityFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined
    }).then((data) => {
      setAnomalies(data);
      setLoading(false);
    });
  }, [severityFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            ANOMALY DETECTION & LIFECYCLE CENTER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
            Real-time hybrid AI/ML detection ledger with adaptive evidence verification lifecycle tracking.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="brutal-input py-2 px-4 uppercase text-[10px] font-bold min-w-[160px]"
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
            className="brutal-input py-2 px-4 uppercase text-[10px] font-bold min-w-[160px]"
          >
            <option value="ALL">ALL LIFECYCLE STATES</option>
            <option value="UNDER_VERIFICATION">UNDER VERIFICATION</option>
            <option value="CONFIRMED_ANOMALY">CONFIRMED SENSOR FAULT</option>
            <option value="CONFIRMED_GENUINE_WEATHER_EVENT">PROBABLE WEATHER EVENT</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="brutal-card p-0 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1E8] border-b-2 border-[#11110F] text-[#11110F] font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-r border-[#11110F]/20">Anomaly ID / Time</th>
                <th className="p-4 border-r border-[#11110F]/20">Station Code</th>
                <th className="p-4 border-r border-[#11110F]/20">Probable Root Cause</th>
                <th className="p-4 border-r border-[#11110F]/20">AI Score / Severity</th>
                <th className="p-4 border-r border-[#11110F]/20">Verification Lifecycle</th>
                <th className="p-4 border-r border-[#11110F]/20">Diag. Conf</th>
                <th className="p-4 text-center">Deep Dive</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#11110F] font-sans">
              {anomalies.map((anom) => (
                <tr key={anom.id} className="hover:bg-[#C8FF2E]/10 transition-colors">
                  <td className="p-4 border-r border-[#11110F]/20">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#FF5C5C]" />
                      <div>
                        <span className="font-bold text-[#11110F] font-display text-lg block">
                          #{anom.id}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#555550]">
                          {new Date(anom.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-[#11110F] border-r border-[#11110F]/20">
                    STATION #{anom.station_id}
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <span className="font-mono font-bold text-[#11110F] uppercase block">
                      {anom.probable_cause}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#555550] truncate max-w-xs block mt-1 uppercase">
                      {anom.evidence_summary || "Telemetry evaluated"}
                    </span>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xl text-[#11110F]">
                        {anom.composite_score}
                      </span>
                      <StatusBadge status={anom.severity} type="severity" />
                    </div>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <StatusBadge status={anom.status} type="lifecycle" />
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <span className="font-mono font-bold text-[#FFFFFF] bg-[#FF5C5C] px-1 border border-[#11110F] uppercase">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
