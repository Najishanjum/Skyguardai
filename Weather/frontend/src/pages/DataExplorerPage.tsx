import React, { useState, useEffect } from 'react';
import { LineChart, Filter, Download, Calendar, ArrowDownUp } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api';

export const DataExplorerPage: React.FC = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number>(1);
  const [series, setSeries] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(30);

  useEffect(() => {
    api.getStations().then((data) => {
      setStations(data);
      if (data.length > 0) setSelectedStationId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedStationId) {
      api.getStationSeries(selectedStationId, limit).then(setSeries);
    }
  }, [selectedStationId, limit]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            MULTI-VARIABLE HISTORICAL DATA EXPLORER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-2">
            Query and analyze historical time-series correlations across temperature, pressure, relative humidity, and trust score metrics.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(parseInt(e.target.value))}
            className="brutal-input py-2 px-4 uppercase text-[10px] font-bold min-w-[160px]"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.station_name} ({s.station_code})
              </option>
            ))}
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="brutal-input py-2 px-4 uppercase text-[10px] font-bold min-w-[160px]"
          >
            <option value={15}>PAST 15 CYCLES</option>
            <option value={30}>PAST 30 CYCLES</option>
            <option value={60}>PAST 60 CYCLES</option>
          </select>
        </div>
      </div>

      {/* Explorer Chart */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-6 mt-6">
        <h3 className="text-xl font-display text-[#11110F] uppercase tracking-wider mb-4 border-b-2 border-[#11110F] pb-3">
          ATMOSPHERIC PARAMETER CORRELATIONS
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLine data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#11110F" opacity={0.1} />
              <XAxis dataKey="timestamp" stroke="#555550" fontSize={11} />
              <YAxis stroke="#555550" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#11110F',
                  border: '2px solid #11110F',
                  boxShadow: '3px 3px 0 #11110F',
                  borderRadius: '0',
                  color: '#11110F',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }} 
              />
              <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#4057FF" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="pressure" name="Pressure (hPa)" stroke="#FF5C5C" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#11110F" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="trust_score" name="Trust Score" stroke="#C8FF2E" strokeWidth={3} strokeDasharray="4 4" dot={false} />
            </RechartsLine>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
