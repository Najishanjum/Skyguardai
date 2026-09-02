import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Radio, ShieldCheck, Activity, Search } from 'lucide-react';
import { api } from '../services/api';
import { LiveWeatherCardData } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

// Custom Leaflet DivIcon factory for animated status markers
const createCustomIcon = (status: string) => {
  let color = '#10B981'; // Green
  if (status === 'CRITICAL') color = '#EF4444'; // Red
  else if (status === 'DEGRADED' || status === 'HIGH') color = '#F97316'; // Orange
  else if (status === 'WATCH' || status === 'SUSPICIOUS') color = '#F59E0B'; // Yellow

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const MapPage: React.FC = () => {
  const [stations, setStations] = useState<LiveWeatherCardData[]>([]);
  const [selectedStation, setSelectedStation] = useState<LiveWeatherCardData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    api.getLiveCards().then((data) => {
      setStations(data);
      if (data.length > 0) setSelectedStation(data[0]);
    });
  }, []);

  const filteredStations = stations.filter((s) => {
    if (filterStatus === 'ALL') return true;
    return s.anomaly_severity === filterStatus || s.anomaly_status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
            AWS GEOSPATIAL NETWORK MAP
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
            Real-time geospatial visualization of Indian and Global Automatic Weather Stations (AWS).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
          {['ALL', 'NORMAL', 'WATCH', 'HIGH', 'CRITICAL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-all ${
                filterStatus === st
                  ? 'bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[2px_2px_0_#11110F]'
                  : 'text-[#555550] hover:text-[#11110F] hover:bg-[#11110F]/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-3 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] h-[540px] z-10 relative">
          <MapContainer
            center={[22.5937, 78.9629]}
            zoom={5}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredStations.map((station) => (
              <Marker
                key={station.station_id}
                position={[station.latitude, station.longitude]}
                icon={createCustomIcon(station.anomaly_severity)}
                eventHandlers={{
                  click: () => setSelectedStation(station)
                }}
              >
                <Popup>
                  <div className="p-2 space-y-1.5 text-xs text-slate-900 font-sans min-w-[180px]">
                    <div className="font-bold text-sm text-sky-700">{station.station_name}</div>
                    <div className="text-[11px] text-slate-500">{station.state}, {station.country}</div>
                    <div className="pt-2 border-t space-y-1 font-mono">
                      <div>Temp: <strong>{station.temperature}°C</strong></div>
                      <div>Pres: <strong>{station.pressure} hPa</strong></div>
                      <div>RH: <strong>{station.humidity}%</strong></div>
                      <div>Trust: <strong>{station.trust_score}/100</strong></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Station Telemetry Card */}
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5">
            <h3 className="font-mono text-xs font-bold text-[#11110F] uppercase tracking-wider mb-3 border-b-2 border-[#11110F] pb-2">
              // STATION QUICK INSPECTOR
            </h3>

            {selectedStation ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#11110F]" />
                    <h4 className="font-bold text-lg font-display uppercase text-[#11110F]">
                      {selectedStation.station_name}
                    </h4>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-[#555550] uppercase mt-0.5 block">
                    {selectedStation.state}, {selectedStation.country}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedStation.anomaly_status} type="lifecycle" />
                  <span className="text-[10px] font-bold text-[#11110F] bg-[#C8FF2E] px-1 border border-[#11110F] font-mono shadow-[1px_1px_0_#11110F]">
                    {selectedStation.latitude.toFixed(2)}°N, {selectedStation.longitude.toFixed(2)}°E
                  </span>
                </div>

                <div className="space-y-3 py-4 border-y-2 border-[#11110F] text-[10px] font-mono font-bold uppercase">
                  <div className="flex justify-between">
                    <span className="text-[#555550]">TEMPERATURE</span>
                    <span className="text-[#11110F] text-xs">{selectedStation.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555550]">ATM. PRESSURE</span>
                    <span className="text-[#11110F] text-xs">{selectedStation.pressure} hPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555550]">REL. HUMIDITY</span>
                    <span className="text-[#11110F] text-xs">{selectedStation.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555550]">DATA FRESHNESS</span>
                    <span className="text-[#11110F] text-xs">{selectedStation.data_age_seconds}s</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block mb-2">WEATHER TRUST SCORE</span>
                  <div className="p-3 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] flex items-center justify-between">
                    <span className="text-xl font-display text-[#11110F]">
                      {selectedStation.trust_score}/100
                    </span>
                    <span className="text-[10px] font-bold font-mono border border-[#11110F] bg-[#FFFFFF] px-1 uppercase text-[#11110F]">
                      {selectedStation.trust_category}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[10px] font-mono font-bold text-[#555550] uppercase">CLICK A MARKER ON THE MAP TO INSPECT TELEMETRY.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
