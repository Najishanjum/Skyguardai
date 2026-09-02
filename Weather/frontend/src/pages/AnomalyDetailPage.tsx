import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AlertTriangle, ArrowLeft, CheckCircle2, XCircle, 
  Sparkles, ShieldCheck, Clock, BrainCircuit, Activity 
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressiveDisclosure } from '../components/common/ProgressiveDisclosure';

export const AnomalyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [explanation, setExplanation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (id) {
      const anomId = parseInt(id);
      Promise.all([
        api.getAnomalyDeepDive(anomId),
        api.getAnomalyExplanation(anomId)
      ]).then(([d, exp]) => {
        setData(d);
        setExplanation(exp);
        setLoading(false);
      });
    }
  }, [id]);

  const handleResolve = async () => {
    if (!id) return;
    setResolving(true);
    try {
      await api.resolveAnomaly(parseInt(id));
      const updated = await api.getAnomalyDeepDive(parseInt(id));
      setData(updated);
    } catch (err) {
      console.error("Failed to resolve", err);
    } finally {
      setResolving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { anomaly, station, observation, verification_timeline, self_healing } = data;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div className="flex items-center gap-4">
          <Link
            to="/anomalies"
            className="p-2 bg-[#FFFFFF] border-2 border-[#11110F] hover:bg-[#F4F1E8] shadow-[2px_2px_0_#11110F] text-[#11110F]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
                ANOMALY DEEP DIVE #{anomaly.id}
              </h1>
              <StatusBadge status={anomaly.status} type="lifecycle" />
            </div>
            <p className="text-[10px] font-mono font-bold text-[#555550] mt-1 block uppercase">
              STATION: <strong className="text-[#11110F]">{station?.name}</strong> ({station?.code}) • TRIGGERED: {new Date(anomaly.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {anomaly.status !== 'RESOLVED' && (
          <button
            onClick={handleResolve}
            disabled={resolving}
            className="brutal-btn brutal-btn-primary px-4 py-3 text-[10px] flex items-center gap-1.5 uppercase"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{resolving ? "RESOLVING..." : "MARK ANOMALY AS RESOLVED"}</span>
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
          <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-3">
            DIAGNOSED ROOT CAUSE
          </span>
          <span className="text-lg font-display uppercase text-[#11110F] block">
            {anomaly.probable_cause}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#FFFFFF] bg-[#FF5C5C] border border-[#11110F] px-1 mt-2 inline-block uppercase">
            {anomaly.confidence}% CONFIDENCE
          </span>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
          <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-3">
            RAW INGESTED VALUES
          </span>
          <div className="flex flex-wrap items-center gap-4 font-mono text-sm font-bold text-[#11110F] uppercase">
            <span>TEMP: {observation?.temperature}°C</span>
            <span>PRES: {observation?.pressure} hPa</span>
            <span>RH: {observation?.humidity}%</span>
          </div>
          <span className="text-[10px] font-bold font-mono bg-[#C8FF2E] text-[#11110F] border border-[#11110F] px-1 mt-3 inline-block uppercase">
            ✓ 100% IMMUTABLE RAW STORAGE PRESERVED
          </span>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5">
          <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block border-b-2 border-[#11110F] pb-2 mb-3">
            HYBRID AI FUSION SCORE
          </span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-display text-[#11110F]">
              {anomaly.composite_score}
            </span>
            <StatusBadge status={anomaly.severity} type="severity" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#555550] mt-2 block uppercase">
            ENSEMBLE: QC ({anomaly.rule_score}%) + STAT ({anomaly.statistical_score}%) + ML ({anomaly.isolation_forest_score}%)
          </span>
        </div>
      </div>

      {/* Adaptive Verification Timeline (USP 2) */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#11110F] stroke-[2.5]" />
          <h3 className="text-lg font-display text-[#11110F] uppercase tracking-wider">
            ⭐ ADAPTIVE EVIDENCE VERIFICATION TIMELINE (USP 2)
          </h3>
        </div>
        <p className="text-[10px] font-mono font-bold text-[#555550] uppercase">
          The system gathers sequential evidentiary telemetry over multiple polling steps before committing to a final diagnosis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {verification_timeline.length > 0 ? (
            verification_timeline.map((ev: any, i: number) => (
              <div key={i} className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#11110F] font-mono uppercase bg-[#C8FF2E] border border-[#11110F] px-1">
                    STEP {ev.step}
                  </span>
                  <span className="text-[10px] font-bold text-[#555550] uppercase">{new Date(ev.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="mt-3 text-[10px] font-mono font-bold text-[#11110F] uppercase">
                  {ev.note}
                </p>
                <div className="mt-3 text-[10px] font-mono font-bold text-[#555550] uppercase border-t-2 border-[#11110F]/20 pt-2">
                  DIVERGENCE INDEX: {ev.divergence}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-4 bg-[#F4F1E8] border-2 border-[#11110F] border-dashed text-[10px] font-mono font-bold text-[#555550] text-center uppercase">
              SINGLE-CYCLE TRANSIENT TRIGGER RECORDED.
            </div>
          )}
        </div>
      </div>

      {/* Consensus-Based Self-Healing Recovery (USP 3) */}
      {self_healing && self_healing.length > 0 && (
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5 space-y-5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#11110F] stroke-[2.5]" />
            <h3 className="text-lg font-display text-[#11110F] uppercase tracking-wider">
              ⭐ CONSENSUS-BASED SELF-HEALING RECOVERY (USP 3)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 font-mono">
            {self_healing.map((sh: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                  <span className="text-[10px] font-mono font-bold text-[#555550] block uppercase">MODEL A: TEMPORAL LAG</span>
                  <span className="text-lg font-display text-[#11110F] mt-1 block">
                    {sh.model_temporal}°C
                  </span>
                </div>

                <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                  <span className="text-[10px] font-mono font-bold text-[#555550] block uppercase">MODEL B: DIURNAL BASELINE</span>
                  <span className="text-lg font-display text-[#11110F] mt-1 block">
                    {sh.model_historical}°C
                  </span>
                </div>

                <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                  <span className="text-[10px] font-mono font-bold text-[#555550] block uppercase">MODEL C: MULTIVARIATE</span>
                  <span className="text-lg font-display text-[#11110F] mt-1 block">
                    {sh.model_multivariate}°C
                  </span>
                </div>

                <div className="p-4 bg-[#C8FF2E] border-2 border-[#11110F] shadow-[1px_1px_0_#11110F]">
                  <span className="text-[10px] font-mono font-bold text-[#11110F] block uppercase">CONSENSUS VALUE</span>
                  <span className="text-lg font-display text-[#11110F] mt-1 block">
                    {sh.corrected_value ? `${sh.corrected_value}°C` : "WITHHELD"}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#555550] block mt-2 uppercase border-t-2 border-[#11110F]/20 pt-2">
                    {sh.agreement_percent}% MODEL AGREEMENT
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Explainable AI Component */}
      {explanation && (
        <ProgressiveDisclosure
          simpleExplanation={explanation.explanations?.simple_explanation}
          operatorSummary={explanation.explanations?.operator_summary}
          researcherTelemetry={explanation.explanations?.researcher_telemetry}
          featureAttribution={explanation.explanations?.feature_attribution}
        />
      )}

    </div>
  );
};
