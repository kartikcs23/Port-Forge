import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

/**
 * Register — User signup page
 * Name + email + password form
 */
export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 space-y-6">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold gradient-text mb-2">
                Join PortForge
              </h2>
              <p className="text-slate-400">Create your legendary portfolio</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-sm text-red-300 px-4 py-3 rounded-lg animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-glow w-full"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-glow w-full"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-glow w-full"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Minimum 6 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient-alt w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Creating Account...' : '🚀 Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">or</span>
              </div>
            </div>

            {/* GitHub Button */}
            <button className="btn-glass w-full flex items-center justify-center gap-2 bg-slate-700/40 hover:bg-slate-700/60">
              <span>🐙</span>
              Continue with GitHub
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-slate-700/50">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
