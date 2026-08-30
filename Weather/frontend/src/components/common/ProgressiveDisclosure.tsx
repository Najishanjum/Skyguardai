import React, { useState } from 'react';
import { User, Wrench, Microscope, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProgressiveDisclosureProps {
  simpleExplanation: string;
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

  return (
    <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] transition-all">
      {/* Header with Persona Tabs */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b-2 border-[#11110F] gap-3 bg-[#F4F1E8]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#11110F]" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#11110F]">
            // EXPLAINABLE AI (XAI) DISCLOSURE
          </h4>
        </div>

        <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 border-2 border-[#11110F]">
          <button
            onClick={() => setActiveTab('simple')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'simple'
                ? 'bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[1px_1px_0_#11110F]'
                : 'text-[#11110F] hover:bg-[#F4F1E8]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>CITIZEN</span>
          </button>

          <button
            onClick={() => setActiveTab('operator')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'operator'
                ? 'bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[1px_1px_0_#11110F]'
                : 'text-[#11110F] hover:bg-[#F4F1E8]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>OPERATOR</span>
          </button>

          <button
            onClick={() => setActiveTab('researcher')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'researcher'
                ? 'bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[1px_1px_0_#11110F]'
                : 'text-[#11110F] hover:bg-[#F4F1E8]'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>METEOROLOGIST</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'simple' && (
          <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F]">
            <p className="text-sm font-sans font-medium text-[#11110F] leading-relaxed">
              {simpleExplanation}
            </p>
          </div>
        )}

        {activeTab === 'operator' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#F4F1E8] border-2 border-[#11110F]">
              <span className="text-[11px] font-mono font-bold uppercase text-[#555550]">DIAGNOSTIC VERDICT</span>
              <p className="mt-1 text-xs text-[#11110F] font-mono font-bold">
                {operatorSummary || "All systems nominal. No corrective work order required."}
              </p>
            </div>

            {/* Feature Attribution Bar Chart */}
            {featureAttribution && featureAttribution.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono font-bold uppercase text-[#555550]">FEATURE CONTRIBUTION WEIGHTS</span>
                <div className="space-y-2">
                  {featureAttribution.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#11110F] w-1/2 truncate font-bold">{f.feature}</span>
                      <div className="w-1/3 bg-[#F4F1E8] h-3 border border-[#11110F] overflow-hidden mx-2">
                        <div
                          className="bg-[#C8FF2E] h-full"
                          style={{ width: `${f.importance_percent}%` }}
                        />
                      </div>
                      <span className="font-bold text-[#11110F] text-right w-12">{f.importance_percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'researcher' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#11110F] text-[#C8FF2E] font-mono text-xs border-2 border-[#11110F] overflow-x-auto shadow-[3px_3px_0_#11110F]">
              <pre>{JSON.stringify(researcherTelemetry || { message: "Nominal operational telemetry" }, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
