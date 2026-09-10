import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, ArrowRight, Search, Landmark, ShieldAlert, CheckCircle, Check, Loader2, Info } from 'lucide-react';
import { ModalWrapper } from './Modals';

// 1. FAQ Database
const FAQ_DATA = [
  {
    q: "How can I track my transaction or delivery?",
    a: "You can track your order using the 'Transaction Status' portal. Enter your transaction ID (e.g. TXN-1001) to view the shipping status stepper."
  },
  {
    q: "My payment failed but the amount was deducted. What should I do?",
    a: "If you experience a transaction failure, open the 'Transaction Error Services' panel, choose the transaction date, and submit an error ticket. Our team resolves disputed payment tickets within 24 hours."
  },
  {
    q: "How do I claim reward coupon codes?",
    a: "Open the 'Rewards' dropdown on the top bar to see active coupons. Click on a coupon to copy its code, then input it in the 'Gift Voucher' portal to claim credit."
  },
  {
    q: "What benefits does Aura Plus Membership provide?",
    a: "Plus Members receive free 24x7 premium chat assistance, a perpetual 15% discount on selected accessories, and early access to promotional flash offers."
  },
  {
    q: "How can I list advertisements for my products?",
    a: "Sellers can click on 'Advertise on Shop' in the topbar to define campaigns, allocate daily budgets, and boost views across search queries."
  }
];

// 2. Mock Transaction Records
const MOCK_TRANSACTIONS = {
  "TXN-1001": {
    id: "TXN-1001",
    product: "Pro Wireless Headphones",
    price: "$299.99",
    status: 3, // Delivered
    statusText: "Delivered",
    date: "June 20, 2026",
    payment: "Paid via Visa",
    steps: ["Order Placed", "Dispatched from warehouse", "Arrived at sorting hub", "Delivered successfully"]
  },
  "TXN-1002": {
    id: "TXN-1002",
    product: "Minimalist Mechanical Keyboard",
    price: "$89.99",
    status: 1, // Dispatched
    statusText: "Dispatched",
    date: "June 21, 2026",
    payment: "Paid via Mastercard",
    steps: ["Order Placed", "Dispatched from warehouse", "Out for Delivery", "Delivered"]
  },
  "TXN-1003": {
    id: "TXN-1003",
    product: "Smart Fitness Watch",
    price: "$149.99",
    status: 0, // Order Placed
    statusText: "Processing Payment",
    date: "June 22, 2026",
    payment: "Pending bank verification",
    steps: ["Order Received", "Dispatched", "In Transit", "Delivered"]
  }
};

