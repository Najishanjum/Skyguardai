import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Radio, Sliders, CheckCircle2, Palette, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, accent, setAccent, accentOptions } = useTheme();
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
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F] dark:text-[#F3F4F6]">
          SYSTEM, THEME & MODEL CONFIGURATION
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#555550] dark:text-[#9CA3AF] uppercase mt-1">
          Adjust visual themes, live weather provider routing, polling rates, and AI threshold parameters.
        </p>
      </div>

      {/* Theme & Visual Appearance Customization Card */}
      <div className="brutal-card p-6 space-y-6">
        <h3 className="font-mono text-xs font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b-2 border-current pb-3">
          <Palette className="w-4 h-4 text-[var(--color-accent)]" />
          <span>APPEARANCE & THEME COLOR ACCENTS</span>
        </h3>

        {/* Dark/Light Mode Selector */}
        <div>
          <label className="font-mono text-[10px] font-bold text-[#555550] dark:text-[#9CA3AF] uppercase block mb-2">
            // INTERFACE DISPLAY MODE
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 border-2 flex items-center gap-3 transition-all text-left ${
                theme === 'light'
                  ? 'bg-[var(--color-accent)] text-[#11110F] border-[#11110F] shadow-[3px_3px_0_#11110F]'
                  : 'bg-[#FFFFFF] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] border-[#11110F] dark:border-[#2D3342] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
              }`}
            >
              <Sun className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold text-xs font-mono uppercase block">Light Clear Sky</span>
                <span className="text-[10px] font-mono opacity-80 uppercase block mt-0.5">High-contrast brutalist paper canvas</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 border-2 flex items-center gap-3 transition-all text-left ${
                theme === 'dark'
                  ? 'bg-[var(--color-accent)] text-[#11110F] border-[#11110F] shadow-[3px_3px_0_#000000]'
                  : 'bg-[#FFFFFF] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] border-[#11110F] dark:border-[#2D3342] hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
              }`}
            >
              <Moon className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold text-xs font-mono uppercase block">Dark Command Center</span>
                <span className="text-[10px] font-mono opacity-80 uppercase block mt-0.5">Deep OLED night command aesthetic</span>
              </div>
            </button>
          </div>
        </div>

        {/* Accent Color Palette Selector */}
        <div>
          <label className="font-mono text-[10px] font-bold text-[#555550] dark:text-[#9CA3AF] uppercase block mb-2">
            // VIBRANT THEME ACCENT COLOR
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {accentOptions.map((opt) => {
              const isSelected = accent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAccent(opt.id)}
                  className={`p-3 border-2 flex items-center gap-2.5 transition-all text-left ${
                    isSelected
                      ? 'border-[#11110F] dark:border-[#FFFFFF] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] translate-x-[-1px] translate-y-[-1px]'
                      : 'border-[#11110F]/40 dark:border-[#2D3342] hover:border-[#11110F] dark:hover:border-[#FFFFFF]'
                  } bg-[#FFFFFF] dark:bg-[#1B202B]`}
                >
                  <span
                    className="w-4 h-4 border border-[#11110F] dark:border-[#FFFFFF] flex-shrink-0"
                    style={{ backgroundColor: opt.hex }}
                  />
                  <div className="truncate">
                    <span className="font-mono text-[11px] font-bold text-[#11110F] dark:text-[#F3F4F6] block truncate">
                      {opt.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-[#555550] dark:text-[#9CA3AF] block uppercase">
                      {opt.hex}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Theme Preview Box */}
        <div className="p-4 border-2 border-current bg-[#F4F1E8] dark:bg-[#1B202B] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="font-mono text-xs font-bold uppercase text-[#11110F] dark:text-[#F3F4F6]">
              ACTIVE ACCENT: {accentOptions.find(a => a.id === accent)?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 text-xs font-mono font-bold uppercase border-2 border-[#11110F] dark:border-white shadow-[2px_2px_0_#11110F] dark:shadow-[2px_2px_0_#000000]"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
            >
              BUTTON PREVIEW
            </span>
            <span className="px-2 py-1 text-[10px] font-mono font-bold uppercase border border-current bg-transparent text-[#11110F] dark:text-[#F3F4F6]">
              HIGH CONTRAST
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Weather Provider Configuration */}
        <div className="brutal-card p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b-2 border-current pb-3">
            <Radio className="w-4 h-4 text-[var(--color-accent)]" />
            <span>METEOROLOGICAL DATA INGESTION PROVIDERS</span>
          </h3>

          <div className="space-y-4 pt-2">
            <label className={`flex items-start gap-3 p-4 border-2 border-[#11110F] dark:border-[#2D3342] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] cursor-pointer transition-colors ${
              provider === 'open_meteo'
                ? 'bg-[var(--color-accent)] text-[#11110F]'
                : 'bg-[#F4F1E8] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] hover:bg-[var(--color-accent)]/20'
            }`}>
              <input
                type="radio"
                name="provider"
                value="open_meteo"
                checked={provider === 'open_meteo'}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs font-mono uppercase block">
                  Open-Meteo API (Primary Global Ingestion)
                </span>
                <span className="text-[10px] font-mono font-bold opacity-75 uppercase mt-1 block">
                  Global high-resolution WMO-compliant meteorological model. Active (No key required).
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 border-[#11110F] dark:border-[#2D3342] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] cursor-pointer transition-colors ${
              provider === 'imd'
                ? 'bg-[var(--color-accent)] text-[#11110F]'
                : 'bg-[#F4F1E8] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] hover:bg-[var(--color-accent)]/20'
            }`}>
              <input
                type="radio"
                name="provider"
                value="imd"
                checked={provider === 'imd'}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs font-mono uppercase block">
                  India Meteorological Department (IMD Official AWS)
                </span>
                <span className="text-[10px] font-mono font-bold opacity-75 uppercase mt-1 block">
                  Direct official AWS access (Configurable via IMD_API_KEY / IMD_ENDPOINT).
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 border-[#11110F] dark:border-[#2D3342] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] cursor-pointer transition-colors ${
              provider === 'open_weather'
                ? 'bg-[var(--color-accent)] text-[#11110F]'
                : 'bg-[#F4F1E8] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] hover:bg-[var(--color-accent)]/20'
            }`}>
              <input
                type="radio"
                name="provider"
                value="open_weather"
                checked={provider === 'open_weather'}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs font-mono uppercase block">
                  OpenWeatherMap API
                </span>
                <span className="text-[10px] font-mono font-bold opacity-75 uppercase mt-1 block">
                  Secondary global provider (Configurable via OPENWEATHER_API_KEY).
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* AI & Polling Parameters */}
        <div className="brutal-card p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#11110F] dark:text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b-2 border-current pb-3">
            <Sliders className="w-4 h-4 text-[var(--color-accent)]" />
            <span>AI PIPELINE & INGESTION POLLING RATES</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="font-mono text-[10px] font-bold text-[#555550] dark:text-[#9CA3AF] uppercase block mb-1.5">
                // BACKGROUND INGESTION INTERVAL (SECONDS)
              </label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 60)}
                min={10}
                max={600}
                className="brutal-input w-full"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] font-bold text-[#555550] dark:text-[#9CA3AF] uppercase block mb-1.5">
                // CONSENSUS SELF-HEALING THRESHOLD (% AGREEMENT)
              </label>
              <input
                type="number"
                value={consensusThreshold}
                onChange={(e) => setConsensusThreshold(parseInt(e.target.value) || 85)}
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
            <span
              className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-[#11110F] dark:border-white shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000]"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>SETTINGS & THEME SYNCHRONIZED SUCCESSFULLY!</span>
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
