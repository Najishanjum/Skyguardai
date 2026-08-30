import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('operator@imd.gov.in');
  const [password, setPassword] = useState('Operator@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await res.json();
      login(data.access_token, {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: true,
        created_at: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-[#FFFFFF] max-w-md w-full p-8 border-2 border-[#11110F] shadow-[7px_7px_0_#11110F] space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#11110F] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8 text-[#C8FF2E]" />
          </div>
          <h1 className="text-4xl font-display uppercase tracking-tight text-[#11110F]">
            SIGN IN TO SKYGUARD
          </h1>
          <p className="font-mono text-xs text-[#555550] uppercase">
            Ministry of Earth Sciences (MoES) / IMD Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FF5C5C] text-[#11110F] border-2 border-[#11110F] font-mono text-xs font-bold uppercase shadow-[3px_3px_0_#11110F]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-mono">
          <div>
            <label className="text-xs font-bold text-[#11110F] uppercase block mb-1">
              // EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FFFFFF] border-2 border-[#11110F] text-[#11110F] focus:bg-[#C8FF2E] focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#11110F] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#11110F] uppercase block mb-1">
              // PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FFFFFF] border-2 border-[#11110F] text-[#11110F] focus:bg-[#C8FF2E] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#11110F] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full brutal-btn brutal-btn-primary py-3 text-xs"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t-2 border-[#11110F] text-center font-mono text-xs text-[#555550] uppercase">
          DEMO ACCOUNT: <code className="bg-[#C8FF2E] px-1 text-[#11110F] border border-[#11110F]">operator@imd.gov.in</code>
        </div>

      </div>
    </div>
  );
};
