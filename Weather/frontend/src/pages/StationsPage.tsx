import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Search, Filter, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { api } from '../services/api';
import { Station } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const StationsPage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStations().then((data) => {
      setStations(data);
      setLoading(false);
    });
  }, []);

  const filtered = stations.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return typeFilter === 'ALL' || s.station_type === typeFilter;
    const matchesSearch = 
      s.station_name.toLowerCase().includes(q) ||
      s.station_code.toLowerCase().includes(q) ||
      (s.state && s.state.toLowerCase().includes(q)) ||
      (s.country && s.country.toLowerCase().includes(q)) ||
      `${s.latitude.toFixed(2)},${s.longitude.toFixed(2)}`.includes(q);
    const matchesType = typeFilter === 'ALL' || s.station_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            Automatic Weather Station Registry
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
            Registered IMD & MoES AWS observation nodes and virtual testing rigs.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="FILTER BY STATION NAME OR CODE..."
              className="brutal-input pl-9 pr-4 py-1.5 w-64 text-xs font-bold uppercase"
            />
            <Search className="w-3.5 h-3.5 text-[#11110F] absolute left-3 top-2.5" />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="brutal-input text-xs font-bold py-1.5 px-3 cursor-pointer uppercase"
          >
            <option value="ALL">All Station Types</option>
            <option value="LIVE_LOCATION">Live AWS Locations</option>
            <option value="SIMULATED_AWS">Simulated AWS Testing Rig</option>
          </select>
        </div>
      </div>

      {/* Stations Table / Cards */}
      <div className="brutal-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1E8] border-b-2 border-[#11110F] text-[#11110F] font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-r border-[#11110F]/20">Station Code / Name</th>
                <th className="p-4 border-r border-[#11110F]/20">Coordinates / State</th>
                <th className="p-4 border-r border-[#11110F]/20">Latest Ingestion</th>
                <th className="p-4 border-r border-[#11110F]/20">Trust Score</th>
                <th className="p-4 border-r border-[#11110F]/20">Sensor Health</th>
                <th className="p-4 border-r border-[#11110F]/20">Anomaly Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#11110F]">
              {filtered.map((stn) => (
                <tr key={stn.id} className="hover:bg-[#C8FF2E]/10 transition-colors">
                  <td className="p-4 border-r border-[#11110F]/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#C8FF2E] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] text-[#11110F] flex items-center justify-center font-bold font-mono">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#11110F] block uppercase font-mono text-sm">
                          {stn.station_name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-0.5 block">
                          {stn.station_code} • {stn.station_type}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <div className="font-mono text-xs font-bold text-[#11110F]">{stn.latitude.toFixed(3)}°N, {stn.longitude.toFixed(3)}°E</div>
                    <div className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-0.5">{stn.state}, {stn.country}</div>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    {stn.latest_reading ? (
                      <div>
                        <span className="font-bold text-lg font-display text-[#11110F] block">
                          {stn.latest_reading.temperature}°C
                        </span>
                        <span className="text-[#555550] text-[10px] font-mono font-bold block uppercase mt-0.5">
                          {stn.latest_reading.pressure} hPa • {stn.latest_reading.humidity}% RH
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#555550] font-mono text-xs font-bold uppercase">AWAITING STREAM</span>
                    )}
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <span className="font-bold font-mono text-[#11110F] bg-[#C8FF2E] px-2 py-0.5 border border-[#11110F] shadow-[2px_2px_0_#11110F]">
                      {stn.latest_trust_score || 98}/100
                    </span>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <div className="flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-[#11110F]" />
                      <span className="font-bold font-mono text-[#11110F]">
                        {stn.sensor_health_summary?.TEMPERATURE || 95}%
                      </span>
                    </div>
                  </td>

                  <td className="p-4 border-r border-[#11110F]/20">
                    <StatusBadge status={stn.latest_anomaly_status || "NORMAL"} type="lifecycle" />
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      to={`/stations/${stn.id}`}
                      className="brutal-btn brutal-btn-tertiary text-[10px] py-1.5 px-3"
                    >
                      <span>TELEMETRY</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
