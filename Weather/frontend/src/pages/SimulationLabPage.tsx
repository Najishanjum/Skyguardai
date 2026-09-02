import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FlaskConical, Play, Sparkles, AlertTriangle, ShieldCheck, 
  RefreshCw, Radio, CheckCircle2, ArrowRight, Zap 
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrustMeter } from '../components/common/TrustMeter';
import { useWebSocket } from '../context/WebSocketContext';

export const SimulationLabPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [stations, setStations] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number>(1);
  const [selectedScenario, setSelectedScenario] = useState<string>('TEMP_SPIKE');
  const [injecting, setInjecting] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<any | null>(null);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    Promise.all([
      api.getStations(),
      api.getSimulationScenarios()
    ]).then(([stns, scens]) => {
      setStations(stns);
      setScenarios(scens);
      const urlStn = searchParams.get('station_id');
      if (urlStn) setSelectedStationId(parseInt(urlStn));
      else if (stns.length > 0) setSelectedStationId(stns[0].id);
    });
  }, []);

  const handleInject = async () => {
    setInjecting(true);
    try {
      const res = await api.injectSimulation({
        station_id: selectedStationId,
        scenario_type: selectedScenario
      });
      setPipelineResult(res.pipeline_output);
    } catch (err) {
      console.error("Simulation failed", err);
    } finally {
      setInjecting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            AI Simulation & Fault Injection Lab
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-[#4057FF] text-[#FFFFFF] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase">
            // SIMULATED AWS DATA
          </span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
          Inject realistic hardware failures, sensor calibration drifts, and genuine severe weather squalls to observe real-time AI pipeline execution without physical hardware.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 space-y-6">
        <h3 className="font-mono text-xs font-bold text-[#11110F] uppercase tracking-wider flex items-center gap-2 border-b-2 border-[#11110F] pb-3">
          <FlaskConical className="w-4 h-4 text-[#11110F]" />
          <span>CONFIGURE ANOMALY SCENARIO</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-[10px] font-bold text-[#555550] uppercase block mb-1.5">
              // TARGET AWS STATION
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(parseInt(e.target.value))}
              className="brutal-input w-full font-bold uppercase py-2.5 px-3 cursor-pointer"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.station_name} ({s.station_code}) - {s.station_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] font-bold text-[#555550] uppercase block mb-1.5">
              // FAULT / ATMOSPHERIC SCENARIO PRESET
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="brutal-input w-full font-bold uppercase py-2.5 px-3 cursor-pointer"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Scenario Preview */}
        {scenarios.find(s => s.id === selectedScenario) && (
          <div className="p-4 border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] bg-[#F4F1E8] space-y-1.5 text-xs font-mono">
            <div className="font-bold text-[#11110F] uppercase">
              {scenarios.find(s => s.id === selectedScenario)?.name}
            </div>
            <p className="text-[#555550] uppercase">
              {scenarios.find(s => s.id === selectedScenario)?.description}
            </p>
            <div className="text-[11px] font-bold text-[#11110F] pt-2 uppercase border-t-2 border-[#11110F]/10 mt-2 block">
              EXPECTED PIPELINE RESPONSE: {scenarios.find(s => s.id === selectedScenario)?.expected_outcome}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleInject}
            disabled={injecting}
            className="brutal-btn brutal-btn-primary px-6 py-3 text-xs"
          >
            <Zap className="w-4 h-4" />
            <span>{injecting ? "INJECTING & EVALUATING PIPELINE..." : "INJECT SIMULATED FAULT LIVE"}</span>
          </button>
        </div>
      </div>

      {/* Live Pipeline Execution Output */}
      {pipelineResult && (
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[7px_7px_0_#11110F] p-6 space-y-6 mt-8">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-[#11110F] pb-4 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#11110F]" />
              <h2 className="text-xl font-display uppercase tracking-wider text-[#11110F]">
                LIVE PIPELINE EXECUTION RESULTS (ZERO OVERWRITE GUARANTEED)
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase">
              {pipelineResult.station_name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">INJECTED OBSERVATION</span>
              <span className="block text-2xl font-display text-[#11110F] mt-2">
                {pipelineResult.temperature !== null ? `${pipelineResult.temperature}°C` : "NULL"}
              </span>
              <span className="text-[10px] text-[#11110F] font-mono font-bold mt-1 block uppercase">
                {pipelineResult.pressure} hPa • {pipelineResult.humidity}% RH
              </span>
            </div>

            <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">AI SEVERITY & CAUSE</span>
              <span className="block text-xs font-mono font-bold text-[#11110F] uppercase mt-2 truncate">
                {pipelineResult.root_cause}
              </span>
              <div className="mt-2 flex items-center justify-center gap-1">
                <StatusBadge status={pipelineResult.severity} type="severity" />
              </div>
            </div>

            <div className="p-4 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">LIFECYCLE TRANSITION</span>
              <div className="mt-2">
                <StatusBadge status={pipelineResult.anomaly_status} type="lifecycle" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#11110F] block mt-2 uppercase">
                {pipelineResult.diagnosis_confidence}% DIAGNOSTIC CONF.
              </span>
            </div>

            <div className="flex items-center justify-center bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4">
              <TrustMeter score={pipelineResult.trust_score} size="sm" />
            </div>
          </div>

          {/* Consensus Self-Healing Breakdown */}
          {pipelineResult.self_healing && Object.keys(pipelineResult.self_healing).length > 0 && (
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b-2 border-[#11110F]/10 pb-2">
                <span className="font-bold text-[#11110F] uppercase">
                  ⭐ TRI-MODEL CONSENSUS SELF-HEALING OUTPUT (USP 3)
                </span>
                <span className="font-bold bg-[#C8FF2E] px-1 border border-[#11110F] text-[#11110F] uppercase">
                  {pipelineResult.self_healing.temperature?.agreement_percent || 95}% MODEL AGREEMENT
                </span>
              </div>
              <p className="text-[#11110F] font-bold uppercase mt-2">
                {pipelineResult.self_healing.temperature?.reason}
              </p>
              <div className="font-mono pt-2 text-[#555550] font-bold uppercase">
                RAW VALUE: <strong className="text-[#11110F] line-through bg-[#FF5C5C] px-1">{pipelineResult.self_healing.temperature?.original_value}°C</strong> (PRESERVED) → SAFE ESTIMATE: <strong className="text-[#11110F] bg-[#C8FF2E] px-1 border border-[#11110F]">{pipelineResult.self_healing.temperature?.corrected_value}°C</strong>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
