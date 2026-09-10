import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, ShoppingBag, Heart, User, Sparkles } from 'lucide-react';
import ProductList from './pages/ProductList';
import { selectCart } from './store/slices/cartSlice';
import { Header } from './components/Header';
import { LiveChatWidget } from './components/SupportCenter';
import { ConsumerPolicyModal } from './components/Modals';
import { SupportCenter } from './components/SupportCenter';
import AdminLogin from './components/AdminLogin';

// A simple details page component placeholder
const ProductDetail = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 text-center">
    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Details</h2>
    <p className="mt-4 text-slate-500 max-w-md mx-auto">This page is scaffolded and ready for your custom styling and full-stack product review / gallery integration.</p>
    <Link to="/" className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition">
      Back to Shop
    </Link>
  </div>
);

// A simple cart page component placeholder
const CartView = () => {
  const { cartItems } = useSelector(selectCart);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-glass border border-slate-100">
          <ShoppingCart className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">Your cart is empty</h3>
          <p className="mt-2 text-sm text-slate-500">Go add some products to see them here!</p>
          <Link to="/" className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-glass border border-slate-100 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {cartItems.map((item) => (
              <li key={item.product} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-slate-500 text-sm">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
                  <p className="text-xs text-slate-400">Qty: {item.qty} &times; ${item.price}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-6 bg-slate-50 flex justify-between items-center border-t border-slate-100">
            <span className="font-semibold text-slate-700">Subtotal:</span>
            <span className="text-2xl font-black text-slate-950">
              ${cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { cartItems } = useSelector(selectCart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const [openPolicy, setOpenPolicy] = useState(false);
  const [openFooterSupport, setOpenFooterSupport] = useState(false);
  const [footerSupportTab, setFooterSupportTab] = useState('faq');

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Navigation bar */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<div className="py-20 text-center text-slate-500">Page not found</div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <span className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary-400" />
                <span>AuraMarket</span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elevating your online shopping experience with elegant design, high performance, and curated quality products.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-xs tracking-wider uppercase mb-4">Consumer Policy</h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button type="button" onClick={() => setOpenPolicy(true)} className="hover:text-slate-300 transition text-left">Cancellation & Returns</button></li>
                <li><button type="button" onClick={() => setOpenPolicy(true)} className="hover:text-slate-300 transition text-left">Terms of Use</button></li>
                <li><button type="button" onClick={() => setOpenPolicy(true)} className="hover:text-slate-300 transition text-left">Security & Privacy Shield</button></li>
                <li><button type="button" onClick={() => setOpenPolicy(true)} className="hover:text-slate-300 transition text-left">Anti-Counterfeit Policy</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-xs tracking-wider uppercase mb-4">Help & Support</h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button type="button" onClick={() => { setFooterSupportTab('faq'); setOpenFooterSupport(true); }} className="hover:text-slate-300 transition text-left">FAQ Helplines</button></li>
                <li><button type="button" onClick={() => { setFooterSupportTab('tracker'); setOpenFooterSupport(true); }} className="hover:text-slate-300 transition text-left">Track Order Status</button></li>
                <li><button type="button" onClick={() => { setFooterSupportTab('errors'); setOpenFooterSupport(true); }} className="hover:text-slate-300 transition text-left">Payment Error Desk</button></li>
              </ul>
            </div>
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <h3 className="text-white font-bold tracking-wider uppercase mb-2">Mail Us</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  AuraMarket Support,<br />
                  120 E-Commerce Blvd, Suite 400,<br />
                  New York, NY 10001, USA
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold tracking-wider uppercase mb-2">Registered Office Address</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  AuraMarket Inc.,<br />
                  450 Innovation Way, Tech District,<br />
                  Wilmington, DE 19801, USA
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
            &copy; 2026 AuraMarket. Crafted with care. All rights reserved.
          </div>
        </footer>

        {/* 24x7 Support Live Chat bubble */}
        <LiveChatWidget />

        {/* Policy overlays & Support details */}
        <ConsumerPolicyModal isOpen={openPolicy} onClose={() => setOpenPolicy(false)} />

        <SupportCenter
          isOpen={openFooterSupport}
          onClose={() => setOpenFooterSupport(false)}
        />
      </div>
    </Router>
  );
};

export default App;
