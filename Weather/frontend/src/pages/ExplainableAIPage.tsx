import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Microscope, Wrench, User } from 'lucide-react';
import { api } from '../services/api';
import { ProgressiveDisclosure } from '../components/common/ProgressiveDisclosure';

export const ExplainableAIPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnomalies().then((data) => {
      setAnomalies(data);
      if (data.length > 0) {
        setSelectedAnomalyId(data[0].id);
        api.getAnomalyExplanation(data[0].id).then(setExplanation);
      }
      setLoading(false);
    });
  }, []);

  const handleSelectAnomaly = (id: number) => {
    setSelectedAnomalyId(id);
    api.getAnomalyExplanation(id).then(setExplanation);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b-2 border-[#11110F] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            EXPLAINABLE AI (XAI) LABORATORY
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[1px_1px_0_#11110F] font-mono uppercase">
            PROGRESSIVE DISCLOSURE
          </span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
          SHAP feature contribution attributions, ensemble decision reasoning, and plain-English natural language translations tailored to user persona.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Anomaly Selector List */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-4 space-y-3 h-[500px] overflow-y-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#555550] block mb-2 border-b-2 border-[#11110F] pb-2">
            // SELECT OBSERVATION TO EXPLAIN
          </span>
          {anomalies.map((anom) => (
            <button
              key={anom.id}
              onClick={() => handleSelectAnomaly(anom.id)}
              className={`w-full text-left p-4 transition-all flex flex-col justify-between ${
                selectedAnomalyId === anom.id
                  ? 'bg-[#C8FF2E] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]'
                  : 'bg-[#FFFFFF] border-2 border-[#11110F] hover:bg-[#F4F1E8]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold font-display text-lg uppercase text-[#11110F]">
                  ANOMALY #{anom.id}
                </span>
                <span className="font-mono font-bold text-[10px] text-[#555550]">
                  {new Date(anom.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span className="text-[#11110F] mt-2 font-mono font-bold uppercase text-[10px]">
                {anom.probable_cause}
              </span>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono font-bold border-t-2 border-[#11110F]/20 pt-2">
                <span className="text-[#11110F] uppercase">
                  SCORE: {anom.composite_score}
                </span>
                <span className="text-[#FFFFFF] bg-[#FF5C5C] px-1 border border-[#11110F] uppercase">{anom.confidence}% CONF.</span>
              </div>
            </button>
          ))}
        </div>

        {/* Explainable AI Details Container */}
        <div className="lg:col-span-2 space-y-6">
          {explanation ? (
            <ProgressiveDisclosure
              simpleExplanation={explanation.explanations?.simple_explanation}
              operatorSummary={explanation.explanations?.operator_summary}
              researcherTelemetry={explanation.explanations?.researcher_telemetry}
              featureAttribution={explanation.explanations?.feature_attribution}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-[#555550] text-[10px] font-mono font-bold uppercase bg-[#F4F1E8] border-2 border-[#11110F] border-dashed">
              SELECT AN ANOMALY EVENT TO INSPECT SHAP FEATURE ATTRIBUTIONS.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
