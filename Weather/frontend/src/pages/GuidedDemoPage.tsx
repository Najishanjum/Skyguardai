import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle2, ArrowRight, Sparkles, 
  RefreshCw, Video
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrustMeter } from '../components/common/TrustMeter';
import confetti from 'canvas-confetti';

export const GuidedDemoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [demoState, setDemoState] = useState<any>({
    temp: 31.2,
    pres: 1008.4,
    hum: 64.0,
    trust: 96.5,
    status: 'NORMAL',
    severity: 'NORMAL',
    cause: 'Nominal Operation',
    confidence: 98,
    fingerprintMatch: null,
    consensusEstimate: null,
    evidenceSteps: []
  });
  const [runningStep, setRunningStep] = useState(false);

  const steps = [
    {
      title: "1. Nominal Live Baseline Ingestion",
      desc: "System ingests current live meteorological stream for Safdarjung AWS (New Delhi). All parameters are thermodynamically balanced with 96.5/100 Weather Trust Score."
    },
    {
      title: "2. Transient Sensor Spike Injection (+44°C Jump)",
      desc: "Simulate electrical impulse surge on PT100 temperature probe (31.2°C → 75.2°C) while barometric pressure and relative humidity remain static."
    },
    {
      title: "3. AI Hybrid Detection & Adaptive Verification Trigger",
      desc: "Rule QC, Modified Z-score (4.8), and Isolation Forest flag observation. Lifecycle transitions to 'UNDER_VERIFICATION' to avoid premature classification."
    },
    {
      title: "4. Evidentiary Accumulation & Root Cause Diagnosis",
      desc: "Subsequent reading reverts to baseline. System confirms isolated hardware sensor spike (97% confidence) instead of genuine meteorological front."
    },
    {
      title: "5. Fault Fingerprint Library Match (USP 4)",
      desc: "Signature vector extracted and compared via Cosine Similarity. 94.2% match with FP-TEMP-SPIKE-01 (RTD Impulse Glitch)."
    },
    {
      title: "6. Tri-Model Consensus Self-Healing & Audit Ledger (USP 3)",
      desc: "Temporal Lag (31.2°C), Diurnal Baseline (31.0°C), and Multivariate Model (31.4°C) achieve 96.2% agreement. Safe estimate accepted; raw 75.2°C preserved 100% in audit ledger."
    }
  ];

  const handleNextStep = async () => {
    setRunningStep(true);
    const next = currentStep + 1;
    setCurrentStep(next);

    if (next === 1) {
      setDemoState({
        temp: 75.2,
        pres: 1008.4,
        hum: 64.0,
        trust: 18.0,
        status: 'UNDER_VERIFICATION',
        severity: 'CRITICAL',
        cause: 'Temperature Sensor Spike',
        confidence: 95,
        fingerprintMatch: null,
        consensusEstimate: null,
        evidenceSteps: ["Initial severe thermal divergence (+44.0°C) without barometric coupling."]
      });
    } else if (next === 2) {
      setDemoState((prev: any) => ({
        ...prev,
        evidenceSteps: [
          ...prev.evidenceSteps,
          "Cycle 2: Monitoring subsequent frame for atmospheric front coherence."
        ]
      }));
    } else if (next === 3) {
      setDemoState((prev: any) => ({
        ...prev,
        status: 'CONFIRMED_ANOMALY',
        confidence: 97,
        evidenceSteps: [
          ...prev.evidenceSteps,
          "Cycle 3: Reading reverted to baseline (31.3°C). Transient hardware spike confirmed."
        ]
      }));
    } else if (next === 4) {
      setDemoState((prev: any) => ({
        ...prev,
        fingerprintMatch: {
          code: 'FP-TEMP-SPIKE-01',
          type: 'Temperature Sensor Spike',
          similarity: 94.2,
          recommendation: 'Check RTD wiring harness and shield grounding.'
        }
      }));
    } else if (next === 5) {
      setDemoState((prev: any) => ({
        ...prev,
        consensusEstimate: {
          modelA: 31.2,
          modelB: 31.0,
          modelC: 31.4,
          agreement: 96.2,
          consensus: 31.2,
          status: 'SAFE_ESTIMATE'
        }
      }));
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setRunningStep(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDemoState({
      temp: 31.2,
      pres: 1008.4,
      hum: 64.0,
      trust: 96.5,
      status: 'NORMAL',
      severity: 'NORMAL',
      cause: 'Nominal Operation',
      confidence: 98,
      fingerprintMatch: null,
      consensusEstimate: null,
      evidenceSteps: []
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-tight text-[#11110F]">
              GUIDED SIH DEMONSTRATION
            </h1>
            <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase">
              JUDGE EVALUATION
            </span>
          </div>
          <p className="font-mono text-xs text-[#555550] uppercase mt-1">
            One-click interactive guided narrative demonstrating the complete 13-stage intelligent weather trust & recovery pipeline.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="brutal-btn brutal-btn-tertiary text-xs py-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RESET SCRIPT</span>
        </button>
      </div>

      {/* Video Demonstration Showcase Section */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[7px_7px_0_#11110F] p-5">
        <div className="flex items-center justify-between border-b-2 border-[#11110F] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#11110F]" />
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#11110F]">
              SKYGUARD AI DEMONSTRATION VIDEO
            </h2>
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#C8FF2E] text-[#11110F] border border-[#11110F] uppercase">
            HD MP4 WALKTHROUGH
          </span>
        </div>

        <div className="relative bg-[#11110F] border-2 border-[#11110F] overflow-hidden">
          <video 
            src="/Skyguard.mp4" 
            controls 
            autoPlay={false}
            loop={false}
            muted={false}
            poster=""
            className="w-full h-auto max-h-[500px] mx-auto object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`p-3 border-2 border-[#11110F] text-xs font-mono transition-all ${
              currentStep === idx
                ? 'bg-[#C8FF2E] text-[#11110F] shadow-[4px_4px_0_#11110F] font-bold'
                : currentStep > idx
                ? 'bg-[#FFFFFF] text-[#11110F] shadow-[2px_2px_0_#11110F]'
                : 'bg-[#F4F1E8] text-[#555550] opacity-70'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1 uppercase">
              {currentStep > idx ? (
                <CheckCircle2 className="w-4 h-4 text-[#11110F]" />
              ) : (
                <span className="w-4 h-4 bg-[#11110F] text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
              )}
              <span className="truncate">STAGE {idx + 1}</span>
            </div>
            <span className="text-[11px] font-bold uppercase block truncate">
              {s.title.split('.')[1]}
            </span>
          </div>
        ))}
      </div>

      {/* Current Step Narrative Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#11110F] pb-3">
          <h2 className="text-xl font-display uppercase tracking-wider text-[#11110F] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#11110F]" />
            <span>{steps[currentStep]?.title}</span>
          </h2>
          <span className="font-mono text-xs font-bold bg-[#C8FF2E] px-2 py-0.5 border border-[#11110F]">
            STEP {currentStep + 1} OF 6
          </span>
        </div>

        <p className="font-sans text-sm text-[#11110F] leading-relaxed font-medium">
          {steps[currentStep]?.desc}
        </p>

        {currentStep < 5 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextStep}
              disabled={runningStep}
              className="brutal-btn brutal-btn-secondary text-xs px-5 py-2.5"
            >
              <span>EXECUTE NEXT STAGE ({currentStep + 2}/6)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Live State Visualizer Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        
        {/* Telemetry */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 text-center">
          <span className="text-[10px] font-bold text-[#555550] uppercase">// LIVE TEMP</span>
          <span className={`block text-3xl font-display mt-1 ${demoState.temp > 50 ? 'text-[#FF5C5C] bg-[#11110F] border border-[#11110F]' : 'text-[#11110F]'}`}>
            {demoState.temp}°C
          </span>
          <span className="text-[11px] font-bold text-[#555550] mt-1 block uppercase">
            PRES: {demoState.pres} hPa • RH: {demoState.hum}%
          </span>
        </div>

        {/* Anomaly & Lifecycle */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 text-center">
          <span className="text-[10px] font-bold text-[#555550] uppercase">// DIAGNOSIS & STATUS</span>
          <span className="block text-xs font-bold text-[#11110F] uppercase mt-1">
            {demoState.cause}
          </span>
          <div className="mt-2 flex items-center justify-center gap-1">
            <StatusBadge status={demoState.status} type="lifecycle" />
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center justify-center">
          <TrustMeter score={demoState.trust} size="sm" />
        </div>

        {/* Fingerprint Match */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 text-center">
          <span className="text-[10px] font-bold text-[#555550] uppercase">// FAULT FINGERPRINT</span>
          {demoState.fingerprintMatch ? (
            <div className="mt-1">
              <span className="font-bold text-xs bg-[#4057FF] text-[#FFFFFF] px-1 border border-[#11110F] block">
                {demoState.fingerprintMatch.code}
              </span>
              <span className="text-xs font-bold text-[#11110F] bg-[#C8FF2E] px-1 border border-[#11110F] block mt-1">
                {demoState.fingerprintMatch.similarity}% SIMILARITY
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#555550] block mt-2 font-bold uppercase">AWAITING PATTERN MATCH</span>
          )}
        </div>

      </div>

      {/* Consensus Self-Healing Output (USP 3) */}
      {demoState.consensusEstimate && (
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#11110F] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#11110F]" />
              <h3 className="font-display text-xl uppercase tracking-wider text-[#11110F]">
                CONSENSUS SELF-HEALING RECOVERY ACTIVATED (USP 3)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold bg-[#C8FF2E] px-2 py-0.5 border border-[#11110F]">
              {demoState.consensusEstimate.agreement}% AGREEMENT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
            <div className="p-2.5 bg-[#F4F1E8] border-2 border-[#11110F]">
              <span className="text-[10px] text-[#555550] block uppercase font-bold">MODEL A (TEMPORAL)</span>
              <span className="font-bold text-sm text-[#11110F]">{demoState.consensusEstimate.modelA}°C</span>
            </div>
            <div className="p-2.5 bg-[#F4F1E8] border-2 border-[#11110F]">
              <span className="text-[10px] text-[#555550] block uppercase font-bold">MODEL B (DIURNAL)</span>
              <span className="font-bold text-sm text-[#11110F]">{demoState.consensusEstimate.modelB}°C</span>
            </div>
            <div className="p-2.5 bg-[#F4F1E8] border-2 border-[#11110F]">
              <span className="text-[10px] text-[#555550] block uppercase font-bold">MODEL C (MULTIVARIATE)</span>
              <span className="font-bold text-sm text-[#11110F]">{demoState.consensusEstimate.modelC}°C</span>
            </div>
            <div className="p-2.5 bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
              <span className="text-[10px] text-[#11110F] block font-bold uppercase">CONSENSUS ESTIMATE</span>
              <span className="font-extrabold text-sm">{demoState.consensusEstimate.consensus}°C</span>
            </div>
          </div>

          <div className="p-3 bg-[#F4F1E8] border-2 border-[#11110F] text-xs font-mono flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#11110F] uppercase font-bold">
              RAW OUTLIER: <strong className="line-through bg-[#FF5C5C] px-1 text-[#11110F]">75.2°C</strong> PRESERVED IN DB • CORRECTED: <strong className="bg-[#C8FF2E] px-1 text-[#11110F]">31.2°C</strong>
            </span>
            <Link to="/audit" className="font-bold text-[#11110F] uppercase underline hover:bg-[#C8FF2E] px-1">
              INSPECT AUDIT LEDGER →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
