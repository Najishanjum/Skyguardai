import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#11110F] bg-[#F4F1E8] py-6 px-6 text-xs text-[#11110F] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="font-display text-lg tracking-wider bg-[#11110F] text-white px-2 py-0.5 border border-[#11110F]">
            SKYGUARD AI
          </span>
          <span>•</span>
          <span className="font-bold uppercase">SIH 2026</span>
          <span>•</span>
          <span className="bg-[#C8FF2E] px-2 py-0.5 font-bold border border-[#11110F] shadow-[1px_1px_0_#11110F]">
            SIH26073
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center font-bold uppercase">
          <span>PROVIDER: <strong className="underline">OPEN-METEO API</strong></span>
          <span>TARGET: <strong className="underline">IMD / MOES</strong></span>
          <span>ARCH: <strong className="bg-[#FF5C5C] px-1 py-0.5 border border-[#11110F]">IMMUTABLE AUDIT LEDGER</strong></span>
        </div>
      </div>
    </footer>
  );
};
