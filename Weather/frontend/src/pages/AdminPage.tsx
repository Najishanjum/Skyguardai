import React, { useState, useEffect } from 'react';
import { ShieldCheck, Server, Database, Activity, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const [status, setStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSystemStatus()
      .then(setStatus)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b-2 border-[#11110F] pb-4">
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
          SYSTEM ADMINISTRATION & HEALTH CONSOLE
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
          Server runtime diagnostics, background scheduler telemetry, and database integrity metrics.
        </p>
      </div>

      {status ? (
        <div className="space-y-6">
          
          {/* Status KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
            <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-2">SYSTEM STATUS</span>
              <span className="block text-2xl font-display text-[#11110F]">
                {status.status}
              </span>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-2">REGISTERED STATIONS</span>
              <span className="block text-2xl font-display text-[#11110F]">
                {status.database_metrics?.total_stations}
              </span>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-2">OBSERVATIONS LOGGED</span>
              <span className="block text-2xl font-display text-[#11110F]">
                {status.database_metrics?.total_observations_recorded}
              </span>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-2">AUDIT RECORDS</span>
              <span className="block text-2xl font-display text-[#11110F]">
                {status.database_metrics?.audit_ledger_records}
              </span>
            </div>
          </div>

          {/* Providers Status */}
          <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 space-y-4">
            <h3 className="text-xl font-display text-[#11110F] uppercase tracking-wider flex items-center gap-3 border-b-2 border-[#11110F] pb-3">
              <Server className="w-5 h-5 text-[#11110F] stroke-[2.5]" />
              <span>WEATHER PROVIDER STATUS</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="p-4 bg-[#C8FF2E] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                <span className="font-bold text-[#11110F] text-sm block uppercase">OPEN-METEO GLOBAL</span>
                <span className="text-[10px] font-bold text-[#555550] mt-2 block uppercase border-t-2 border-[#11110F]/20 pt-2">STATUS: ACTIVE</span>
              </div>

              <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                <span className="font-bold text-[#11110F] text-sm block uppercase">IMD OFFICIAL AWS</span>
                <span className="text-[10px] font-bold text-[#555550] mt-2 block uppercase border-t-2 border-[#11110F]/20 pt-2">STATUS: READY FOR CREDENTIALS</span>
              </div>

              <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                <span className="font-bold text-[#11110F] text-sm block uppercase">OPENWEATHERMAP</span>
                <span className="text-[10px] font-bold text-[#555550] mt-2 block uppercase border-t-2 border-[#11110F]/20 pt-2">STATUS: READY FOR KEY</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

    </div>
  );
};
