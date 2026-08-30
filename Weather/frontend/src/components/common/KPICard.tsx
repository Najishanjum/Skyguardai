import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'sky' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'sky'
}) => {
  const iconBgMap = {
    sky: 'bg-[#C8FF2E] text-[#11110F]',
    cyan: 'bg-[#C8FF2E] text-[#11110F]',
    emerald: 'bg-[#C8FF2E] text-[#11110F]',
    amber: 'bg-[#FF5C5C] text-[#11110F]',
    rose: 'bg-[#FF5C5C] text-[#11110F]',
    purple: 'bg-[#4057FF] text-[#FFFFFF]',
  };

  return (
    <div className="p-5 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0_#11110F] transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#11110F]">
          // {title}
        </span>
        <div className={`p-2 border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] ${iconBgMap[colorScheme]}`}>
          <Icon className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-display uppercase tracking-wider text-[#11110F]">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-mono font-bold px-2 py-0.5 border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase ${
            trend.isPositive 
              ? 'bg-[#C8FF2E] text-[#11110F]' 
              : 'bg-[#FF5C5C] text-[#11110F]'
          }`}>
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs font-mono text-[#555550] uppercase tracking-wide border-t border-[#11110F]/10 pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
