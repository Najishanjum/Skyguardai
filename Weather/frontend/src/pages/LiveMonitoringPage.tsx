import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Radio, Activity, Clock, ShieldCheck, 
  MapPin, RefreshCw, AlertTriangle, Thermometer, Gauge, Droplets, ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { LiveWeatherCardData, LocationSearchResult } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrustMeter } from '../components/common/TrustMeter';
import { useWebSocket } from '../context/WebSocketContext';

export const LiveMonitoringPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cards, setCards] = useState<LiveWeatherCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeSearchedLocation, setActiveSearchedLocation] = useState<any | null>(null);
  const { lastMessage } = useWebSocket();

  const loadLiveCards = async () => {
    try {
      const data = await api.getLiveCards();
      setCards(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load live cards', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveCards();
    if (searchParams.get('search')) {
      handleSearch(searchParams.get('search')!);
    }
  }, []);

  // Update live on WebSocket message
  useEffect(() => {
    if (lastMessage && (lastMessage.type === 'LIVE_OBSERVATION' || lastMessage.type === 'SIMULATION_INJECTED')) {
      loadLiveCards();
    }
  }, [lastMessage]);

  // Debounced real-time search for fast and responsive location querying
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(trimmed);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const results = await api.searchLocations(query);
      setSearchResults(results);
      setSearching(false);
    } catch (err) {
      console.error('Search failed', err);
      setSearching(false);
    }
  };

  const handleSelectLocation = async (loc: LocationSearchResult) => {
    setLoading(true);
    setSearchResults([]);
    try {
      const weatherData = await api.getWeatherByCoordinates(loc.latitude, loc.longitude, `${loc.name}, ${loc.country || ''}`);
      setActiveSearchedLocation(weatherData);
      loadLiveCards();
    } catch (err) {
      console.error('Failed to fetch coordinate weather', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
              LIVE METEOROLOGICAL STREAM
            </h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-bold bg-[#C8FF2E] text-[#11110F] border border-[#11110F] shadow-[2px_2px_0_#11110F]">
              <span className="w-2 h-2 bg-[#FF5C5C] animate-ping border border-[#11110F]" />
              LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
            Official Open-Meteo & Automatic Weather Stations real-time sensor observations and trust classification.
          </p>
        </div>

        <button
          onClick={loadLiveCards}
          className="brutal-btn brutal-btn-tertiary px-3 py-2 text-[10px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH ALL</span>
        </button>
      </div>

      {/* Global Location Search Bar */}
      <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-4 relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH ANY LOCATION (E.G., PUNE, LONDON, 28.58, 77.20)..."
              className="brutal-input pl-9 pr-4 py-3 w-full font-bold uppercase text-xs"
            />
            <Search className="w-4 h-4 text-[#11110F] absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="brutal-btn brutal-btn-primary px-6 py-3 text-[10px]"
          >
            {searching ? 'SEARCHING...' : 'FIND WEATHER'}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-30 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 space-y-1 max-h-60 overflow-y-auto">
            {searchResults.map((res, i) => (
              <button
                key={i}
                onClick={() => handleSelectLocation(res)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {res.name}
                  </span>
                  <span className="text-slate-500">
                    {res.admin1 ? `${res.admin1}, ` : ''}{res.country}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {res.latitude.toFixed(2)}°N, {res.longitude.toFixed(2)}°E
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Searched Location Inspection Highlight */}
      {activeSearchedLocation && (
        <div className="bg-[#C8FF2E] border-2 border-[#11110F] shadow-[7px_7px_0_#11110F] p-6 mt-6">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-[#11110F]/10 pb-4 mb-4 gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#11110F] animate-bounce" />
              <h2 className="text-xl font-display uppercase tracking-wider text-[#11110F]">
                LIVE QUERY RESULT: {activeSearchedLocation.station_name}
              </h2>
            </div>
            <span className="text-[10px] px-2.5 py-1 bg-[#FF5C5C] text-[#FFFFFF] border border-[#11110F] shadow-[2px_2px_0_#11110F] font-mono font-bold uppercase">
              INGESTED TO PIPELINE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">TEMPERATURE</span>
              <span className="block text-2xl font-display text-[#11110F] mt-2">
                {activeSearchedLocation.temperature}°C
              </span>
            </div>
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">ATM. PRESSURE</span>
              <span className="block text-2xl font-display text-[#11110F] mt-2">
                {activeSearchedLocation.pressure} hPa
              </span>
            </div>
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
              <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">RELATIVE HUMIDITY</span>
              <span className="block text-2xl font-display text-[#11110F] mt-2">
                {activeSearchedLocation.humidity}%
              </span>
            </div>
            <div className="flex items-center justify-center bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-4">
              <TrustMeter score={activeSearchedLocation.trust_score} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cards.map((card) => (
          <div key={card.station_id} className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5 flex flex-col justify-between space-y-5">
            
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#11110F] pb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#11110F]" />
                  <h3 className="text-lg font-display uppercase truncate text-[#11110F]">
                    {card.station_name}
                  </h3>
                </div>
                <StatusBadge status={card.anomaly_status} type="lifecycle" />
              </div>
              
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#555550] uppercase mt-2">
                <span>{card.state ? `${card.state}, ` : ''}{card.country}</span>
                <span className="text-[#11110F] bg-[#C8FF2E] px-1 border border-[#11110F]">{card.latitude.toFixed(2)}°N, {card.longitude.toFixed(2)}°E</span>
              </div>
            </div>

            {/* Weather Parameters */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">TEMP</span>
                <span className="text-lg font-display text-[#11110F] mt-1 block">
                  {card.temperature !== null ? `${card.temperature}°C` : "--"}
                </span>
              </div>

              <div className="p-2 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">PRESSURE</span>
                <span className="text-lg font-display text-[#11110F] mt-1 block">
                  {card.pressure !== null ? `${card.pressure}` : "--"}
                </span>
              </div>

              <div className="p-2 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
                <span className="text-[10px] font-mono font-bold text-[#555550] uppercase block">HUMIDITY</span>
                <span className="text-lg font-display text-[#11110F] mt-1 block">
                  {card.humidity !== null ? `${card.humidity}%` : "--"}
                </span>
              </div>
            </div>

            {/* Trust Meter and Provenance */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-[#11110F]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#11110F]" />
                <div className="text-xs">
                  <span className="font-mono font-bold text-[#11110F] uppercase">
                    TRUST: {card.trust_score}/100
                  </span>
                  <span className="block text-[10px] text-[#555550] uppercase font-bold">
                    {card.trust_category}
                  </span>
                </div>
              </div>

              <div className="text-right text-[10px] text-[#555550] font-mono font-bold uppercase">
                <div className="flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-[#11110F]" />
                  <span>AGE: {card.data_age_seconds}S</span>
                </div>
                <span className="text-[#555550]">SOURCE: {card.provider}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
