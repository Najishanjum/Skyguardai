import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, ShieldCheck, HeartPulse, 
  Wrench, Radio, RefreshCw, ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { api } from '../services/api';
import { DashboardSummaryData, LiveWeatherCardData } from '../types';
import { KPICard } from '../components/common/KPICard';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrustMeter } from '../components/common/TrustMeter';
import { useWebSocket } from '../context/WebSocketContext';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [liveCards, setLiveCards] = useState<LiveWeatherCardData[]>([]);
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { lastMessage } = useWebSocket();

  const loadData = async () => {
    try {
      const [sum, cards] = await Promise.all([
        api.getDashboardSummary(),
        api.getLiveCards()
      ]);
      setSummary(sum);
      setLiveCards(cards);

      if (cards.length > 0) {
        const series = await api.getStationSeries(cards[0].station_id, 24);
        setSeriesData(series);
      }
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Error loading dashboard data", err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update real-time on WebSocket event
  useEffect(() => {
    if (lastMessage && (lastMessage.type === "LIVE_OBSERVATION" || lastMessage.type === "SIMULATION_INJECTED")) {
      loadData();
    }
  }, [lastMessage]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 bg-[#FFFFFF] p-8 border-2 border-[#11110F] shadow-[5px_5px_0_#11110F]">
          <div className="w-10 h-10 border-4 border-[#11110F] border-t-[#C8FF2E] animate-spin" />
          <p className="font-mono text-xs font-bold uppercase text-[#11110F]">CONNECTING TO INTELLIGENCE HUB...</p>
        </div>
      </div>
    );
  }

  const pieColors = ['#C8FF2E', '#FFFFFF', '#FF5C5C'];
  const pieData = Object.entries(summary.trust_category_distribution).map(([name, value]) => ({
    name, value
  }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-tight text-[#11110F]">
            EXECUTIVE DASHBOARD
          </h1>
          <p className="font-mono text-xs text-[#555550] uppercase mt-1">
            Real-time AWS telemetry, AI anomaly detection & trust analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="brutal-btn brutal-btn-tertiary text-xs px-3.5 py-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#11110F]" : ""}`} />
            <span>{refreshing ? "SYNCING..." : "SYNC FEEDS"}</span>
          </button>

          <Link
            to="/simulation"
            className="brutal-btn brutal-btn-secondary text-xs px-3.5 py-2"
          >
            <span>INJECT TEST SCENARIO</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Monitored Stations"
          value={summary.total_stations}
          subtitle={`${summary.live_locations_count} Live • ${summary.simulated_stations_count} Sim Rig`}
          icon={Radio}
          colorScheme="sky"
        />

        <KPICard
          title="Active Anomalies"
          value={summary.active_anomalies_count}
          subtitle="Under active verification"
          icon={AlertTriangle}
          colorScheme={summary.active_anomalies_count > 0 ? "rose" : "emerald"}
          trend={{
            value: summary.active_anomalies_count > 0 ? "Needs Review" : "Nominal",
            isPositive: summary.active_anomalies_count === 0
          }}
        />

        <KPICard
          title="Avg Weather Trust"
          value={`${summary.avg_trust_score}%`}
          subtitle="Multi-factor reliability index"
          icon={ShieldCheck}
          colorScheme="cyan"
          trend={{
            value: summary.avg_trust_score >= 80 ? "High Credibility" : "Degraded",
            isPositive: summary.avg_trust_score >= 80
          }}
        />

        <KPICard
          title="Sensor Health"
          value={`${summary.healthy_sensors_percentage}%`}
          subtitle="Transducer physical health"
          icon={HeartPulse}
          colorScheme="emerald"
        />

        <KPICard
          title="Maintenance Risks"
          value={summary.maintenance_risks_count}
          subtitle="Predictive service alerts"
          icon={Wrench}
          colorScheme={summary.maintenance_risks_count > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Multi-Parameter Timeline Chart */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b-2 border-[#11110F] pb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-[#11110F] uppercase tracking-wider">
                // TELEMETRY TRENDS (24-HOUR)
              </h3>
              <p className="font-mono text-xs text-[#555550] uppercase mt-0.5">
                Temperature (°C), Atmospheric Pressure (hPa) & Relative Humidity (%)
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] font-bold uppercase">
              {liveCards[0]?.station_name || "Safdarjung AWS"}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Trust Distribution & Quick Diagnostics */}
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-sm font-bold text-[#11110F] uppercase tracking-wider mb-1">
              // TRUST SCORE DISTRIBUTION
            </h3>
            <p className="font-mono text-xs text-[#555550] uppercase mb-4">
              Regional credibility classification breakdown
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#11110F"
                    strokeWidth={2}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mt-2 text-xs font-mono font-bold">
              <div className="p-2 bg-[#C8FF2E] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
                <span className="block font-display text-lg text-[#11110F]">
                  {summary.trust_category_distribution.TRUSTED || 0}
                </span>
                <span className="text-[10px] text-[#11110F] uppercase">TRUSTED</span>
              </div>
              <div className="p-2 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
                <span className="block font-display text-lg text-[#11110F]">
                  {summary.trust_category_distribution.UNCERTAIN || 0}
                </span>
                <span className="text-[10px] text-[#11110F] uppercase">UNCERTAIN</span>
              </div>
              <div className="p-2 bg-[#FF5C5C] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
                <span className="block font-display text-lg text-[#11110F]">
                  {summary.trust_category_distribution.LOW_TRUST || 0}
                </span>
                <span className="text-[10px] text-[#11110F] uppercase">LOW TRUST</span>
              </div>
            </div>
          </div>

          <Link
            to="/audit"
            className="mt-4 brutal-btn brutal-btn-tertiary text-xs py-2 text-center w-full"
          >
            <span>VIEW AUDIT LEDGER</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Live AWS Stations Telemetry Grid */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#11110F]">
            // ACTIVE STATIONS TELEMETRY (LIVE POLLING)
          </h2>
          <Link to="/stations" className="font-mono text-xs font-bold text-[#11110F] underline hover:bg-[#C8FF2E] px-2 py-0.5">
            VIEW ALL STATIONS →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveCards.slice(0, 4).map((card) => (
            <div key={card.station_id} className="brutal-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#11110F] truncate uppercase">
                    {card.station_name}
                  </span>
                  <StatusBadge status={card.anomaly_status} type="lifecycle" />
                </div>
                <p className="font-mono text-[11px] text-[#555550] uppercase mt-0.5">{card.state || card.country}</p>

                <div className="grid grid-cols-3 gap-2 my-3 py-2 border-y-2 border-[#11110F] text-center font-mono">
                  <div>
                    <span className="text-[10px] text-[#555550] block font-bold">TEMP</span>
                    <span className="font-bold text-xs text-[#11110F]">
                      {card.temperature !== null ? `${card.temperature}°C` : "--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555550] block font-bold">PRES</span>
                    <span className="font-bold text-xs text-[#11110F]">
                      {card.pressure !== null ? `${card.pressure}` : "--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555550] block font-bold">RH</span>
                    <span className="font-bold text-xs text-[#11110F]">
                      {card.humidity !== null ? `${card.humidity}%` : "--"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono">
                <span className="text-[11px] font-bold text-[#11110F] uppercase">
                  TRUST: <strong className="bg-[#C8FF2E] px-1 border border-[#11110F]">{card.trust_score}/100</strong>
                </span>
                <Link
                  to={`/stations/${card.station_id}`}
                  className="text-[11px] font-bold text-[#11110F] uppercase underline hover:bg-[#C8FF2E] px-1"
                >
                  INSPECT →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