// 3. Floating 24x7 Live Chat Widget Component
export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am AuraCare, your 24/7 shopping guide. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Mock chatbot answer selector
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Thanks for reaching out! A representative will connect shortly. For instant answers, try asking about 'refund', 'tracking', 'membership' or 'error'.";
      const q = userMsg.toLowerCase();

      if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        reply = "Hello there! Hope you are having a great shopping experience. How can I support you?";
      } else if (q.includes('refund') || q.includes('money') || q.includes('return')) {
        reply = "To request a refund, go to Customer Services FAQ or submit a ticket via Transaction Error Services if your transaction was interrupted.";
      } else if (q.includes('track') || q.includes('status') || q.includes('where')) {
        reply = "You can instantly verify order shipments using the Transaction Tracker in our Help Center. Try inputting order ID 'TXN-1001' or 'TXN-1002'.";
      } else if (q.includes('membership') || q.includes('plus')) {
        reply = "Aura Plus VIP memberships provide free delivery on all orders, triple rewards points, and exclusive access to customer care tickets priority queue.";
      } else if (q.includes('error') || q.includes('fail') || q.includes('decline')) {
        reply = "Payment problems? Please open the Transaction Error Services from our support dashboard to submit a ticket. We'll audit bank records and release holds.";
      } else if (q.includes('code') || q.includes('discount') || q.includes('gift')) {
        reply = "Try checking the Rewards panel in your top bar! Copy the active discount coupons and apply them at checkout or claim voucher codes.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform active:scale-95 group relative border border-white/20"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          {/* Quick Help Tooltip */}
          <div className="absolute right-16 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none shadow-glass">
            24x7 Customer Care
          </div>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[460px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
                AC
              </div>
              <div>
                <h4 className="text-xs font-bold">24x7 AuraCare Assistant</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] text-primary-200">Online & Ready</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm font-medium ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-400 border border-slate-100 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" /> typing...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ask support details..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl px-3 py-2 text-xs focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// 4. Combined Helpmates & FAQ Dashboard (Customer Services, Transaction status / errors)
export const SupportCenter = ({ isOpen, onClose, defaultTab = 'faq' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [faqSearch, setFaqSearch] = useState('');
  
  // Transaction search state
  const [txnQuery, setTxnQuery] = useState('');
  const [txnResult, setTxnResult] = useState(null);
  const [txnError, setTxnError] = useState('');

  // Error ticket reporter state
  const [errTxnId, setErrTxnId] = useState('');
  const [errCategory, setErrCategory] = useState('Deducted but not Credited');
  const [errDesc, setErrDesc] = useState('');
  const [errTickets, setErrTickets] = useState([
    {
      ticketId: 'ERR-7281',
      txnId: 'TXN-1090',
      category: 'Card Decline / Double Charge',
      status: 'Resolved',
      date: 'June 19, 2026'
    }
  ]);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle FAQ search filter
  const filteredFAQs = FAQ_DATA.filter(faq => 
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Handle transaction check submit
  const handleTxnSearch = (e) => {
    e.preventDefault();
    if (!txnQuery.trim()) {
      setTxnError('Enter a valid order/transaction ID');
      setTxnResult(null);
      return;
    }

    const cleaned = txnQuery.trim().toUpperCase();
    const result = MOCK_TRANSACTIONS[cleaned];
    if (result) {
      setTxnResult(result);
      setTxnError('');
    } else {
      setTxnError('Transaction ID not found. Try "TXN-1001" or "TXN-1002"');
      setTxnResult(null);
    }
  };

  // Submit error ticket
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!errTxnId.trim() || !errDesc.trim()) return;

    const newTicket = {
      ticketId: `ERR-${Math.floor(1000 + Math.random() * 9000)}`,
      txnId: errTxnId.toUpperCase(),
      category: errCategory,
      status: 'Open Review',
      date: 'Today'
    };

    setErrTickets([newTicket, ...errTickets]);
    setErrTxnId('');
    setErrDesc('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Customer Services & Support Center">
      <div className="space-y-5 max-w-lg min-h-[420px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100">
          {[
            { id: 'faq', name: 'FAQs & Helplines' },
            { id: 'tracker', name: 'Transaction Status' },
            { id: 'errors', name: 'Transaction Error Help' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab 1: Searchable FAQ list */}
        {activeTab === 'faq' && (
          <div className="space-y-4 flex-grow flex flex-col">
            <div className="relative">
              <input
                type="text"
                placeholder="Search solutions and guides..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none transition"
              />
              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto max-h-[300px] pr-1">
              {filteredFAQs.length === 0 ? (
                <p className="text-center py-10 text-xs text-slate-400 font-medium">No matches found. Try searching another topic.</p>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 transition">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-primary-500 shrink-0" /> {faq.q}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium pl-5">{faq.a}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-primary-50/30 rounded-xl flex items-center justify-between text-xs border border-primary-100">
              <span className="text-slate-600 font-medium">Need immediate assistance?</span>
              <button 
                onClick={() => {
                  // Simulate opening floating chat
                  alert("Please use the floating chat bubble in the bottom right corner of the screen for 24x7 instant support!");
                }}
                className="text-primary-700 font-extrabold hover:underline"
              >
                Start Live Chat &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Transaction Status Tracker */}
        {activeTab === 'tracker' && (
          <div className="space-y-4 flex-grow">
            <form onSubmit={handleTxnSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Enter Transaction ID (e.g. TXN-1001)"
                  value={txnQuery}
                  onChange={(e) => setTxnQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl pl-3 pr-4 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95"
              >
                Track Status
              </button>
            </form>

            {txnError && <p className="text-xs text-rose-600 font-semibold">{txnError}</p>}

            {txnResult ? (
              <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction Code</span>
                    <h4 className="text-sm font-extrabold text-slate-800 font-mono">{txnResult.id}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price Details</span>
                    <span className="text-sm font-extrabold text-primary-600 font-mono">{txnResult.price}</span>
                  </div>
                </div>

                {/* Progress Stepper Visual */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shipment Milestones</span>
                  <div className="relative pl-6 space-y-5">
                    {/* Stepper bar line */}
                    <div className="absolute left-[9px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />

                    {txnResult.steps.map((step, idx) => {
                      const isActive = idx <= txnResult.status;
                      return (
                        <div key={idx} className="relative flex items-start gap-3">
                          <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border transition ${
                            isActive 
                              ? 'bg-primary-600 border-primary-600 text-white' 
                              : 'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {isActive ? <Check className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                          </div>
                          <div>
                            <h5 className={`text-xs font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step}
                            </h5>
                            {idx === 0 && (
                              <p className="text-[10px] text-slate-400 font-medium">Placed on {txnResult.date} • {txnResult.payment}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">Track Order Shipments</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Verify package transit markers by typing order IDs. Use `TXN-1001` or `TXN-1002` to demo active trackers.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Transaction Error Support Services */}
        {activeTab === 'errors' && (
          <div className="space-y-4 flex-grow flex flex-col justify-between">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex gap-3">
              <ShieldAlert className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Transaction Dispute Resolvers</h4>
                <p className="text-[11px] text-rose-600 leading-relaxed font-medium">
                  Use this console to register error codes, double charges, bank gateways delays, or failed payment disputes.
                </p>
              </div>
            </div>

            {/* Ticket submission form */}
            <form onSubmit={handleTicketSubmit} className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Transaction ID</label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-1003"
                    value={errTxnId}
                    onChange={(e) => setErrTxnId(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-lg px-2.5 py-2 text-xs font-bold uppercase focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Error Type</label>
                  <select
                    value={errCategory}
                    onChange={(e) => setErrCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-lg px-2 py-2 text-xs focus:outline-none transition text-slate-700 font-bold"
                  >
                    <option>Deducted but not Credited</option>
                    <option>Card Decline / Double Charge</option>
                    <option>Payment Gateway Timeout</option>
                    <option>Refund Dispute</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe what occurred (e.g. page spun, error code 400, etc.)"
                  value={errDesc}
                  onChange={(e) => setErrDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-lg px-3 py-2 text-xs focus:outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                {ticketSuccess ? <CheckCircle className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                {ticketSuccess ? 'Ticket Submitted Successfully!' : 'Register Bank Dispute Ticket'}
              </button>
            </form>

            {/* List of submitted tickets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Support Tickets</span>
              <div className="divide-y border border-slate-100 rounded-xl bg-white max-h-28 overflow-y-auto">
                {errTickets.map((t, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{t.ticketId}</span>
                        <span className="text-slate-400 text-[10px]">({t.txnId})</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{t.category}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold border ${
                        t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {t.status}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
