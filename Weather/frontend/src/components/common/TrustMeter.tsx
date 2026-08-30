import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface TrustMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
  breakdown?: {
    data_quality?: number;
    temporal?: number;
    multivariate?: number;
    historical?: number;
    freshness?: number;
    sensor_health?: number;
  };
}

export const TrustMeter: React.FC<TrustMeterProps> = ({
  score,
  size = 'md',
  showBreakdown = false,
  breakdown
}) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'stroke-[#11110F]';
  let bgBadge = 'bg-[#C8FF2E] text-[#11110F]';
  let categoryLabel = 'TRUSTED';
  let Icon = ShieldCheck;

  if (normalizedScore < 50) {
    colorClass = 'stroke-[#11110F]';
    bgBadge = 'bg-[#FF5C5C] text-[#11110F]';
    categoryLabel = 'LOW TRUST';
    Icon = ShieldX;
  } else if (normalizedScore < 80) {
    colorClass = 'stroke-[#11110F]';
    bgBadge = 'bg-[#FFFFFF] text-[#11110F]';
    categoryLabel = 'UNCERTAIN';
    Icon = ShieldAlert;
  }

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center p-2 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
        <svg className={size === 'lg' ? 'w-28 h-28' : size === 'sm' ? 'w-16 h-16' : 'w-24 h-24'} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-[#F4F1E8]"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-display text-[#11110F] ${
            size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-2xl'
          }`}>
            {normalizedScore}
          </span>
          <span className="text-[9px] uppercase font-mono font-bold text-[#555550]">/ 100</span>
        </div>
      </div>

      <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] ${bgBadge}`}>
        <Icon className="w-4 h-4 stroke-[2.5]" />
        <span>{categoryLabel}</span>
      </div>

      {/* Sub-score breakdown drawer */}
      {showBreakdown && breakdown && (
        <div className="w-full mt-4 space-y-2 pt-3 border-t-2 border-[#11110F] text-xs font-mono">
          <div className="flex justify-between items-center text-[#11110F]">
            <span>DATA QUALITY QC</span>
            <span className="font-bold bg-[#C8FF2E] px-1.5 py-0.5 border border-[#11110F]">{breakdown.data_quality ?? 100}%</span>
          </div>
          <div className="flex justify-between items-center text-[#11110F]">
            <span>TEMPORAL DYNAMICS</span>
            <span className="font-bold bg-[#C8FF2E] px-1.5 py-0.5 border border-[#11110F]">{breakdown.temporal ?? 100}%</span>
          </div>
          <div className="flex justify-between items-center text-[#11110F]">
            <span>MULTIVARIATE COUPLING</span>
            <span className="font-bold bg-[#C8FF2E] px-1.5 py-0.5 border border-[#11110F]">{breakdown.multivariate ?? 100}%</span>
          </div>
          <div className="flex justify-between items-center text-[#11110F]">
            <span>HISTORICAL BASELINE</span>
            <span className="font-bold bg-[#C8FF2E] px-1.5 py-0.5 border border-[#11110F]">{breakdown.historical ?? 100}%</span>
          </div>
          <div className="flex justify-between items-center text-[#11110F]">
            <span>OBSERVATION FRESHNESS</span>
            <span className="font-bold bg-[#C8FF2E] px-1.5 py-0.5 border border-[#11110F]">{breakdown.freshness ?? 100}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
