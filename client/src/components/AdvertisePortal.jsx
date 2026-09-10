import React, { useState } from 'react';
import { X, Sparkles, Plus, TrendingUp, Users, Target, CircleDollarSign, Check, Trash2 } from 'lucide-react';
import { ModalWrapper } from './Modals';

export const AdvertisePortal = ({ isOpen, onClose }) => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'AD-9831',
      name: 'Summer Clearance Push',
      product: 'Ergonomic Office Chair',
      budget: '$15.00/day',
      status: 'Active',
      clicks: 142,
      impressions: 3450,
      ctr: '4.1%'
    },
    {
      id: 'AD-2248',
      name: 'Wireless Launch Campaign',
      product: 'Pro Wireless Headphones',
      budget: '$25.00/day',
      status: 'Paused',
      clicks: 890,
      impressions: 12040,
      ctr: '7.3%'
    }
  ]);

  const [formName, setFormName] = useState('');
  const [formProduct, setFormProduct] = useState('Pro Wireless Headphones');
  const [formBudget, setFormBudget] = useState('10');
  const [formTarget, setFormTarget] = useState('Tech Enthusiasts');
  const [success, setSuccess] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newAd = {
      id: `AD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formName,
      product: formProduct,
      budget: `$${parseFloat(formBudget).toFixed(2)}/day`,
      status: 'Active',
      clicks: 0,
      impressions: 0,
      ctr: '0.0%'
    };

    setCampaigns([newAd, ...campaigns]);
    setFormName('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleDelete = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleToggleStatus = (id) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'Active' ? 'Paused' : 'Active'
        };
      }
      return c;
    }));
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Advertise on AuraMarket">
      <div className="space-y-6 max-w-lg">
        {/* Header Pitch */}
        <div className="bg-gradient-to-tr from-primary-900 to-indigo-950 text-white p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.25),transparent_60%)]" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary-500/30 text-primary-300 border border-primary-500/20 mb-2">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" /> Seller Center
            </span>
            <h3 className="text-base font-extrabold">Boost Sales & Visibility</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Place sponsored banners, prioritize your products in search queries, and drive active buyers straight to your catalog listings.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Users className="w-4 h-4 text-violet-500" />
              <span className="text-[10px] font-bold">Views</span>
            </div>
            <span className="text-sm font-extrabold text-slate-900">15.5k</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold">Clicks</span>
            </div>
            <span className="text-sm font-extrabold text-slate-900">1,032</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <CircleDollarSign className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold">Spent</span>
            </div>
            <span className="text-sm font-extrabold text-slate-900">$84.50</span>
          </div>
        </div>

        {/* Campaign Creation Form */}
        <div className="bg-white border border-slate-100 p-4.5 rounded-xl space-y-3 shadow-inner">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-primary-500" /> Launch New Ad Campaign
          </h4>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. Black Friday Special"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-3 py-2 text-xs focus:outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product</label>
                <select
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl px-3 py-2 text-xs focus:outline-none transition font-medium text-slate-700"
                >
                  <option>Pro Wireless Headphones</option>
                  <option>Minimalist Mechanical Keyboard</option>
                  <option>Ergonomic Office Chair</option>
                  <option>Smart Fitness Watch</option>
                  <option>Premium Leather Backpack</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Daily Budget ($)</label>
                <input
                  type="number"
                  min="5"
                  value={formBudget}
                  onChange={(e) => setFormBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl px-3 py-2 text-xs focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Audience</label>
              <div className="flex gap-2">
                {['Tech Enthusiasts', 'Office Workers', 'Gamers', 'All Shoppers'].map((target) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setFormTarget(target)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition border ${
                      formTarget === target
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-55'
                    }`}
                  >
                    {target}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition active:scale-98"
            >
              {success ? 'Campaign Activated!' : 'Launch Sponsored Campaign'}
            </button>
          </form>
        </div>

        {/* Existing Ads List */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns ({campaigns.length})</label>
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50">
            {campaigns.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 font-medium">No campaigns found. Launch one above!</p>
            ) : (
              campaigns.map((ad) => (
                <div key={ad.id} className="p-3.5 flex items-center justify-between bg-white first:rounded-t-xl last:rounded-b-xl border-b border-slate-100 hover:bg-slate-50/40 transition">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{ad.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                        ad.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {ad.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Product: <span className="font-semibold text-slate-600">{ad.product}</span> • Budget: <span className="font-mono text-slate-600">{ad.budget}</span>
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Clicks: <span className="font-bold text-slate-700">{ad.clicks}</span> • Imp: <span className="font-bold text-slate-700">{ad.impressions}</span> • CTR: <span className="font-bold text-slate-700">{ad.ctr}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(ad.id)}
                      className="px-2 py-1 rounded border text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition"
                    >
                      {ad.status === 'Active' ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
