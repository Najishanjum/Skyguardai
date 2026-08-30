import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Activity, Sparkles, Fingerprint, 
  ArrowRight, Radio, PlayCircle,
  Thermometer, Gauge, Droplets, Clock
} from 'lucide-react';
import { api } from '../services/api';
import { LiveWeatherCardData } from '../types';
import { TrustMeter } from '../components/common/TrustMeter';

export const LandingPage: React.FC = () => {
  const [liveCards, setLiveCards] = useState<LiveWeatherCardData[]>([]);

  useEffect(() => {
    api.getLiveCards()
      .then((data) => {
        setLiveCards(data);
      })
      .catch((err) => {
        console.error("Failed to load landing live cards", err);
      });
  }, []);

  const featuredCard = liveCards[0];

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#11110F] font-sans relative overflow-hidden">
      
      {/* Decorative Geometric Elements */}
      <div className="absolute top-12 left-8 text-xl font-mono text-[#11110F]/20 select-none pointer-events-none">+ + +</div>
      <div className="absolute top-48 right-12 text-2xl font-mono text-[#11110F]/20 select-none pointer-events-none">+ + +</div>
      <div className="absolute bottom-24 left-1/4 w-16 h-16 border-2 border-[#11110F]/10 rotate-12 select-none pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b-2 border-[#11110F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold uppercase bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] mb-6">
              <Radio className="w-4 h-4 text-[#11110F] animate-pulse" />
              <span>SIH 2026 • MoES / IMD • PROBLEM SIH26073</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display uppercase tracking-tight text-[#11110F] leading-none">
              SKYGUARD <span className="bg-[#C8FF2E] px-3 border-2 border-[#11110F] shadow-[5px_5px_0_#11110F] inline-block rotate-[-1deg]">AI</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-2xl font-mono font-bold text-[#11110F] uppercase tracking-wide">
              "FROM RAW WEATHER DATA TO TRUSTED WEATHER INTELLIGENCE"
            </p>

            <p className="mt-4 text-base sm:text-lg font-sans font-medium text-[#11110F]/80 max-w-3xl mx-auto leading-relaxed">
              AI-powered real-time anomaly detection, multi-observation evidence verification, 
              consensus-based self-healing, and meteorological trust scoring for Automatic Weather Stations (AWS).
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="brutal-btn brutal-btn-primary text-sm px-6 py-3"
              >
                <span>LAUNCH DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/demo"
                className="brutal-btn brutal-btn-secondary text-sm px-6 py-3"
              >
                <PlayCircle className="w-4 h-4" />
                <span>1-CLICK SIH DEMO</span>
              </Link>

              <Link
                to="/live"
                className="brutal-btn brutal-btn-tertiary text-sm px-6 py-3"
              >
                <Activity className="w-4 h-4 text-[#11110F]" />
                <span>EXPLORE LIVE STREAM</span>
              </Link>
            </div>
          </div>

          {/* Real-time Hero Weather Card */}
          {featuredCard && (
            <div className="mt-14 max-w-4xl mx-auto bg-[#FFFFFF] border-2 border-[#11110F] p-6 shadow-[7px_7px_0_#11110F] relative">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#11110F] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 bg-[#C8FF2E] border border-[#11110F] animate-pulse" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xl tracking-wider text-[#11110F]">
                        {featuredCard.station_name}
                      </span>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#C8FF2E] text-[#11110F] border border-[#11110F] uppercase">
                        LIVE OPEN-METEO STREAM
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#555550] uppercase mt-0.5">
                      LAT: {featuredCard.latitude}°N | LON: {featuredCard.longitude}°E
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#11110F] uppercase">
                  <Clock className="w-4 h-4 text-[#11110F]" />
                  <span>DATA AGE: {featuredCard.data_age_seconds}S</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 items-center">
                <div className="p-3 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
                  <span className="font-mono text-xs font-bold text-[#555550] uppercase">// TEMPERATURE</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Thermometer className="w-6 h-6 text-[#11110F]" />
                    <span className="text-3xl font-display text-[#11110F]">
                      {featuredCard.temperature !== null ? `${featuredCard.temperature}°C` : "--"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
                  <span className="font-mono text-xs font-bold text-[#555550] uppercase">// PRESSURE</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Gauge className="w-6 h-6 text-[#11110F]" />
                    <span className="text-3xl font-display text-[#11110F]">
                      {featuredCard.pressure !== null ? `${featuredCard.pressure} hPa` : "--"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
                  <span className="font-mono text-xs font-bold text-[#555550] uppercase">// HUMIDITY</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Droplets className="w-6 h-6 text-[#11110F]" />
                    <span className="text-3xl font-display text-[#11110F]">
                      {featuredCard.humidity !== null ? `${featuredCard.humidity}%` : "--"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F]">
                  <TrustMeter score={featuredCard.trust_score} size="sm" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 1.5. Platform Video Walkthrough Showcase */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[7px_7px_0_#11110F] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-[#11110F] pb-4 gap-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#C8FF2E] text-[#11110F] border border-[#11110F]">
                // VIDEO WALKTHROUGH
              </span>
              <h2 className="text-3xl font-display uppercase tracking-tight text-[#11110F] mt-1">
                SKYGUARD AI PLATFORM DEMONSTRATION
              </h2>
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase">
              OFFICIAL WALKTHROUGH VIDEO
            </span>
          </div>

          <div className="relative bg-[#11110F] border-2 border-[#11110F] overflow-hidden shadow-[4px_4px_0_#11110F]">
            <video 
              src="/Skyguard.mp4" 
              controls 
              className="w-full h-auto max-h-[520px] mx-auto object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* 2. Four Flagship Innovations (USPs) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F]">
            PIONEERING INNOVATIONS
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display uppercase tracking-tight text-[#11110F]">
            BEYOND SIMPLE ANOMALY DETECTION
          </h2>
          <p className="mt-3 text-sm font-sans font-medium text-[#11110F]/80">
            SkyGuard AI introduces a scientifically responsible, multi-stage meteorological reliability framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* USP 1 */}
          <div className="brutal-card p-6">
            <div className="w-12 h-12 bg-[#C8FF2E] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#11110F]" />
            </div>
            <div className="font-mono text-xs font-bold text-[#11110F] uppercase">USP 1 // TRUST SCORE</div>
            <h3 className="text-2xl font-display tracking-wider mt-1 text-[#11110F]">WEATHER TRUST SCORE</h3>
            <p className="text-xs font-sans text-[#11110F]/80 mt-2 leading-relaxed font-medium">
              Composite credibility metric (0–100) factoring QC validity, temporal stability, thermodynamic coupling, and sensor degradation.
            </p>
          </div>

          {/* USP 2 */}
          <div className="brutal-card p-6">
            <div className="w-12 h-12 bg-[#FF5C5C] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-[#11110F]" />
            </div>
            <div className="font-mono text-xs font-bold text-[#11110F] uppercase">USP 2 // VERIFICATION</div>
            <h3 className="text-2xl font-display tracking-wider mt-1 text-[#11110F]">ADAPTIVE VERIFICATION</h3>
            <p className="text-xs font-sans text-[#11110F]/80 mt-2 leading-relaxed font-medium">
              Multi-cycle verification window that distinguishes genuine atmospheric squalls/fronts from isolated hardware sensor glitches.
            </p>
          </div>

          {/* USP 3 */}
          <div className="brutal-card p-6">
            <div className="w-12 h-12 bg-[#C8FF2E] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#11110F]" />
            </div>
            <div className="font-mono text-xs font-bold text-[#11110F] uppercase">USP 3 // SELF-HEALING</div>
            <h3 className="text-2xl font-display tracking-wider mt-1 text-[#11110F]">CONSENSUS SELF-HEALING</h3>
            <p className="text-xs font-sans text-[#11110F]/80 mt-2 leading-relaxed font-medium">
              Tri-model agreement (Temporal, Diurnal, Multivariate) auto-recovers faulty readings ONLY when models agree, never overwriting raw values.
            </p>
          </div>

          {/* USP 4 */}
          <div className="brutal-card p-6">
            <div className="w-12 h-12 bg-[#4057FF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center justify-center mb-4">
              <Fingerprint className="w-6 h-6 text-[#FFFFFF]" />
            </div>
            <div className="font-mono text-xs font-bold text-[#11110F] uppercase">USP 4 // MEMORY ENGINE</div>
            <h3 className="text-2xl font-display tracking-wider mt-1 text-[#11110F]">FAULT FINGERPRINTING</h3>
            <p className="text-xs font-sans text-[#11110F]/80 mt-2 leading-relaxed font-medium">
              Vectorized failure signature extraction with Cosine similarity matching against historical sensor failure profiles.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Scientific Workflow Pipeline */}
      <section className="py-16 bg-[#FFFFFF] border-y-2 border-[#11110F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F]">
              END-TO-END PIPELINE
            </span>
            <h2 className="mt-3 text-4xl font-display uppercase tracking-tight text-[#11110F]">
              THE 13-STAGE METEOROLOGICAL INTELLIGENCE CHAIN
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            {[
              "RAW INGEST", "DATA QC", "FEATURE ENG", "HYBRID ML", "FUSION",
              "VERIFICATION", "TRUST SCORE", "DIAGNOSIS", "FINGERPRINT", "HEALTH",
              "CONSENSUS HEALING", "XAI", "AUDIT LEDGER"
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-2 bg-[#F4F1E8] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-[#11110F] font-bold">
                  {idx + 1}. {step}
                </div>
                {idx < 12 && <ArrowRight className="w-4 h-4 text-[#11110F] hidden md:block" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
