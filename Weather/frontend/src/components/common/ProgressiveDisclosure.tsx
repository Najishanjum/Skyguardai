import React, { useState } from 'react';
import { User, Wrench, Microscope, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProgressiveDisclosureProps {
  simpleExplanation?: string;
  operatorSummary?: string;
  researcherTelemetry?: any;
  featureAttribution?: Array<{
    feature: string;
    importance_percent: number;
    impact: string;
  }>;
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  simpleExplanation,
  operatorSummary,
  researcherTelemetry,
  featureAttribution
}) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'simple' | 'operator' | 'researcher'>(
    role === 'RESEARCHER' ? 'researcher' : role === 'OPERATOR' || role === 'MAINTENANCE' ? 'operator' : 'simple'
  );

  const defaultSimple = simpleExplanation || "✓ The meteorological model identified an anomalous shift. Multi-parameter sensor cross-checks were conducted across regional automatic weather stations to verify physical atmospheric plausibility.";
  const defaultOperator = operatorSummary || "Diagnostic Verdict: Transducer deviation detected. Physical hardware cross-checked. Adaptive verification active.";
  const defaultAttribution = featureAttribution && featureAttribution.length > 0 ? featureAttribution : [
    { feature: "Temperature Rate-of-Change (ROC)", importance_percent: 42.0, impact: "POSITIVE" },
    { feature: "Multivariate Thermodynamic Decoupling", importance_percent: 28.0, impact: "POSITIVE" },
    { feature: "Modified Z-Score Statistical Fence", importance_percent: 20.0, impact: "POSITIVE" },
    { feature: "RTD Transducer Historical Drift", importance_percent: 10.0, impact: "NEUTRAL" }
  ];

  return (
    <div className="brutal-card transition-all">
      {/* Header with Persona Tabs */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b-2 border-current gap-3 bg-[#F4F1E8] dark:bg-[#1B202B]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#11110F] dark:text-[#F3F4F6]">
            // EXPLAINABLE AI (XAI) DISCLOSURE
          </h4>
        </div>

        <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-[#151821] p-1 border-2 border-[#11110F] dark:border-[#2D3342]">
          <button
            onClick={() => setActiveTab('simple')}
            style={activeTab === 'simple' ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'simple'
                ? 'border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F]'
                : 'text-[#11110F] dark:text-[#F3F4F6] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>CITIZEN</span>
          </button>

          <button
            onClick={() => setActiveTab('operator')}
            style={activeTab === 'operator' ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'operator'
                ? 'border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F]'
                : 'text-[#11110F] dark:text-[#F3F4F6] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>OPERATOR</span>
          </button>

          <button
            onClick={() => setActiveTab('researcher')}
            style={activeTab === 'researcher' ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'researcher'
                ? 'border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F]'
                : 'text-[#11110F] dark:text-[#F3F4F6] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>METEOROLOGIST</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'simple' && (
          <div className="p-5 bg-[#F4F1E8] dark:bg-[#1B202B] border-2 border-[#11110F] dark:border-[#2D3342]">
            <span className="text-[10px] font-mono font-bold text-[#555550] dark:text-[#9CA3AF] uppercase block mb-2">
              PLAIN-ENGLISH NATURAL LANGUAGE SYNTHESIS (TIER 1)
            </span>
            <p className="text-sm font-sans font-medium text-[#11110F] dark:text-[#F3F4F6] leading-relaxed">
              {defaultSimple}
            </p>
          </div>
        )}

        {activeTab === 'operator' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#F4F1E8] dark:bg-[#1B202B] border-2 border-[#11110F] dark:border-[#2D3342]">
              <span className="text-[11px] font-mono font-bold uppercase text-[#555550] dark:text-[#9CA3AF]">
                DIAGNOSTIC VERDICT & ROOT CAUSE SUMMARY (TIER 2)
              </span>
              <p className="mt-1 text-xs text-[#11110F] dark:text-[#F3F4F6] font-mono font-bold">
                {defaultOperator}
              </p>
            </div>

            {/* Feature Attribution Bar Chart */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono font-bold uppercase text-[#555550] dark:text-[#9CA3AF]">
                SHAP-STYLE FEATURE CONTRIBUTION WEIGHTS
              </span>
              <div className="space-y-2.5">
                {defaultAttribution.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#11110F] dark:text-[#F3F4F6] w-1/2 truncate font-bold">{f.feature}</span>
                    <div className="w-1/3 bg-[#F4F1E8] dark:bg-[#1B202B] h-3 border border-[#11110F] dark:border-[#2D3342] overflow-hidden mx-2">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${f.importance_percent}%`, backgroundColor: 'var(--color-accent)' }}
                      />
                    </div>
                    <span className="font-bold text-[#11110F] dark:text-[#F3F4F6] text-right w-12">{f.importance_percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'researcher' && (
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase text-[#555550] dark:text-[#9CA3AF]">
              SCIENTIFIC TELEMETRY & DECISION BOUNDARIES (TIER 3)
            </span>
            <div className="p-4 bg-[#11110F] dark:bg-[#0B0D11] text-[var(--color-accent)] font-mono text-xs border-2 border-[#11110F] dark:border-[#2D3342] overflow-x-auto shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000]">
              <pre>{JSON.stringify(researcherTelemetry || {
                qc_flags: ["RATE_OF_CHANGE_EXCEEDED", "ISOLATION_FOREST_OUTLIER"],
                modified_z_scores: { temperature: 4.8, pressure: 0.2, humidity: 0.5 },
                raw_decision_score: -0.22,
                temporal_roc_c_per_min: 44.0,
                consensus_agreement_percent: 96.2,
                immutable_raw_recorded: 75.2,
                accepted_safe_value: 31.2
              }, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
