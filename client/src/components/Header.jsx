import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sparkles, Bell, Gift, MapPin, Globe, ShieldCheck, Shield,
  HelpCircle, User2, LogOut, ChevronDown, Check, Copy, ShoppingCart, Eye, Search
} from 'lucide-react';
import { selectCart } from '../store/slices/cartSlice';
import { setFilter } from '../store/slices/productSlice';
import { LocationModal, LoginModal, GiftVoucherModal } from './Modals';
import { AdvertisePortal } from './AdvertisePortal';
import { SupportCenter } from './SupportCenter';
import { CartOverlay } from './CartOverlay';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(selectCart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const searchInputRef = useRef(null);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // States
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [location, setLocation] = useState('New York (10001)');
  const [language, setLanguage] = useState('English (US)');
  const [searchVal, setSearchVal] = useState('');

  // Dropdown States
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifyDropdown, setShowNotifyDropdown] = useState(false);

  // Modal Open States
  const [openLogin, setOpenLogin] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [openAdvertise, setOpenAdvertise] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [supportTab, setSupportTab] = useState('faq');
  const [openCartOverlay, setOpenCartOverlay] = useState(false);

  // Copy success indicator
  const [copiedCode, setCopiedCode] = useState('');

  // Notifications Mock Array
  const [notifications, setNotifications] = useState([
    {
      id: 'N-1',
      title: 'Order Dispatched 📦',
      text: 'Order TXN-1002 is on the way to your location.',
      time: '2 hours ago',
      unread: true,
      actionTab: 'tracker'
    },
    {
      id: 'N-2',
      title: 'Double Charge Dispute resolved 💸',
      text: 'Dispute ticket ERR-7281 is resolved. Refund issued.',
      time: '1 day ago',
      unread: false,
      actionTab: 'errors'
    },
    {
      id: 'N-3',
      title: 'Flash Sale: 25% OFF Headphones! 🎧',
      text: 'Limited stock available on Wireless ANC headphones.',
      time: '3 days ago',
      unread: true,
      actionTab: 'faq'
    }
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ search: searchVal }));
    navigate('/');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowProfileDropdown(false);
  };

  const handleClaimVoucher = (benefit) => {
    if (typeof benefit === 'number') {
      // Credit store points
      setUser(prev => {
        if (!prev) return prev;
        const updated = { ...prev, rewardPoints: prev.rewardPoints + benefit * 10 };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    } else if (benefit === 'membership') {
      setUser(prev => {
        if (!prev) return prev;
        const updated = { ...prev, membership: 'VIP Platinum Member' };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleNotificationClick = (item) => {
    // Mark as read
    setNotifications(notifications.map(n => n.id === item.id ? { ...n, unread: false } : n));
    setShowNotifyDropdown(false);
    // Open support modal at selected tab
    setSupportTab(item.actionTab);
    setOpenSupport(true);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm">
        {/* Topbar: Location, Language, Quick Helplines */}
        {/* Topbar: Location, Language, Quick Helplines */}
        <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Delivery Location Selector */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition" onClick={() => setOpenLocation(true)}>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deliver to: <strong className="text-slate-200">{location}</strong></span>
            </div>

            {/* Support Links & Languages */}
            <div className="flex items-center space-x-5">
              <button onClick={() => setOpenAdvertise(true)} className="hover:text-white transition font-medium">
                Advertise on Shop
              </button>
              
              <button 
                onClick={() => {
                  setSupportTab('faq');
                  setOpenSupport(true);
                }} 
                className="hover:text-white transition font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" /> 24x7 Support
              </button>

              {/* Highlighted Membership Badge */}
              <button 
                onClick={() => {
                  if (user) {
                    setShowProfileDropdown(true);
                  } else {
                    setOpenLogin(true);
                  }
                }}
                className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 font-bold hover:bg-amber-500/25 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Plus Membership</span>
              </button>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  onBlur={() => setTimeout(() => setShowLangDropdown(false), 200)}
                  className="flex items-center gap-1 hover:text-white transition font-medium focus:outline-none"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLangDropdown && (
                  <div className="absolute right-0 mt-2.5 w-32 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 text-slate-300 z-50 animate-fade-in">
                    {['English (US)', 'English (UK)', 'Hindi (IN)', 'Spanish (ES)', 'French (FR)'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-800 hover:text-white transition text-[11px] font-semibold"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar: Sleek Dark Glass with Glowing Neon Aesthetics */}
        <div className="glass-dark bg-slate-950/90 backdrop-blur-xl border-b border-purple-500/20 px-4 sm:px-6 lg:px-8 py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Glowing AuraMarket Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.55)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-5.5 h-5.5 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent font-sans drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                  AuraMarket
                </span>
              </Link>
            </div>

            {/* Rounded Search Bar with ⌘K Shortcut Indicator */}
            <form onSubmit={handleSearchSubmit} className="flex-grow max-w-lg mx-4 relative hidden sm:block">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search premium items, brands and categories..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 rounded-full px-4 py-2.5 pl-10 pr-14 text-xs text-slate-200 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
                />
                <button type="submit" className="absolute left-3.5 text-slate-400 hover:text-cyan-400 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <div className="absolute right-3 flex items-center pointer-events-none">
                  <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-800/90 border border-slate-600/50 rounded-md shadow-sm">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </form>

            {/* Action Group: Notification, Gift, Cart, Glowing Login */}
            <div className="flex items-center space-x-3.5">
              {/* Notification Bell with Badge */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifyDropdown(!showNotifyDropdown)}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition relative focus:outline-none shadow-sm"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(244,63,94,0.6)]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifyDropdown && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in text-slate-200">
                    <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Notifications</span>
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}
                        className="text-[10px] text-cyan-400 font-bold hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-8 text-xs text-slate-500 font-medium">No new notifications</p>
                      ) : (
                        notifications.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleNotificationClick(item)}
                            className={`p-3.5 hover:bg-slate-900/60 cursor-pointer flex gap-3 transition ${item.unread ? 'bg-purple-950/20' : ''}`}
                          >
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                                <span>{item.title}</span>
                                {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                              </h5>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{item.text}</p>
                              <span className="text-[9px] text-slate-500 font-semibold">{item.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-slate-900/80 text-center border-t border-slate-800">
                      <button 
                        onClick={() => {
                          setShowNotifyDropdown(false);
                          setSupportTab('faq');
                          setOpenSupport(true);
                        }}
                        className="text-[10px] text-slate-400 font-bold hover:text-white"
                      >
                        View all support tickets
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Gift Vouchers */}
              <button 
                onClick={() => setOpenGift(true)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 text-purple-400 hover:text-purple-300 transition relative shadow-sm"
              >
                <Gift className="w-5 h-5 text-purple-400" />
              </button>

              {/* Shopping Cart */}
              <button 
                onClick={() => setOpenCartOverlay(true)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition relative outline-none shadow-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Glowing Login Button / User Profile Dropdown */}
              <div className="relative">
                {user ? (
                  <>
                    <button 
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center gap-1.5 p-1 px-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-200 transition focus:outline-none"
                    >
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-purple-400/50 object-cover" />
                      <span className="text-xs font-bold hidden md:flex items-center gap-1.5">
                        {user.name}
                        {user.role && (
                          <span className={`text-[8px] tracking-wide font-extrabold px-1.5 py-0.25 rounded uppercase border ${
                            user.role === 'admin' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                            user.role === 'seller' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            user.role === 'support' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          }`}>
                            {user.role}
                          </span>
                        )}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 z-50 animate-fade-in text-slate-200">
                        {/* Profile Header */}
                        <div className="flex items-center gap-3 pb-3.5 border-b border-slate-800">
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-purple-400/50 object-cover" />
                          <div>
                            <h4 className="text-sm font-black text-white leading-snug flex items-center gap-1.5">
                              {user.name}
                              {user.role && (
                                <span className={`text-[9px] tracking-wide font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                                  user.role === 'admin' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                  user.role === 'seller' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                  user.role === 'support' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                                }`}>
                                  {user.role}
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px] font-medium">{user.email}</p>
                          </div>
                        </div>

                        {/* Membership & Subscription options */}
                        <div className="space-y-2">
                          <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Membership</span>
                              <span className="text-xs font-bold text-white">{user.membership}</span>
                            </div>
                            <ShieldCheck className="w-6 h-6 text-amber-400" />
                          </div>

                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Subscription</span>
                              <span className="text-xs font-bold text-slate-200">{user.subscription}</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Active</span>
                          </div>

                          {/* Reward points */}
                          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Total Rewards Points</span>
                              <span className="text-xs font-bold text-white">{user.rewardPoints} Points</span>
                            </div>
                            <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-lg">$ {parseFloat(user.rewardPoints / 10).toFixed(2)} cash value</span>
                          </div>
                        </div>

                        {/* Coupons list */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exclusive Plus Coupons</span>
                          <div className="flex gap-2">
                            {['AURASAVE15', 'PLUSSHIP'].map(code => (
                              <button
                                key={code}
                                onClick={() => copyCouponCode(code)}
                                className="flex-1 p-2 bg-slate-900 border border-slate-800 hover:border-cyan-400/50 rounded-xl text-center transition flex items-center justify-center gap-1.5 focus:outline-none"
                              >
                                <span className="text-[10px] font-mono font-bold text-slate-300">{code}</span>
                                {copiedCode === code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Admin Portal Navigation */}
                        <Link
                          to="/admin/login"
                          onClick={() => setShowProfileDropdown(false)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-800 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-500/10 transition"
                        >
                          <Shield className="w-3.5 h-3.5" /> Admin Security Portal
                        </Link>

                        {/* Logout */}
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500/10 transition"
                        >
                          <LogOut className="w-4 h-4" /> Logout Account
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin/login"
                      className="hidden sm:flex items-center gap-1.5 py-2 px-3 rounded-full bg-slate-900 border border-rose-500/40 hover:border-rose-500 text-rose-400 hover:text-rose-300 text-xs font-bold transition shadow-sm"
                      title="Admin Security Operations Portal"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </Link>

                    <button 
                      onClick={() => setOpenLogin(true)}
                      className="flex items-center gap-2 py-2 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] cursor-pointer"
                    >
                      <User2 className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mounting Overlay Modals */}
      <LocationModal 
        isOpen={openLocation} 
        onClose={() => setOpenLocation(false)} 
        onSelectLocation={setLocation} 
        currentZip={location}
      />
      <LoginModal 
        isOpen={openLogin} 
        onClose={() => setOpenLogin(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
      <GiftVoucherModal 
        isOpen={openGift} 
        onClose={() => setOpenGift(false)} 
        onClaimVoucher={handleClaimVoucher}
      />
      <AdvertisePortal 
        isOpen={openAdvertise} 
        onClose={() => setOpenAdvertise(false)}
      />
      <SupportCenter 
        isOpen={openSupport} 
        onClose={() => setOpenSupport(false)}
        defaultTab={supportTab}
      />
      <CartOverlay 
        isOpen={openCartOverlay}
        onClose={() => setOpenCartOverlay(false)}
      />
    </>
  );
};
