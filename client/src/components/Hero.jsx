import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { 
  Sparkles, Star, ChevronLeft, ChevronRight, Volume2, ShieldCheck, 
  CheckCircle2, ArrowRight
} from 'lucide-react';

const SPOTLIGHT_PRODUCTS = [
  {
    id: 'hero-earbuds-pro',
    name: 'Aura Wireless Pro',
    tag: 'Aura Wireless Pro',
    headline: 'SOUND DIFFERENT',
    subtitle: 'ALL-DAY POWER. ZERO COMPROMISE. Immersive sound. Intelligent noise cancellation. Engineered to make every detail sound closer.',
    cta: 'EXPERIENCE THE SOUND',
    price: 20,
    originalPrice: 49,
    rating: 4.7,
    reviewsCount: '2.4k',
    inStock: true,
    image: '/hero-earbuds.jpg',
    category: 'Audio',
    features: ['Spatial Audio 360°', '48dB Active Hybrid ANC', 'Lossless Hi-Fi Audio'],
    themeGradient: 'from-purple-500/20 via-cyan-500/10 to-indigo-500/20',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    badgeGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    soundType: 'spatial'
  },
  {
    id: 'hero-chrono-titan',
    name: 'Aura Chrono Titan',
    tag: 'Aura Chrono Titan',
    headline: 'BEYOND TIME',
    subtitle: 'AEROSPACE TITANIUM. INFINITE BATTERY. Precision biometric matrix, sapphire crystal AMOLED display, and extreme altitude telemetry.',
    cta: 'EXPLORE THE TITAN',
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewsCount: '1.8k',
    inStock: true,
    image: '/hero-smartwatch.jpg',
    category: 'Wearables',
    features: ['Grade 5 Titanium', 'Quantum Biosensor X', '14-Day Endurance'],
    themeGradient: 'from-cyan-500/20 via-purple-500/10 to-pink-500/20',
    accentColor: 'text-purple-400',
    accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    badgeGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    soundType: 'pulse'
  },
  {
    id: 'hero-horizon-studio',
    name: 'Aura Horizon Studio Pro',
    tag: 'Aura Horizon Studio Pro',
    headline: 'STUDIO TRANSCENDENCE',
    subtitle: 'BERYLLIUM DRIVERS. ZERO DISTORTION. High-definition spatial acoustic chamber engineered for audiophiles and master studio monitoring.',
    cta: 'IMMERSIVE ACOUSTICS',
    price: 499,
    originalPrice: 629,
    rating: 4.8,
    reviewsCount: '3.1k',
    inStock: true,
    image: '/hero-headset.jpg',
    category: 'Audio',
    features: ['Beryllium 50mm Drivers', '192kHz / 24-bit Lossless', 'Ultra-Plush Memory Foam'],
    themeGradient: 'from-indigo-500/20 via-purple-500/15 to-cyan-500/20',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    badgeGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.35)]',
    soundType: 'sub'
  }
];

