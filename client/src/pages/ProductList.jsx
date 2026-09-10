import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  setFilter, 
  resetFilters, 
  setPage, 
  selectAllProducts 
} from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ShoppingCart, 
  RefreshCw, 
  Database,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Share2,
  Check,
  Copy,
  QrCode,
  Clock,
  Percent,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { QRShareModal } from '../components/Modals';
import ProductCard from '../components/ProductCard';
import { Hero } from '../components/Hero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page, pages, filters, totalProducts } = useSelector(selectAllProducts);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shareProduct, setShareProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 45, seconds: 12 });

  // Auto rotate carousel slides
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(carouselTimer);
  }, []);

  // Countdown timer for deals
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 45, seconds: 12 };
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);

  // Fetch products when filters, search, sorting or page changes
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Sync local search state with Redux filter state
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Handler for text search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ search: localSearch }));
  };

  // Debounced search trigger (clearing search triggers immediate fetch)
  const handleSearchChange = (val) => {
    setLocalSearch(val);
    if (val === '') {
      dispatch(setFilter({ search: '' }));
    }
  };

  const handleCategoryClick = (category) => {
    dispatch(setFilter({ category }));
  };

  const handlePriceChange = (field, value) => {
    dispatch(setFilter({ [field]: value }));
  };

  const handleRatingClick = (rating) => {
    dispatch(setFilter({ rating }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilter({ sort: e.target.value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(setPage(newPage));
      dispatch(fetchProducts({ ...filters, page: newPage }));
    }
  };

  // Call API to seed demo products
  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      await axios.post('/api/products/seed');
      setSeedSuccess(true);
      dispatch(fetchProducts(filters));
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to seed database', err);
    } finally {
      setSeeding(false);
    }
  };

  // Predefined categories & rating levels
  const categories = ['All', 'Electronics', 'Furniture', 'Accessories'];
  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '4.5', label: '4.5 & up' },
    { value: '4.0', label: '4.0 & up' },
    { value: '3.0', label: '3.0 & up' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* High-End Dark Neon Hero Section Component */}
      <Hero />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS - Mobile/Desktop Responsive */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-card p-6 rounded-2xl shadow-glass space-y-8 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <span className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                <SlidersHorizontal className="w-4.5 h-4.5 text-primary-500" /> Filters
              </span>
              <button 
                onClick={() => {
                  dispatch(resetFilters());
                  setLocalSearch('');
                }}
                className="text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline transition"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Category</h3>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {categories.map((cat) => {
                  const targetCat = cat === 'All' ? '' : cat;
                  const isActive = filters.category === targetCat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(targetCat)}
                      className={`text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500 pl-4' 
                          : 'text-slate-600 hover:bg-slate-50 pl-3 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Price Range ($)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="w-full bg-slate-100/50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="w-full bg-slate-100/50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Offers & Promotions Filter Checkbox */}
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Offers & Promotions</h3>
              <button
                type="button"
                onClick={() => dispatch(setFilter({ onOffer: !filters.onOffer }))}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border transition ${
                  filters.onOffer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span>On Offer Items Only</span>
                </div>
                {filters.onOffer && <Check className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT LAYOUT */}
        <div className="flex-grow space-y-6">
          
          {/* SEARCH BAR & SORTING HEADER */}
          <div className="glass-card p-4 rounded-2xl shadow-glass flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search premium catalog..."
                className="w-full bg-slate-100/50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all duration-300"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400 w-4.5 h-4.5" />
              {localSearch && (
                <button 
                  type="submit" 
                  className="absolute right-3 top-2 px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold text-xs rounded-lg transition"
                >
                  Find
                </button>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-slate-500 text-xs font-semibold whitespace-nowrap">
                {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'} found
              </span>
              
              {/* Shifted Ratings Filter */}
              <div className="relative flex items-center">
                <Star className="absolute left-3.5 text-amber-500 fill-amber-500 w-3.5 h-3.5 pointer-events-none" />
                <select
                  value={filters.rating}
                  onChange={(e) => handleRatingClick(e.target.value)}
                  className="bg-slate-100/50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold text-slate-700 outline-none appearance-none cursor-pointer"
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5★ & up</option>
                  <option value="4.0">4.0★ & up</option>
                  <option value="3.0">3.0★ & up</option>
                </select>
                <ChevronDown className="absolute right-3.5 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              </div>

              {/* Sorting Select */}
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-3.5 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="bg-slate-100/50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold text-slate-700 outline-none appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="ratingDesc">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3.5 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ERROR STATUS */}
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center">
              <p className="text-rose-600 font-medium">{error}</p>
              <button 
                onClick={() => dispatch(fetchProducts(filters))}
                className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* LOADING AND SKELETON PLACEHOLDER */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="bg-slate-200 h-48 w-full rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-8 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            
            /* EMPTY CATALOG STATE */
            <div className="text-center py-20 bg-white rounded-3xl shadow-glass border border-slate-100 max-w-xl mx-auto">
              <Database className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Products Available</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 px-6">
                Your database is empty. You can seed mock products into MongoDB automatically using our seed helper.
              </p>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-700 transition active:scale-95 disabled:opacity-50"
              >
                {seeding ? (
                  <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <Database className="w-4.5 h-4.5" />
                )}
                {seedSuccess ? 'Database Populated!' : 'Populate Demo Products'}
              </button>
            </div>
          ) : (
            
            /* PRODUCT GRID DISPLAY */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onShare={setCurrentSlide ? setShareProduct : undefined} 
                  onAddToCart={(p) => dispatch(addToCart({
                    product: p._id,
                    name: p.name,
                    price: p.price,
                    images: p.images,
                    category: p.category,
                    qty: 1
                  }))}
                />
              ))}
            </div>
          )}

          {/* PAGINATION PANEL */}
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-primary-400 bg-white text-slate-600 disabled:opacity-40 disabled:hover:border-slate-200 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(pages)].map((_, index) => {
                const pageNum = index + 1;
                const isCurrent = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-11 h-11 rounded-xl text-sm font-semibold transition ${
                      isCurrent 
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                        : 'border border-slate-200 hover:border-primary-400 bg-white text-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pages}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-primary-400 bg-white text-slate-600 disabled:opacity-40 disabled:hover:border-slate-200 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
      <QRShareModal isOpen={shareProduct !== null} onClose={() => setShareProduct(null)} product={shareProduct} />
    </div>
  );
};

export default ProductList;
