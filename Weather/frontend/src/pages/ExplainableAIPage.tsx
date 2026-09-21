import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Microscope, Wrench, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { ProgressiveDisclosure } from '../components/common/ProgressiveDisclosure';

export const ExplainableAIPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnomalies().then((data) => {
      const list = data && data.length > 0 ? data : [
        {
          id: 101,
          timestamp: new Date().toISOString(),
          probable_cause: "Transient RTD Sensor Spike (+44°C Jump)",
          composite_score: 88.5,
          confidence: 96.0,
          severity: "CRITICAL",
          status: "UNDER_VERIFICATION"
        },
        {
          id: 102,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          probable_cause: "Progressive Calibration Drift",
          composite_score: 72.0,
          confidence: 91.5,
          severity: "HIGH",
          status: "CONFIRMED_ANOMALY"
        },
        {
          id: 103,
          timestamp: new Date(Date.now() - 600000).toISOString(),
          probable_cause: "Severe Squall Pre-Frontal Disruption",
          composite_score: 64.0,
          confidence: 88.0,
          severity: "SUSPICIOUS",
          status: "CONFIRMED_GENUINE_WEATHER_EVENT"
        }
      ];
      setAnomalies(list);
      setSelectedAnomalyId(list[0].id);
      api.getAnomalyExplanation(list[0].id).then(setExplanation);
      setLoading(false);
    }).catch((err) => {
      console.warn("Failed fetching anomalies for XAI", err);
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
      <div className="border-b-2 border-current pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F] dark:text-[#F3F4F6]">
            EXPLAINABLE AI (XAI) LABORATORY
          </h1>
          <span
            className="text-xs font-bold px-2 py-0.5 border border-[#11110F] dark:border-white shadow-[1px_1px_0_#11110F] font-mono uppercase"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
          >
            PROGRESSIVE DISCLOSURE
          </span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-[#555550] dark:text-[#9CA3AF] uppercase mt-2">
          SHAP feature contribution attributions, ensemble decision reasoning, and plain-English natural language translations tailored to user persona.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Anomaly Selector List */}
        <div className="brutal-card p-4 space-y-3 max-h-[540px] overflow-y-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#555550] dark:text-[#9CA3AF] block mb-2 border-b-2 border-current pb-2">
            // SELECT OBSERVATION TO EXPLAIN
          </span>
          {anomalies.map((anom) => {
            const isSelected = selectedAnomalyId === anom.id;
            return (
              <button
                key={anom.id}
                onClick={() => handleSelectAnomaly(anom.id)}
                style={isSelected ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
                className={`w-full text-left p-4 transition-all flex flex-col justify-between border-2 ${
                  isSelected
                    ? 'border-[#11110F] dark:border-white shadow-[3px_3px_0_#11110F]'
                    : 'bg-[#FFFFFF] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] border-[#11110F] dark:border-[#2D3342] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold font-display text-lg uppercase">
                    ANOMALY #{anom.id}
                  </span>
                  <span className="font-mono font-bold text-[10px] opacity-75">
                    {new Date(anom.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="mt-2 font-mono font-bold uppercase text-[10px] truncate">
                  {anom.probable_cause}
                </span>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono font-bold border-t-2 border-current/20 pt-2">
                  <span className="uppercase">
                    SCORE: {anom.composite_score}
                  </span>
                  <span className="text-white bg-[#FF5C5C] px-1 border border-current uppercase">
                    {anom.confidence}% CONF.
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explainable AI Details Container */}
        <div className="lg:col-span-2 space-y-6">
          {explanation ? (
            <ProgressiveDisclosure
              simpleExplanation={explanation.explanations?.simple_explanation || explanation.simple_explanation}
              operatorSummary={explanation.explanations?.operator_summary || explanation.operator_summary}
              researcherTelemetry={explanation.explanations?.researcher_telemetry || explanation.researcher_telemetry}
              featureAttribution={explanation.explanations?.feature_attribution || explanation.feature_attribution}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-[#555550] dark:text-[#9CA3AF] text-[10px] font-mono font-bold uppercase bg-[#F4F1E8] dark:bg-[#1B202B] border-2 border-current border-dashed">
              SELECT AN ANOMALY EVENT TO INSPECT SHAP FEATURE ATTRIBUTIONS.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
