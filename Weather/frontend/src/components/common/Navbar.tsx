import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Sun, Moon, Menu, PlayCircle, Palette, Check
} from 'lucide-react';
import { useTheme, AccentColor } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme, accent, setAccent, accentOptions } = useTheme();
  const { role, switchRole } = useAuth();
  const { isConnected } = useWebSocket();
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/live', label: 'LIVE STREAM' },
    { to: '/map', label: 'MAP' },
    { to: '/anomalies', label: 'ANOMALIES' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-[#F4F1E8] dark:bg-[#151821] border-b-2 border-[#11110F] dark:border-[#2D3342] transition-colors">
      <div className="flex h-full items-center justify-between px-3 md:px-6 max-w-7xl mx-auto gap-3">
        
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={onToggleSidebar}
            className="p-2 border-2 border-[#11110F] dark:border-[#2D3342] bg-[#FFFFFF] dark:bg-[#1B202B] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] text-[#11110F] dark:text-[#F3F4F6] hover:bg-[var(--color-accent)] dark:hover:text-[#11110F] transition-all lg:hidden flex-shrink-0"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo in square/rectangular block */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 whitespace-nowrap">
            <div className="px-3 py-1.5 bg-[#11110F] dark:bg-[#0B0D11] text-white border-2 border-[#11110F] dark:border-[#2D3342] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] flex items-center gap-2 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <ShieldCheck className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="font-display text-lg tracking-wider text-white whitespace-nowrap">
                SKYGUARD
              </span>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <span className="font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#FF5C5C] text-[#FFFFFF] border-2 border-[#11110F] dark:border-[#2D3342] shadow-[2px_2px_0_#11110F] dark:shadow-[2px_2px_0_#000000] uppercase whitespace-nowrap">
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
                style={isActive ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 whitespace-nowrap inline-flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'border-[#11110F] dark:border-[#2D3342] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] translate-y-[-1px]'
                    : 'bg-transparent text-[#11110F] dark:text-[#F3F4F6] border-transparent hover:border-[#11110F] dark:hover:border-[#2D3342] hover:bg-[var(--color-accent)] hover:text-[#11110F] hover:translate-y-[-2px]'
                }`}
              >
                [ {link.label} ]
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: SIH Demo, Stream Indicator, Persona Switcher, Theme Colors & Mode */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* SIH Demo Button */}
          <Link
            to="/demo"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-1.5 bg-[#FF5C5C] text-white border-2 border-[#11110F] dark:border-[#2D3342] shadow-[3px_3px_0_#11110F] dark:shadow-[3px_3px_0_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all whitespace-nowrap flex-shrink-0"
          >
            <PlayCircle className="w-4 h-4" />
            <span>SIH DEMO</span>
          </Link>

          {/* WebSocket Live Indicator */}
          <div 
            style={isConnected ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast)' } : {}}
            className={`flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#11110F] dark:border-[#2D3342] font-mono text-[11px] font-bold uppercase whitespace-nowrap flex-shrink-0 ${
              isConnected ? '' : 'bg-[#FF5C5C] text-white'
            }`}
            title={isConnected ? "Real-time Live Stream Active" : "Connecting to Stream..."}
          >
            <span className={`w-2 h-2 border border-[#11110F] ${isConnected ? "bg-current animate-pulse" : "bg-[#FFFFFF]"}`} />
            <span className="hidden md:inline">{isConnected ? "LIVE" : "OFFLINE"}</span>
          </div>

          {/* Role Persona Switcher */}
          <div className="relative flex-shrink-0">
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="font-mono text-xs font-bold uppercase py-1.5 px-2 bg-[#FFFFFF] dark:bg-[#1B202B] text-[#11110F] dark:text-[#F3F4F6] border-2 border-[#11110F] dark:border-[#2D3342] shadow-[2px_2px_0_#11110F] dark:shadow-[2px_2px_0_#000000] focus:outline-none cursor-pointer whitespace-nowrap"
              title="Switch user perspective"
            >
              <option value="VIEWER">CITIZEN</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="RESEARCHER">METEOROLOGIST</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Theme Accent Color Picker Dropdown */}
          <div className="relative flex-shrink-0" ref={paletteRef}>
            <button
              onClick={() => setPaletteOpen(!paletteOpen)}
              className="p-2 bg-[#FFFFFF] dark:bg-[#1B202B] border-2 border-[#11110F] dark:border-[#2D3342] shadow-[2px_2px_0_#11110F] dark:shadow-[2px_2px_0_#000000] hover:bg-[var(--color-accent)] dark:hover:text-[#11110F] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1"
              title="Theme Accent Color"
              aria-label="Theme Accent Color"
            >
              <Palette className="w-4 h-4 text-[#11110F] dark:text-[#F3F4F6]" />
              <span className="w-2.5 h-2.5 rounded-full border border-[#11110F] dark:border-white inline-block" style={{ backgroundColor: 'var(--color-accent)' }} />
            </button>

            {paletteOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] dark:bg-[#1B202B] border-2 border-[#11110F] dark:border-[#2D3342] shadow-[5px_5px_0_#11110F] dark:shadow-[5px_5px_0_#000000] p-2 z-50 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#555550] dark:text-[#9CA3AF] px-2 py-1 border-b border-[#11110F]/10 dark:border-white/10">
                  // THEME ACCENT COLOR
                </div>
                {accentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAccent(opt.id);
                      setPaletteOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs font-mono font-bold uppercase rounded-none transition-colors ${
                      accent === opt.id ? 'bg-[#F4F1E8] dark:bg-[#2D3342]' : 'hover:bg-[#F4F1E8] dark:hover:bg-[#2D3342]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border border-[#11110F] dark:border-white inline-block" style={{ backgroundColor: opt.hex }} />
                      <span className="text-[#11110F] dark:text-[#F3F4F6] text-[11px]">{opt.name}</span>
                    </div>
                    {accent === opt.id && <Check className="w-3.5 h-3.5 text-[#11110F] dark:text-[#F3F4F6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-[#FFFFFF] dark:bg-[#1B202B] border-2 border-[#11110F] dark:border-[#2D3342] shadow-[2px_2px_0_#11110F] dark:shadow-[2px_2px_0_#000000] hover:bg-[var(--color-accent)] hover:translate-y-[-1px] transition-all flex-shrink-0 flex items-center justify-center text-[#11110F] dark:text-[#F3F4F6]"
            title={`Switch to ${theme === 'dark' ? 'Light Clear Sky' : 'Dark Command'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--color-accent)]" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </header>
  );
};
