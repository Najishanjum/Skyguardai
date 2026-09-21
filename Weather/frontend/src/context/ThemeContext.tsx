import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'lime' | 'cyan' | 'emerald' | 'blue' | 'coral' | 'amber' | 'purple';

export interface AccentOption {
  id: AccentColor;
  name: string;
  hex: string;
  contrast: string;
  hover: string;
  rgb: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: 'lime', name: 'Neo Lime (Signature)', hex: '#C8FF2E', contrast: '#11110F', hover: '#b0f01a', rgb: '200, 255, 46' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#00F0FF', contrast: '#11110F', hover: '#00d5e3', rgb: '0, 240, 255' },
  { id: 'emerald', name: 'Matrix Emerald', hex: '#00FF66', contrast: '#11110F', hover: '#00e059', rgb: '0, 255, 102' },
  { id: 'blue', name: 'Electric Blue', hex: '#4057FF', contrast: '#FFFFFF', hover: '#2c43ff', rgb: '64, 87, 255' },
  { id: 'coral', name: 'Sunset Coral', hex: '#FF5C5C', contrast: '#FFFFFF', hover: '#ff3d3d', rgb: '255, 92, 92' },
  { id: 'amber', name: 'Solar Amber', hex: '#FFB800', contrast: '#11110F', hover: '#e6a600', rgb: '255, 184, 0' },
  { id: 'purple', name: 'Ultraviolet', hex: '#A855F7', contrast: '#FFFFFF', hover: '#9333ea', rgb: '168, 85, 247' },
];

interface ThemeContextType {
  theme: ThemeMode;
  accent: AccentColor;
  currentAccent: AccentOption;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  accentOptions: AccentOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('skyguard_theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('skyguard_accent') as AccentColor;
    if (ACCENT_OPTIONS.some(a => a.id === saved)) return saved;
    return 'lime';
  });

  const currentAccent = ACCENT_OPTIONS.find(a => a.id === accent) || ACCENT_OPTIONS[0];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
    localStorage.setItem('skyguard_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    root.style.setProperty('--color-accent', currentAccent.hex);
    root.style.setProperty('--color-accent-contrast', currentAccent.contrast);
    root.style.setProperty('--color-accent-hover', currentAccent.hover);
    root.style.setProperty('--color-accent-rgb', currentAccent.rgb);
    root.style.setProperty('--primary-accent', currentAccent.hex);
    localStorage.setItem('skyguard_accent', accent);
  }, [accent, currentAccent]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      accent,
      currentAccent,
      toggleTheme,
      setTheme,
      setAccent,
      accentOptions: ACCENT_OPTIONS,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
