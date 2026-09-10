import React, { useState } from 'react';
import { X, MapPin, Gift, KeyRound, User, Mail, Search, Check, Copy, QrCode, Shield, Store, Headphones } from 'lucide-react';

// Unified modal wrapper for smooth scaling and backgrounds
export const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white/95 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// 1. Location Selection Modal
export const LocationModal = ({ isOpen, onClose, onSelectLocation, currentZip }) => {
  const [zip, setZip] = useState(currentZip || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mockCities = [
    { city: 'New York, NY', zip: '10001' },
    { city: 'Los Angeles, CA', zip: '90001' },
    { city: 'Mumbai, MH', zip: '400001' },
    { city: 'London, UK', zip: 'EC1A' },
    { city: 'Tokyo, JP', zip: '100-0001' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zip.trim()) {
      setError('Please enter a valid zip or pin code');
      return;
    }
    setError('');
    setSuccess(true);
    setTimeout(() => {
      onSelectLocation(zip.toUpperCase());
      setSuccess(false);
      onClose();
    }, 800);
  };

  const handleCitySelect = (selectedZip) => {
    setZip(selectedZip);
    onSelectLocation(selectedZip);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Select Delivery Location">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Enter Zip / Pincode
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g., 400001 or 10001"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all"
            />
            <MapPin className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          </div>
          {error && <p className="text-xs text-rose-600 mt-1 font-semibold">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={success}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/25 transition active:scale-98 disabled:opacity-80 flex items-center justify-center gap-1.5"
        >
          {success ? (
            <>
              <Check className="w-4 h-4 animate-bounce" /> Updating Delivery Address...
            </>
          ) : (
            'Apply Pincode'
          )}
        </button>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Cities</p>
          <div className="grid grid-cols-2 gap-2">
            {mockCities.map((item) => (
              <button
                key={item.zip}
                type="button"
                onClick={() => handleCitySelect(item.zip)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 text-left text-xs font-medium text-slate-700 hover:text-primary-700 transition"
              >
                <span>{item.city}</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.zip}
                </span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 2. Custom Login / Register Modal
export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    // Mock network lag
    setTimeout(() => {
      setLoading(false);
      let membership = 'Gold Plus Member';
      let rewardPoints = 480;
      let subscription = 'Monthly AuraBox Active';
      let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100';

      if (role === 'admin') {
        membership = 'System Administrator';
        rewardPoints = 9999;
        subscription = 'Root Control Access';
        avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';
      } else if (role === 'seller') {
        membership = 'Certified Merchant';
        rewardPoints = 1850;
        subscription = 'Merchant Pro Plan';
        avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100';
      } else if (role === 'support') {
        membership = 'Support Desk Agent';
        rewardPoints = 500;
        subscription = 'Standard Staff Clearance';
        avatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100';
      }

      const user = {
        name: isRegister ? name : email.split('@')[0],
        email: email,
        avatar: avatar,
        membership: membership,
        rewardPoints: rewardPoints,
        subscription: subscription,
        role: role
      };
      onLoginSuccess(user);
      onClose();
    }, 1000);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={isRegister ? 'Create Account' : 'Welcome Back'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Login As / Select Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'user', label: 'User', icon: User, desc: 'Customer access' },
              { id: 'admin', label: 'Admin', icon: Shield, desc: 'Full controls' },
              { id: 'seller', label: 'Seller', icon: Store, desc: 'Merchant space' },
              { id: 'support', label: 'Support', icon: Headphones, desc: 'Help desk agent' },
            ].map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex items-start gap-2 p-2 rounded-xl border text-left transition-all outline-none ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/30 ring-1 ring-primary-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white bg-gradient-to-tr ${isSelected ? 'scale-105 shadow-sm' : 'opacity-85'} transition-all ${
                    r.id === 'user' ? 'from-blue-500 to-indigo-500' :
                    r.id === 'admin' ? 'from-rose-500 to-red-500' :
                    r.id === 'seller' ? 'from-emerald-500 to-teal-500' :
                    'from-amber-500 to-orange-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      {r.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-tight">{r.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isRegister && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition"
              />
              <User className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="example@auramarket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition"
            />
            <Mail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition"
            />
            <KeyRound className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/25 transition active:scale-98 disabled:opacity-80 flex items-center justify-center"
        >
          {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline transition"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 3. Gift Voucher Modal
export const GiftVoucherModal = ({ isOpen, onClose, onClaimVoucher }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClaim = (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      setError('Please input a voucher code');
      return;
    }
    setError('');

    // Valid mock vouchers
    const code = voucherCode.trim().toUpperCase();
    if (code === 'GIFT25') {
      setSuccess('Succesfully redeemed! $25.00 has been credited to your rewards account.');
      onClaimVoucher(25);
      setVoucherCode('');
    } else if (code === 'AURAPLUS') {
      setSuccess('Congratulations! Claimed 1-Month FREE Aura Plus Premium Subscription.');
      onClaimVoucher('membership');
      setVoucherCode('');
    } else {
      setError('Invalid or expired voucher code. Try "GIFT25" or "AURAPLUS"');
    }

    setTimeout(() => {
      setSuccess('');
    }, 4000);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Gift Cards & Voucher Claims">
      <div className="space-y-5">
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Gift className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Redeem Gift Card / Voucher</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Enter your code to instantly claim shop credit or premium membership statuses.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleClaim} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="e.g. GIFT25"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider focus:outline-none transition"
            />
            {error && <p className="text-xs text-rose-600 font-semibold mt-1">{error}</p>}
            {success && <p className="text-xs text-emerald-600 font-semibold mt-1">{success}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition active:scale-98"
          >
            Redeem Code
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Code Cheatsheet</span>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
            <span className="font-mono font-bold text-slate-700">GIFT25</span>
            <span className="text-slate-500">Gives $25 Store Credit</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
            <span className="font-mono font-bold text-slate-700">AURAPLUS</span>
            <span className="text-slate-500">Redeem Plus Membership</span>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 4. QR Code Sharing Modal
export const QRShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  if (!product) return null;

  const itemLink = `${window.location.origin}/product/${product._id || product.product}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(itemLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Share Product Details">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-full p-4 bg-slate-50 rounded-xl flex gap-3 text-left">
          <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg border" />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
            <p className="text-xs text-slate-500 font-bold mt-0.5">${product.price?.toFixed(2)}</p>
          </div>
        </div>

        {/* Dynamic Vector Simulated QR Code */}
        <div className="p-5 bg-gradient-to-tr from-primary-50 to-indigo-50 border border-slate-200/50 rounded-2xl shadow-inner relative group">
          <svg className="w-40 h-40 text-slate-900 fill-current" viewBox="0 0 100 100">
            {/* Outline Corners */}
            <path d="M5,5 h20 v5 h-15 v15 h-5 Z" />
            <path d="M95,5 h-20 v5 h-15 v15 h5 Z" className="hidden" />
            <path d="M75,5 h20 v5 v15 h-5 v-15 Z" />
            <path d="M5,95 h20 v-5 h-15 v-15 h-5 Z" />
            <path d="M75,95 h20 v-5 v-15 h-5 v-15 Z" className="hidden" />
            <path d="M95,95 h-20 v-5 v-15 h5 v-15" className="hidden" />
            <path d="M75,95 h20 v-5 v-15 h-5 Z" />

            {/* Core grids and dots to resemble QR code structure */}
            <rect x="10" y="10" width="20" height="20" rx="2" className="text-primary-700" />
            <rect x="14" y="14" width="12" height="12" fill="white" />
            <rect x="17" y="17" width="6" height="6" className="text-primary-700" />

            <rect x="70" y="10" width="20" height="20" rx="2" className="text-indigo-700" />
            <rect x="74" y="14" width="12" height="12" fill="white" />
            <rect x="77" y="17" width="6" height="6" className="text-indigo-700" />

            <rect x="10" y="70" width="20" height="20" rx="2" className="text-indigo-700" />
            <rect x="14" y="74" width="12" height="12" fill="white" />
            <rect x="17" y="77" width="6" height="6" className="text-indigo-700" />

            <rect x="75" y="75" width="12" height="12" rx="1" className="text-primary-700" />
            <rect x="78" y="78" width="6" height="6" fill="white" />

            {/* Random blocks */}
            <path d="M40,10 h5 v5 h-5 Z M45,15 h10 v5 h-10 Z M40,25 h15 v5 h-15 Z M60,10 h5 v10 h-5 Z M60,25 h5 v5 h-5 Z" />
            <path d="M10,40 h5 v15 h-5 Z M20,40 h15 v5 h-15 Z M10,60 h10 v5 h-10 Z M30,50 h5 v15 h-5 Z M25,60 h5 v5 h-5 Z" />
            <path d="M40,40 h20 v5 h-20 Z M45,50 h10 v10 h-10 Z M40,65 h15 v5 h-15 Z M60,40 h10 v15 h-10 Z M65,60 h15 v10 h-15 Z" />
            <path d="M70,40 h15 v5 h-15 Z M80,50 h10 v5 h-10 Z M85,60 h10 v5 h-10 Z M80,65 h5 v5 h-5 Z" />
          </svg>
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[1px] transition rounded-2xl">
            <QrCode className="w-8 h-8 text-slate-800 animate-pulse" />
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium">Scan code on your phone to open instantly.</p>

        <div className="w-full space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Copy Product Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={itemLink}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 select-all outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-xl border transition ${
                copied 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                  : 'bg-white border-slate-200 hover:border-primary-400 text-slate-600 hover:text-slate-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 5. Consumer Policy Modal
export const ConsumerPolicyModal = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="AuraMarket Consumer Policies">
      <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
        <div>
          <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-1">1. Cancellation & Returns</h4>
          <p>
            Customers can request product returns or cancellations within 30 days of delivery. Refund amounts are processed instantly to your rewards balance or back to the original bank account card within 3-5 business days.
          </p>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-1">2. Anti-Counterfeit Guarantee</h4>
          <p>
            All products listed on AuraMarket undergo meticulous quality checks and authentication standards. If you suspect an item is not authentic, register a bank dispute or submit a transaction issue ticket instantly.
          </p>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-1">3. Privacy and Data Shield</h4>
          <p>
            Your payment card details, physical addresses, and communication logs are encrypted using advanced standard security layers. We do not distribute consumer profile information to third-party databases.
          </p>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-1">4. Delivery Terms</h4>
          <p>
            Standard shipping takes 2-4 business days. Plus members receive free next-day express delivery. Pin codes are verified dynamically to calculate routes.
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
};
