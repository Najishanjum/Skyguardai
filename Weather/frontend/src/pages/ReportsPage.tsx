import React from 'react';
import { FileText, Download, ShieldCheck, AlertTriangle, HeartPulse, Sparkles } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const reports = [
    {
      title: "Weather Trust Score & Integrity Audit Report",
      description: "Official summary of all multi-factor trust score evaluations, data freshness, and credibility indices.",
      icon: ShieldCheck,
      color: "bg-[#C8FF2E] text-[#11110F]",
      csvUrl: "http://localhost:8000/api/v1/reports/trust-scores/csv"
    },
    {
      title: "Comprehensive Anomaly Detection & Diagnosis Report",
      description: "Complete ledger of detected sensor glitches, rate-of-change jumps, and confirmed severe weather squalls.",
      icon: AlertTriangle,
      color: "bg-[#FF5C5C] text-[#FFFFFF]",
      csvUrl: "http://localhost:8000/api/v1/reports/anomalies/csv"
    },
    {
      title: "Data Provenance & Observation Integrity Ledger",
      description: "Full cryptographic-style audit log verifying 100% preservation of raw sensor data across the 13-stage pipeline.",
      icon: FileText,
      color: "bg-[#4057FF] text-[#FFFFFF]",
      csvUrl: "http://localhost:8000/api/v1/reports/audit-ledger/csv"
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
          METEOROLOGICAL REPORTS & DATA EXPORT CENTER
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
          Export verified government reports, anomaly ledgers, and sensor health assessments in CSV and structured formats.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((rep, idx) => {
          const Icon = rep.icon;
          return (
            <div key={idx} className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className={`${rep.color} border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] p-3 w-max mb-4`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-bold text-lg font-display uppercase tracking-wider text-[#11110F]">
                  {rep.title}
                </h3>
                <p className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-2 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-[#11110F]">
                <a
                  href={rep.csvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brutal-btn brutal-btn-primary w-full text-[10px] py-3"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD VERIFIED CSV REPORT</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
