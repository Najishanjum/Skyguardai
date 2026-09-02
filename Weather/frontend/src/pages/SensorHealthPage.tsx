import React, { useState, useEffect } from 'react';
import { HeartPulse, Wrench, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { api } from '../services/api';

export const SensorHealthPage: React.FC = () => {
  const [matrix, setMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHealthMatrix().then((data) => {
      setMatrix(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
          SENSOR HEALTH & TRANSDUCER RELIABILITY MATRIX
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
          Dynamic transducer physical health degradation tracking, drift detection & failure prediction across all AWS nodes.
        </p>
      </div>

      {/* Grid of Station Health Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {matrix.map((stn) => (
          <div key={stn.station_id} className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5 space-y-5">
            
            <div className="flex items-center justify-between border-b-2 border-[#11110F] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#11110F] font-display uppercase truncate">
                  {stn.station_name}
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-1 block">
                  {stn.station_code} • {stn.state}
                </span>
              </div>
              <span className={`text-[11px] font-bold font-mono px-2 py-0.5 border border-[#11110F] shadow-[2px_2px_0_#11110F] ${
                stn.overall_status === 'HEALTHY' 
                  ? 'bg-[#C8FF2E] text-[#11110F]' 
                  : 'bg-[#FF5C5C] text-[#11110F]'
              }`}>
                {stn.overall_status}
              </span>
            </div>

            {/* Individual Sensors Health */}
            <div className="space-y-4">
              {['TEMPERATURE', 'PRESSURE', 'HUMIDITY'].map((stype) => {
                const sData = stn.sensors?.[stype] || { score: 95, risk: 'LOW', degradation: 0.1 };
                const score = Math.round(sData.score);
                
                let barColor = 'bg-[#C8FF2E]';
                if (score < 50) barColor = 'bg-[#FF5C5C]';
                else if (score < 80) barColor = 'bg-[#4057FF]';

                return (
                  <div key={stype} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#11110F] font-mono uppercase">
                        {stype === 'TEMPERATURE' ? 'PT100 Temperature Probe' : (stype === 'PRESSURE' ? 'Barometric Transducer' : 'Capacitive Hygrometer')}
                      </span>
                      <span className="font-mono font-bold text-[#11110F]">
                        {score}%
                      </span>
                    </div>

                    <div className="w-full bg-[#F4F1E8] h-3 border-2 border-[#11110F]">
                      <div
                        className={`${barColor} h-full border-r-2 border-[#11110F] transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#555550] font-mono font-bold pt-0.5 uppercase">
                      <span>RISK: <strong className="text-[#11110F]">{sData.risk}</strong></span>
                      <span>DEGRADATION: {sData.degradation} PTS/WK</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
