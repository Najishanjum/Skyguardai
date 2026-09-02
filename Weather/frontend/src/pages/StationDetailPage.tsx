import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Radio, ArrowLeft, Thermometer, Gauge, Droplets, 
  ShieldCheck, HeartPulse, Wrench, AlertTriangle 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import { Station } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrustMeter } from '../components/common/TrustMeter';

export const StationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const stationId = parseInt(id);
      Promise.all([
        api.getStationById(stationId),
        api.getStationSeries(stationId, 30)
      ]).then(([stn, ser]) => {
        setStation(stn);
        setSeries(ser);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !station) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Back button & Station Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/stations"
            className="brutal-btn brutal-btn-tertiary px-2 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
                {station.station_name}
              </h1>
              <StatusBadge status={station.status} type="severity" />
            </div>
            <p className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-0.5 block">
              CODE: <span className="bg-[#C8FF2E] px-1 text-[#11110F] border border-[#11110F]">{station.station_code}</span> • {station.state}, {station.country} • ELEVATION: {station.elevation}m
            </p>
          </div>
        </div>

        <Link
          to={`/simulation?station_id=${station.id}`}
          className="brutal-btn brutal-btn-secondary text-[10px] px-4 py-2"
        >
          <span>SIMULATE FAULT ON THIS STATION</span>
        </Link>
      </div>

      {/* Current Observations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center gap-3">
          <div className="p-2 border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] bg-[#F4F1E8] text-[#11110F]">
            <Thermometer className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#555550] uppercase block">TEMPERATURE</span>
            <span className="block text-2xl font-display text-[#11110F] mt-1">
              {station.latest_reading?.temperature !== null ? `${station.latest_reading?.temperature}°C` : "--"}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center gap-3">
          <div className="p-2 border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] bg-[#F4F1E8] text-[#11110F]">
            <Gauge className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#555550] uppercase block">ATM. PRESSURE</span>
            <span className="block text-2xl font-display text-[#11110F] mt-1">
              {station.latest_reading?.pressure !== null ? `${station.latest_reading?.pressure} hPa` : "--"}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center gap-3">
          <div className="p-2 border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] bg-[#F4F1E8] text-[#11110F]">
            <Droplets className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#555550] uppercase block">RELATIVE HUMIDITY</span>
            <span className="block text-2xl font-display text-[#11110F] mt-1">
              {station.latest_reading?.humidity !== null ? `${station.latest_reading?.humidity}%` : "--"}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#555550] uppercase block">WEATHER TRUST</span>
            <span className="block text-2xl font-display text-[#11110F] mt-1">
              {station.latest_trust_score || 98}/100
            </span>
          </div>
          <TrustMeter score={station.latest_trust_score || 98} size="sm" />
        </div>
      </div>

      {/* Historical Telemetry Chart */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[7px_7px_0_#11110F] p-5">
        <h3 className="font-mono text-xs font-bold text-[#11110F] uppercase tracking-wider mb-4 border-b-2 border-[#11110F] pb-3">
          // TIME-SERIES OBSERVATION TELEMETRY
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#11110F" opacity={0.15} />
              <XAxis dataKey="timestamp" stroke="#11110F" fontSize={10} fontStyle="bold" />
              <YAxis stroke="#11110F" fontSize={10} fontStyle="bold" domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#11110F', 
                  borderColor: '#11110F', 
                  borderRadius: '0px',
                  color: '#C8FF2E',
                  fontSize: '12px',
                  fontFamily: 'Space Mono'
                }} 
              />
              <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#11110F" strokeWidth={2.5} fill="#C8FF2E" fillOpacity={0.7} />
              <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#FF5C5C" strokeWidth={2} fill="#FF5C5C" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
