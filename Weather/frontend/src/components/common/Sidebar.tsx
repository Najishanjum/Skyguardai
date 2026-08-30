import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Map, Radio, AlertTriangle,
  HeartPulse, Wrench, Sparkles, BrainCircuit, LineChart,
  FlaskConical, PlayCircle, Bell, FileText, Settings,
  ShieldAlert, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const navigationSections = [
    {
      title: "REAL-TIME INTELLIGENCE",
      items: [
        { to: "/dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
        { to: "/live", label: "Live Weather & Stream", icon: Activity },
        { to: "/map", label: "AWS Geospatial Map", icon: Map },
        { to: "/stations", label: "Station Registry", icon: Radio },
      ]
    },
    {
      title: "AI DETECTION & VERIFICATION",
      items: [
        { to: "/anomalies", label: "Anomaly Center", icon: AlertTriangle },
        { to: "/explain", label: "Explainable AI (XAI)", icon: BrainCircuit },
        { to: "/self-healing", label: "Consensus Self-Healing", icon: Sparkles, badge: "USP" },
        { to: "/explorer", label: "Multi-Variable Explorer", icon: LineChart },
      ]
    },
    {
      title: "SENSOR HEALTH & RELIABILITY",
      items: [
        { to: "/health", label: "Sensor Health Matrix", icon: HeartPulse },
        { to: "/maintenance", label: "Predictive Maintenance", icon: Wrench },
        { to: "/alerts", label: "Alerts Management", icon: Bell },
      ]
    },
    {
      title: "INNOVATION & GOVERNANCE",
      items: [
        { to: "/demo", label: "Guided SIH Demo", icon: PlayCircle, badge: "1-Click" },
        { to: "/simulation", label: "AI Simulation Lab", icon: FlaskConical },
        { to: "/audit", label: "Observation Ledger", icon: ShieldCheck, badge: "Raw Data" },
        { to: "/reports", label: "Reports & Export", icon: FileText },
        { to: "/settings", label: "System Settings", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#11110F]/60 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-20 left-0 z-40 h-[calc(100vh-5rem)] w-64 flex-shrink-0 flex flex-col justify-between border-r-2 border-[#11110F] bg-[#F4F1E8] overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="py-5 px-3 space-y-6">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-[#11110F]/70 border-b border-[#11110F]/20 pb-1">
                // {section.title}
              </h3>
              <div className="space-y-1 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase transition-all ${
                          isActive
                            ? 'bg-[#C8FF2E] text-[#11110F] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] translate-y-[-1px]'
                            : 'text-[#11110F] border-2 border-transparent hover:border-[#11110F] hover:bg-[#FFFFFF] hover:translate-y-[-1px]'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#11110F]" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#FF5C5C] text-[#11110F] border border-[#11110F] shadow-[1px_1px_0_#11110F] uppercase">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Organization Badge */}
        <div className="p-3 m-3 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#11110F] uppercase">
            <ShieldAlert className="w-4 h-4 text-[#FF5C5C]" />
            <span>SIH 2026 #SIH26073</span>
          </div>
          <p className="text-[10px] font-mono text-[#555550] mt-0.5 uppercase">
            Ministry of Earth Sciences
          </p>
        </div>
      </aside>
    </>
  );
};
