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
      <div className="flex h-full items-center justify-between px-4 md:px-6 max-w-7xl mx-auto gap-2">
        
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={onToggleSidebar}
            className="p-2 border-2 border-[#11110F] bg-[#FFFFFF] shadow-[3px_3px_0_#11110F] text-[#11110F] hover:bg-[#C8FF2E] transition-all lg:hidden flex-shrink-0"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo in square/rectangular black block */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 whitespace-nowrap">
            <div className="px-3 py-1.5 bg-[#11110F] text-white border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center gap-2 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <ShieldCheck className="w-5 h-5 text-[#C8FF2E]" />
              <span className="font-display text-lg tracking-wider text-white whitespace-nowrap">
                SKYGUARD
              </span>
            </div>
            <div className="hidden xl:block flex-shrink-0">
              <span className="font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] uppercase whitespace-nowrap">
                MoES / IMD
              </span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 whitespace-nowrap inline-flex items-center justify-center transition-all duration-200 ${
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
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-36 lg:w-48 xl:w-56 flex-shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH AWS..."
              className="w-full pl-8 pr-2 py-1.5 text-xs font-mono font-bold uppercase bg-[#FFFFFF] border-2 border-[#11110F] text-[#11110F] placeholder-[#555550] focus:bg-[#C8FF2E] focus:outline-none transition-colors whitespace-nowrap"
            />
            <Search className="w-3.5 h-3.5 text-[#11110F] absolute left-2.5 top-2.5" />
          </form>

          {/* SIH Demo Button */}
          <Link
            to="/demo"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-1.5 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#11110F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#11110F] transition-all whitespace-nowrap flex-shrink-0"
          >
            <PlayCircle className="w-4 h-4 text-[#11110F]" />
            <span>SIH DEMO</span>
          </Link>

          {/* WebSocket Indicator */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#11110F] font-mono text-[11px] font-bold uppercase whitespace-nowrap flex-shrink-0 ${
              isConnected ? 'bg-[#C8FF2E] text-[#11110F]' : 'bg-[#FF5C5C] text-[#11110F]'
            }`}
            title={isConnected ? "Real-time Live Stream Active" : "Connecting to Stream..."}
          >
            <span className={`w-2 h-2 border border-[#11110F] ${isConnected ? "bg-[#11110F] animate-pulse" : "bg-[#FFFFFF]"}`} />
            <span className="hidden xl:inline">{isConnected ? "LIVE" : "OFFLINE"}</span>
          </div>

          {/* Role Persona Switcher */}
          <div className="relative flex-shrink-0">
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="font-mono text-xs font-bold uppercase py-1.5 px-2 bg-[#FFFFFF] text-[#11110F] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] focus:bg-[#C8FF2E] focus:outline-none cursor-pointer whitespace-nowrap"
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
            className="p-2 bg-[#FFFFFF] border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] hover:bg-[#C8FF2E] hover:translate-y-[-1px] transition-all flex-shrink-0"
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