export const Hero = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Dynamic visit persistence: rotate index so returning users see a different product
    try {
      const saved = localStorage.getItem('aura_hero_spotlight_index');
      const lastIndex = saved !== null ? parseInt(saved, 10) : -1;
      const nextIndex = (lastIndex + 1) % SPOTLIGHT_PRODUCTS.length;
      localStorage.setItem('aura_hero_spotlight_index', nextIndex.toString());
      return nextIndex;
    } catch {
      return 0;
    }
  });

  const [isPaused, setIsPaused] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  const product = SPOTLIGHT_PRODUCTS[currentIndex];

  // Auto rotation interval (paused when user hovers over the hero card)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_PRODUCTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // High-tech synthesized futuristic Web Audio feedback
  const playExperienceSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Futuristic warm chord & filter sweep
      const freqs = product.soundType === 'spatial' 
        ? [440, 554.37, 659.25, 880] 
        : product.soundType === 'pulse' 
        ? [330, 493.88, 659.25, 987.77] 
        : [220, 329.63, 440, 554.37];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.3);
        filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.4);
      });

      setAudioActive(true);
      setTimeout(() => setAudioActive(false), 2000);
    } catch (e) {
      console.log('Web Audio play skipped:', e);
    }
  };

  const handleCtaClick = () => {
    playExperienceSound();

    // Quick add to cart
    dispatch(addToCart({
      _id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      category: product.category,
      countInStock: 25,
      qty: 1
    }));

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2200);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SPOTLIGHT_PRODUCTS.length) % SPOTLIGHT_PRODUCTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_PRODUCTS.length);
  };

  return (
    <div 
      className="mb-14 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sleek rounded glassmorphic card with glowing border and dark slate/purple backdrop */}
      <div className="relative rounded-[2.25rem] sm:rounded-[2.75rem] overflow-hidden bg-gradient-to-br from-[#090b14] via-[#100d24] to-[#070611] border border-purple-500/25 neon-hero-card p-6 sm:p-10 lg:p-14 transition-all duration-700">
        
        {/* Atmospheric Ambient Glow Spheres & Nebulae */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/25 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Futuristic Cyber Tech Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Dynamic Product Switcher Pills (Top Header of Hero) */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
              Live Spotlight // Cycle 0{currentIndex + 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl p-1 rounded-full border border-white/10">
            {SPOTLIGHT_PRODUCTS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name.replace('Aura ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Main Hero Split Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Prominent 3D Audio Display with Earbuds Resting over Rugged Rock / Mountain Terrain */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* 3D Visual Centerpiece Container */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square flex items-center justify-center group">
              
              {/* Radial Neon Backlight Aura */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-purple-600/35 via-cyan-500/25 to-indigo-600/35 blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-80" />
              
              {/* Main 3D Artwork Image Frame */}
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm bg-black/40 animate-float">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Subtle Inner Glass Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070611] via-transparent to-transparent opacity-60" />

                {/* Floating Glass Pill Badges Over 3D Visual */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-cyan-400/30 shadow-lg">
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-cyan-400 rounded-full sound-bar" style={{ animationDelay: '0s' }} />
                      <span className="w-0.5 bg-cyan-300 rounded-full sound-bar" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-purple-400 rounded-full sound-bar" style={{ animationDelay: '0.4s' }} />
                      <span className="w-0.5 bg-cyan-400 rounded-full sound-bar" style={{ animationDelay: '0.1s' }} />
                    </div>
                    <span className="text-[11px] font-bold text-cyan-200 tracking-wider">
                      {product.features[0]}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-20">
                  <div className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 border border-purple-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-semibold text-purple-200">
                      {product.features[1]}
                    </span>
                  </div>
                </div>

                {audioActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-30 pointer-events-none transition-opacity">
                    <div className="glass-pill px-4 py-2 rounded-2xl flex items-center gap-2 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse">
                      <Volume2 className="w-5 h-5 text-cyan-400 animate-bounce" />
                      <span className="text-xs font-bold text-white tracking-widest uppercase">Spatial Sound Initialized</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Prev / Next Slide Controls (Overlay on Left Visual) */}
              <button
                onClick={handlePrev}
                aria-label="Previous Spotlight"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-pill border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Spotlight"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-pill border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Glowing Neon Headline, Subtitle, CTA Button, Glass Badges */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6">
            
            {/* Glowing Neon Top Tag */}
            <div>
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${product.accentBg} ${product.badgeGlow}`}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{product.tag}</span>
              </span>
            </div>

            {/* Glowing Neon Large Bold Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-sans">
                <span className="bg-gradient-to-r from-white via-purple-100 to-cyan-300 bg-clip-text text-transparent neon-glow-headline">
                  {product.headline}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-normal leading-relaxed max-w-xl text-balance">
              <strong className="text-white font-bold tracking-wide">
                {product.subtitle.split('.')[0]}.{' '}
              </strong>
              <span className="text-slate-400 font-medium">
                {product.subtitle.split('.').slice(1).join('.')}
              </span>
            </p>

            {/* CTA Button: Metallic Glass Pill Button with Subtle Glow on Hover */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleCtaClick}
                className="glass-metallic-btn px-8 py-4 rounded-full text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group shadow-2xl"
              >
                <Sparkles className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
                <span>{product.cta}</span>
                <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </button>

              {addedAnimation && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fade-in bg-emerald-500/10 px-4 py-2.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added {product.name} to Cart!</span>
                </div>
              )}
            </div>

            {/* Glass Badges Stacked on the Bottom Right */}
            <div className="pt-4 border-t border-white/10">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                
                {/* Price Badge */}
                <div className="glass-pill rounded-2xl p-3 sm:p-4 border border-white/10 text-center sm:text-left hover:border-cyan-500/40 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Price
                  </span>
                  <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
                    <span className="text-lg sm:text-2xl font-black text-white tracking-tight">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-slate-500 line-through font-semibold">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="glass-pill rounded-2xl p-3 sm:p-4 border border-white/10 text-center sm:text-left hover:border-purple-500/40 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Rating
                  </span>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="text-lg sm:text-2xl font-black text-amber-300 tracking-tight flex items-center">
                      {product.rating}
                    </span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      ({product.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="glass-pill rounded-2xl p-3 sm:p-4 border border-white/10 text-center sm:text-left hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Status
                  </span>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start mt-1 sm:mt-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400 tracking-wide">
                      In Stock
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Neon Carousel Indicator Dots (Bottom Center) */}
        <div className="relative z-20 flex items-center justify-center gap-2.5 mt-8 pt-4 border-t border-white/5">
          {SPOTLIGHT_PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]' 
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;
