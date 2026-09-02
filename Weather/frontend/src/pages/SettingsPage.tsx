import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Radio, Sliders, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [provider, setProvider] = useState('open_meteo');
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [consensusThreshold, setConsensusThreshold] = useState(85);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
          SYSTEM & MODEL CONFIGURATION
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
          Adjust live weather provider routing, polling rates, and AI threshold parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Weather Provider Configuration */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#11110F] uppercase tracking-wider flex items-center gap-2 border-b-2 border-[#11110F] pb-3">
            <Radio className="w-4 h-4 text-[#11110F]" />
            <span>METEOROLOGICAL DATA INGESTION PROVIDERS</span>
          </h3>

          <div className="space-y-4 pt-2">
            <label className={`flex items-start gap-3 p-4 border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] cursor-pointer transition-colors ${provider === 'open_meteo' ? 'bg-[#C8FF2E]' : 'bg-[#F4F1E8] hover:bg-[#C8FF2E]/20'}`}>
              <input
                type="radio"
                name="provider"
                value="open_meteo"
                checked={provider === 'open_meteo'}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs text-[#11110F] font-mono uppercase block">
                  Open-Meteo API (Primary Global Ingestion)
                </span>
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">
                  Global high-resolution WMO-compliant meteorological model. Active (No key required).
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] cursor-pointer transition-colors ${provider === 'imd' ? 'bg-[#C8FF2E]' : 'bg-[#F4F1E8] hover:bg-[#C8FF2E]/20'}`}>
              <input
                type="radio"
                name="provider"
                value="imd"
                checked={provider === 'imd'}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs text-[#11110F] font-mono uppercase block">
                  India Meteorological Department (IMD Official AWS)
                </span>
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">
                  Direct official AWS access (Configurable via IMD_API_KEY / IMD_ENDPOINT).
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] cursor-pointer transition-colors ${provider === 'open_weather' ? 'bg-[#C8FF2E]' : 'bg-[#F4F1E8] hover:bg-[#C8FF2E]/20'}`}>
              <input
                type="radio"
                name="provider"
                value="open_weather"
                checked={provider === 'open_weather'}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs text-[#11110F] font-mono uppercase block">
                  OpenWeatherMap API
                </span>
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">
                  Secondary global provider (Configurable via OPENWEATHER_API_KEY).
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* AI & Polling Parameters */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#11110F] uppercase tracking-wider flex items-center gap-2 border-b-2 border-[#11110F] pb-3">
            <Sliders className="w-4 h-4 text-[#11110F]" />
            <span>AI PIPELINE & INGESTION POLLING RATES</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="font-mono text-[10px] font-bold text-[#555550] uppercase block mb-1.5">
                // BACKGROUND INGESTION INTERVAL (SECONDS)
              </label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                min={10}
                max={600}
                className="brutal-input w-full"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] font-bold text-[#555550] uppercase block mb-1.5">
                // CONSENSUS SELF-HEALING THRESHOLD (% AGREEMENT)
              </label>
              <input
                type="number"
                value={consensusThreshold}
                onChange={(e) => setConsensusThreshold(parseInt(e.target.value))}
                min={60}
                max={99}
                className="brutal-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#11110F] uppercase tracking-wider bg-[#C8FF2E] px-3 py-1.5 border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
              <CheckCircle2 className="w-4 h-4 text-[#11110F]" />
              <span>SETTINGS SYNCHRONIZED SUCCESSFULLY!</span>
            </span>
          ) : <div />}

          <button
            type="submit"
            className="brutal-btn brutal-btn-primary px-6 py-3 text-xs"
          >
            <span>SAVE CONFIGURATIONS</span>
          </button>
        </div>

      </form>

    </div>
  );
};
