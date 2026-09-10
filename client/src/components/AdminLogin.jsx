import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Shield, Lock, Mail, Eye, EyeOff, AlertTriangle, CheckCircle2, 
  XCircle, KeyRound, Sparkles, ArrowLeft, Send, Check, ShieldCheck, 
  ShieldAlert, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';

// Password Policy Criteria Definition
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    validate: (pwd) => pwd.length >= 8
  },
  {
    id: 'uppercase',
    label: 'At least one UPPERCASE letter (A-Z)',
    validate: (pwd) => /[A-Z]/.test(pwd)
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    validate: (pwd) => /[a-z]/.test(pwd)
  },
  {
    id: 'number',
    label: 'At least one numeric digit (0-9)',
    validate: (pwd) => /[0-9]/.test(pwd)
  },
  {
    id: 'special',
    label: 'At least one special symbol (@, #, $, !, %, *, ?, &, _)',
    validate: (pwd) => /[@#$!%*?&_~^`+\-=\[\]{}()<>,./:;"'\\]/.test(pwd)
  }
];

export const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  // Modes: 'login' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Reset Flow Fields
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null); // 401 | 403 | 400 | null
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devTokenHelper, setDevTokenHelper] = useState(null);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Real-time criteria validation for login password
  const loginCriteria = useMemo(() => {
    return PASSWORD_RULES.map(rule => ({
      ...rule,
      met: rule.validate(password)
    }));
  }, [password]);

  const isLoginPasswordValid = useMemo(() => {
    return loginCriteria.every(item => item.met);
  }, [loginCriteria]);

  // Real-time criteria validation for reset password
  const resetCriteria = useMemo(() => {
    return PASSWORD_RULES.map(rule => ({
      ...rule,
      met: rule.validate(newPassword)
    }));
  }, [newPassword]);

  const isResetPasswordValid = useMemo(() => {
    return resetCriteria.every(item => item.met);
  }, [resetCriteria]);

  // Password strength calculation (0 to 100%)
  const calculateStrength = (criteria) => {
    const metCount = criteria.filter(c => c.met).length;
    return (metCount / criteria.length) * 100;
  };

  const loginStrength = calculateStrength(loginCriteria);
  const resetStrength = calculateStrength(resetCriteria);

  // Reset errors when switching modes or typing
  const clearAlerts = () => {
    setErrorStatus(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 1. Submit Admin Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!isLoginPasswordValid) {
      setErrorStatus(400);
      setErrorMessage('Password does not fulfill the required security criteria.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/admin-login', {
        email: email.trim(),
        password
      });

      if (response.data.success) {
        setSuccessMessage('Admin authentication successful! Access granted.');
        // Store JWT token and user info
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (onLoginSuccess) {
          onLoginSuccess(response.data.user, response.data.token);
        } else {
          // Auto reload or navigate after brief delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      }
    } catch (err) {
      const status = err.response ? err.response.status : 500;
      const msg = err.response?.data?.message || 'Authentication failed. Please check connection.';
      setErrorStatus(status);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Forgot Password Request
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!email.trim()) {
      setErrorStatus(400);
      setErrorMessage('Please enter your admin registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', {
        email: email.trim()
      });

      setSuccessMessage(res.data.message || 'If an account exists, a password reset token has been dispatched.');
      
      if (res.data.devResetToken) {
        setDevTokenHelper(res.data.devResetToken);
        setResetToken(res.data.devResetToken);
      }
    } catch (err) {
      setErrorStatus(err.response?.status || 500);
      setErrorMessage(err.response?.data?.message || 'Failed to dispatch reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!resetToken.trim()) {
      setErrorStatus(400);
      setErrorMessage('Please enter your reset token.');
      return;
    }

    if (!isResetPasswordValid) {
      setErrorStatus(400);
      setErrorMessage('New password does not fulfill the strict security criteria.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorStatus(400);
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', {
        token: resetToken.trim(),
        password: newPassword
      });

      setSuccessMessage(res.data.message || 'Password successfully updated! You may now sign in.');
      setPassword('');
      setTimeout(() => {
        setMode('login');
        clearAlerts();
        setSuccessMessage('Password reset successfully! Please log in with your new password.');
      }, 1500);
    } catch (err) {
      setErrorStatus(err.response?.status || 400);
      setErrorMessage(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // Development helper: Seed initial accounts
  const handleSeedDemoUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/seed-users');
      setSuccessMessage('Demo users initialized in MongoDB! You can now use the Quick Fill buttons below.');
    } catch (err) {
      setErrorMessage('Failed to seed demo users: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const quickFill = (type) => {
    clearAlerts();
    if (type === 'admin') {
      setEmail('admin@auramarket.com');
      setPassword('Admin@12345_Secure');
    } else if (type === 'non-admin') {
      setEmail('user@auramarket.com');
      setPassword('User@12345_Secure');
    } else if (type === 'wrong-pwd') {
      setEmail('admin@auramarket.com');
      setPassword('Wrong@12345_Pass');
    } else if (type === 'weak-pwd') {
      setEmail('admin@auramarket.com');
      setPassword('weak');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-1 sm:p-2">
      <div className="relative bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">Admin Clearance</h2>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full">
                  Restricted
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">AuraMarket Security Operations Gateway</p>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition"
            >
              Close
            </button>
          )}
        </div>

        {/* Dynamic Alert Banners */}
        <div className="my-5 space-y-2.5">
          {/* 401 Unauthorized / Invalid Credentials Alert */}
          {errorStatus === 401 && (
            <div className="animate-fade-in p-4 bg-rose-950/50 border border-rose-600/60 rounded-2xl flex items-start gap-3 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
              <div className="p-1 bg-rose-600/30 rounded-lg text-rose-400 shrink-0 mt-0.5">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider">Authentication Rejected (401)</h4>
                <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed font-medium">
                  {errorMessage || 'Invalid credentials or unauthorized access'}
                </p>
                <p className="text-[11px] text-rose-400/80 mt-1">
                  Access denied to prevent unauthorized identifier enumeration.
                </p>
              </div>
            </div>
          )}

          {/* 403 Forbidden / Non-Admin Privileges Alert */}
          {errorStatus === 403 && (
            <div className="animate-fade-in p-4 bg-amber-950/50 border border-amber-500/60 rounded-2xl flex items-start gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <div className="p-1 bg-amber-500/30 rounded-lg text-amber-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Access Denied (403 Forbidden)</h4>
                <p className="text-xs text-amber-300 mt-0.5 leading-relaxed font-semibold">
                  {errorMessage || 'Access Denied: Admin privileges required'}
                </p>
                <p className="text-[11px] text-amber-400/80 mt-1">
                  Your identity was verified, but this account lacks elevated administrative clearance (`isAdmin: true`).
                </p>
              </div>
            </div>
          )}

          {/* 400 Bad Request / Validation Alert */}
          {errorStatus === 400 && (
            <div className="animate-fade-in p-4 bg-red-950/40 border border-red-500/50 rounded-2xl flex items-start gap-3">
              <div className="p-1 bg-red-500/20 rounded-lg text-red-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-200 uppercase tracking-wider">Security Validation Error</h4>
                <p className="text-xs text-red-300 mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="animate-fade-in p-4 bg-emerald-950/50 border border-emerald-500/50 rounded-2xl flex items-start gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="p-1 bg-emerald-500/30 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Success</h4>
                <p className="text-xs text-emerald-300 mt-0.5 font-medium leading-relaxed">
                  {successMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* VIEW 1: ADMIN LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearAlerts();
                  }}
                  placeholder="admin@auramarket.com"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Admin Passkey
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    clearAlerts();
                  }}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearAlerts();
                  }}
                  placeholder="Enter high-entropy password"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REAL-TIME PASSWORD POLICY CHECKLIST */}
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Strict Password Policy Criteria</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isLoginPasswordValid 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {loginCriteria.filter(c => c.met).length} / {loginCriteria.length} Met
                </span>
              </div>

              {/* Strength Meter Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    loginStrength === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                    loginStrength >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                    'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${loginStrength}%` }}
                />
              </div>

              {/* Criteria Checklist Items */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {loginCriteria.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-2.5 text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                      item.met 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                        : 'bg-slate-950/30 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.met ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      </div>
                    )}
                    <span className={item.met ? 'font-semibold text-slate-200' : 'text-slate-400'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button - Disabled until valid password entered */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isLoginPasswordValid || !email.trim() || loading}
                className={`w-full py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-300 ${
                  isLoginPasswordValid && email.trim() && !loading
                    ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer active:scale-98'
                    : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Admin Clearance...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate as Administrator</span>
                  </>
                )}
              </button>

              {(!isLoginPasswordValid || !email.trim()) && (
                <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                  Submit button unlocks once all 5 security policy criteria are satisfied.
                </p>
              )}
            </div>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD REQUEST */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 animate-fade-in">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-rose-400" />
                <span>Recover Admin Access</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your admin email address. A cryptographic 15-minute reset token will be generated.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Registered Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearAlerts();
                  }}
                  placeholder="admin@auramarket.com"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            {devTokenHelper && (
              <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                  <span>Development Reset Token</span>
                  <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded">Active 15 min</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl font-mono text-[11px] text-purple-200 break-all select-all border border-purple-500/20">
                  {devTokenHelper}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResetToken(devTokenHelper);
                    setMode('reset');
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Set New Password</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl text-sm font-bold shadow-lg transition active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Reset Token</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearAlerts();
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('reset');
                  clearAlerts();
                }}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
              >
                Already have token? Reset here
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: RESET PASSWORD CONFIRMATION */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4 animate-fade-in">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Define New Password</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Provide your cryptographic reset token and configure a new password satisfying all policy requirements.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Reset Token
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => {
                    setResetToken(e.target.value);
                    clearAlerts();
                  }}
                  placeholder="Paste 64-character token"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-11 pr-4 py-3 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                New Strong Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearAlerts();
                  }}
                  placeholder="Enter compliant new password"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearAlerts();
                  }}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">Passwords do not match</p>
              )}
            </div>

            {/* REAL-TIME POLICY CHECKLIST FOR RESET PASSWORD */}
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>New Password Policy Verification</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isResetPasswordValid 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {resetCriteria.filter(c => c.met).length} / {resetCriteria.length} Met
                </span>
              </div>

              {/* Strength meter bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    resetStrength === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                    resetStrength >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                    'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${resetStrength}%` }}
                />
              </div>

              {/* Checklist items */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {resetCriteria.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-2.5 text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                      item.met 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                        : 'bg-slate-950/30 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.met ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      </div>
                    )}
                    <span className={item.met ? 'font-semibold text-slate-200' : 'text-slate-400'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isResetPasswordValid || newPassword !== confirmPassword || !resetToken.trim() || loading}
              className={`w-full py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-300 ${
                isResetPasswordValid && newPassword === confirmPassword && resetToken.trim() && !loading
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer active:scale-98'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Password & Complete Reset</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearAlerts();
                }}
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Login
              </button>
            </div>
          </form>
        )}

        {/* DEMO / TEST CREDENTIALS ACCORDION */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowDevPanel(!showDevPanel)}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{showDevPanel ? 'Hide Test Credentials' : 'Show Demo Testing Credentials'}</span>
            </button>

            <button
              type="button"
              onClick={handleSeedDemoUsers}
              disabled={loading}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-xl transition"
            >
              Seed DB Users
            </button>
          </div>

          {showDevPanel && (
            <div className="mt-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 animate-fade-in text-xs">
              <p className="text-slate-400 text-[11px]">
                Click any scenario below to automatically populate the login fields:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickFill('admin')}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group"
                >
                  <div className="font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                    <span>Valid Admin</span>
                    <span className="text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">200 OK</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">admin@auramarket.com</div>
                  <div className="text-[10px] text-slate-500 font-mono">Admin@12345_Secure</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill('non-admin')}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition group"
                >
                  <div className="font-bold text-amber-400 group-hover:text-amber-300 flex items-center justify-between">
                    <span>Non-Admin User</span>
                    <span className="text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">403 Forbidden</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">user@auramarket.com</div>
                  <div className="text-[10px] text-slate-500 font-mono">User@12345_Secure</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill('wrong-pwd')}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition group"
                >
                  <div className="font-bold text-rose-400 group-hover:text-rose-300 flex items-center justify-between">
                    <span>Wrong Password</span>
                    <span className="text-[9px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">401 Invalid</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">admin@auramarket.com</div>
                  <div className="text-[10px] text-slate-500 font-mono">Wrong@12345_Pass</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill('weak-pwd')}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl text-left transition group"
                >
                  <div className="font-bold text-slate-400 group-hover:text-slate-300 flex items-center justify-between">
                    <span>Weak Password</span>
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Submit Disabled</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">admin@auramarket.com</div>
                  <div className="text-[10px] text-slate-500 font-mono">weak</div>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
