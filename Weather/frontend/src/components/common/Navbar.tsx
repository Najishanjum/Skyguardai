import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Sun, Moon, Search, Menu, PlayCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { role, switchRole } = useAuth();
  const { isConnected } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/live?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/live', label: 'LIVE STREAM' },
    { to: '/map', label: 'MAP' },
    { to: '/anomalies', label: 'ANOMALIES' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-[#F4F1E8] border-b-2 border-[#11110F]">
      <div className="flex h-full items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 border-2 border-[#11110F] bg-[#FFFFFF] shadow-[3px_3px_0_#11110F] text-[#11110F] hover:bg-[#C8FF2E] transition-all lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo in square/rectangular black block */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="px-3 py-2 bg-[#11110F] text-white border-2 border-[#11110F] shadow-[4px_4px_0_#11110F] flex items-center gap-2 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#C8FF2E]" />
              <span className="font-display text-xl tracking-wider text-white">
                SKYGUARD
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase">
                  MoES / IMD
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-2 border-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C8FF2E] text-[#11110F] border-[#11110F] shadow-[3px_3px_0_#11110F] translate-y-[-1px]'
                    : 'bg-[#F4F1E8] text-[#11110F] border-transparent hover:border-[#11110F] hover:bg-[#C8FF2E] hover:translate-y-[-2px]'
                }`}
              >
                [ {link.label} ]
              </Link>
            );
          })}
        </nav>

        {/* Middle/Right: Search Bar & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH AWS / CITY..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono font-bold uppercase bg-[#FFFFFF] border-2 border-[#11110F] text-[#11110F] placeholder-[#555550] focus:bg-[#C8FF2E] focus:outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#11110F] absolute left-2.5 top-2.5" />
          </form>

          {/* SIH Demo Button */}
          <Link
            to="/demo"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-1.5 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#11110F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#11110F] transition-all"
          >
            <PlayCircle className="w-4 h-4 text-[#11110F]" />
            <span>SIH DEMO</span>
          </Link>

          {/* WebSocket Indicator */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#11110F] font-mono text-[11px] font-bold uppercase ${
              isConnected ? 'bg-[#C8FF2E] text-[#11110F]' : 'bg-[#FF5C5C] text-[#11110F]'
            }`}
            title={isConnected ? "Real-time Live Stream Active" : "Connecting to Stream..."}
          >
            <span className={`w-2 h-2 border border-[#11110F] ${isConnected ? "bg-[#11110F] animate-pulse" : "bg-[#FFFFFF]"}`} />
            <span className="hidden xl:inline">{isConnected ? "LIVE" : "OFFLINE"}</span>
          </div>

          {/* Role Persona Switcher */}
          <div className="relative">
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="font-mono text-xs font-bold uppercase py-1.5 px-2 bg-[#FFFFFF] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] focus:bg-[#C8FF2E] focus:outline-none cursor-pointer"
              title="Switch user perspective"
            >
              <option value="VIEWER">CITIZEN</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="RESEARCHER">METEOROLOGIST</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] hover:bg-[#C8FF2E] hover:translate-y-[-1px] transition-all"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#11110F]" /> : <Moon className="w-4 h-4 text-[#11110F]" />}
          </button>

        </div>
      </div>
    </header>
  );
};
