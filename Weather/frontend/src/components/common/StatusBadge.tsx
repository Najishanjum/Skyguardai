import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle, Sparkles, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'severity' | 'lifecycle' | 'provider' | 'healing';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'severity' }) => {
  const norm = status.toUpperCase();

  // Helper for brutalist badge
  const brutalClass = "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]";

  if (type === 'severity' || norm === 'NORMAL' || norm === 'WATCH' || norm === 'SUSPICIOUS' || norm === 'HIGH' || norm === 'CRITICAL') {
    switch (norm) {
      case 'NORMAL':
      case 'HEALTHY':
        return (
          <span className={`${brutalClass} bg-[#C8FF2E] text-[#11110F]`}>
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>NORMAL</span>
          </span>
        );
      case 'WATCH':
        return (
          <span className={`${brutalClass} bg-[#FFFFFF] text-[#11110F]`}>
            <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>WATCH</span>
          </span>
        );
      case 'SUSPICIOUS':
      case 'DEGRADED':
        return (
          <span className={`${brutalClass} bg-[#FF5C5C] text-[#11110F]`}>
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>SUSPICIOUS</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className={`${brutalClass} bg-[#FF5C5C] text-[#11110F]`}>
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>HIGH</span>
          </span>
        );
      case 'CRITICAL':
        return (
          <span className={`${brutalClass} bg-[#FF5C5C] text-[#11110F]`}>
            <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>CRITICAL</span>
          </span>
        );
    }
  }

  if (norm === 'UNDER_VERIFICATION') {
    return (
      <span className={`${brutalClass} bg-[#FFFFFF] text-[#11110F]`}>
        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>UNDER VERIFICATION</span>
      </span>
    );
  }
  if (norm === 'CONFIRMED_GENUINE_WEATHER_EVENT') {
    return (
      <span className={`${brutalClass} bg-[#C8FF2E] text-[#11110F]`}>
        <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>PROBABLE WEATHER EVENT</span>
      </span>
    );
  }
  if (norm === 'CONFIRMED_ANOMALY') {
    return (
      <span className={`${brutalClass} bg-[#FF5C5C] text-[#11110F]`}>
        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>CONFIRMED FAULT</span>
      </span>
    );
  }
  if (norm === 'SAFE_ESTIMATE') {
    return (
      <span className={`${brutalClass} bg-[#C8FF2E] text-[#11110F]`}>
        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>CONSENSUS RECOVERED</span>
      </span>
    );
  }
  if (norm === 'HUMAN_VERIFICATION_REQUIRED') {
    return (
      <span className={`${brutalClass} bg-[#4057FF] text-[#FFFFFF]`}>
        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>HUMAN REVIEW REQUIRED</span>
      </span>
    );
  }

  return (
    <span className={`${brutalClass} bg-[#FFFFFF] text-[#11110F]`}>
      {status}
    </span>
  );
};
