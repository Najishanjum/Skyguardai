import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';

export const SelfHealingPage: React.FC = () => {
  const [overview, setOverview] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getConsensusOverview(),
      api.getCorrectedRecords()
    ]).then(([ov, recs]) => {
      setOverview(ov);
      setRecords(recs);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            CONSENSUS-BASED SELF-HEALING CENTER
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase">
            ⭐ FLAGSHIP USP 3
          </span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
          Tri-model ensemble (Temporal Lag, Diurnal Baseline, Multivariate Regression) calculates inter-model consensus agreement before any automated estimate is accepted.
        </p>
      </div>

      {/* Scientific Integrity Banner */}
      <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#11110F] flex-shrink-0" />
          <div>
            <span className="font-bold text-sm text-[#11110F] font-mono uppercase block">
              100% Immutable Raw Observation Guarantee
            </span>
            <p className="text-xs font-mono font-bold text-[#555550] uppercase mt-1">
              SkyGuard AI NEVER overwrites or corrupts the raw meteorological database. Corrected values are saved side-by-side with full provenance.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Metric Stats */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5 text-center">
            <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">TOTAL SELF-HEALING AUDITS</span>
            <span className="text-3xl font-display text-[#11110F] mt-2 block">
              {overview.total_estimations}
            </span>
          </div>

          <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5 text-center">
            <span className="text-[10px] font-mono font-bold text-[#11110F] uppercase block border-b-2 border-[#11110F] pb-1 w-max mx-auto">SAFE AUTO-ESTIMATES ACCEPTED</span>
            <span className="text-3xl font-display text-[#11110F] mt-2 block">
              {overview.safe_auto_estimates}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">MODEL AGREEMENT &ge; 85%</span>
          </div>

          <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5 text-center">
            <span className="text-[10px] font-mono font-bold text-[#11110F] bg-[#C8FF2E] px-1 border border-[#11110F] uppercase block w-max mx-auto">HUMAN REVIEW REQUIRED</span>
            <span className="text-3xl font-display text-[#11110F] mt-2 block">
              {overview.human_review_required}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">CORRECTION WITHHELD FOR INTEGRITY</span>
          </div>
        </div>
      )}

      {/* Corrected Observations Table */}
      <div className="brutal-card p-0 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1E8] border-b-2 border-[#11110F] text-[#11110F] font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-r border-[#11110F]/20">Timestamp / Parameter</th>
                <th className="p-4 border-r border-[#11110F]/20">Raw Preserved Value</th>
                <th className="p-4 border-r border-[#11110F]/20">Model A (Temporal)</th>
                <th className="p-4 border-r border-[#11110F]/20">Model B (Diurnal)</th>
                <th className="p-4 border-r border-[#11110F]/20">Model C (Multivari.)</th>
                <th className="p-4 border-r border-[#11110F]/20">Agreement %</th>
                <th className="p-4">Consensus Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#11110F] font-mono">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#C8FF2E]/10 transition-colors">
                  <td className="p-4 border-r border-[#11110F]/20">
                    <div>
                      <span className="font-bold text-sm uppercase text-[#11110F] block font-mono">
                        {rec.parameter}
                      </span>
                      <span className="text-[10px] font-bold text-[#555550]">
                        {new Date(rec.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <span className="font-bold font-mono text-[#FFFFFF] bg-[#FF5C5C] px-1 line-through border border-[#11110F]">
                      {rec.original_value !== null ? `${rec.original_value}°C` : "NULL"}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-[#11110F] border-r border-[#11110F]/20">
                    {rec.model_temporal_estimate}°C
                  </td>

                  <td className="p-4 font-bold text-[#11110F] border-r border-[#11110F]/20">
                    {rec.model_historical_estimate}°C
                  </td>

                  <td className="p-4 font-bold text-[#11110F] border-r border-[#11110F]/20">
                    {rec.model_multivariate_estimate}°C
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <span className="font-bold font-mono bg-[#C8FF2E] border border-[#11110F] px-1 text-[#11110F]">
                      {rec.model_agreement_percent}%
                    </span>
                  </td>

                  <td className="p-4 font-sans">
                    <StatusBadge status={rec.status} type="healing" />
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
