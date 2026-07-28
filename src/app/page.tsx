"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Users,
  CreditCard,
  Bot,
  MessageSquare,
  Sliders,
  UserPlus,
  BarChart3,
  Layers,
  Code2,
  Receipt,
  ShieldCheck,
  Settings,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Send,
  Zap,
  Globe,
  Lock,
  Menu,
  X,
  Mic,
  Filter,
  Download,
  Share2,
  Trash2,
  Edit,
  QrCode
} from "lucide-react";

export default function BookFlowDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAiFloating, setShowAiFloating] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: "assistant", content: "Hello Mantu! I analyzed your schedule. You have 8 appointments today with a 98% predicted attendance rate. Would you like me to optimize your buffer times?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Calendar", icon: CalendarIcon },
    { name: "Appointments", icon: Clock },
    { name: "Booking Pages", icon: FileText },
    { name: "Customers", icon: Users },
    { name: "Payments", icon: CreditCard },
    { name: "AI Assistant", icon: Bot },
    { name: "SMS & Email", icon: MessageSquare },
    { name: "Availability", icon: Sliders },
    { name: "Team", icon: UserPlus },
    { name: "Analytics", icon: BarChart3 },
    { name: "Integrations", icon: Layers },
    { name: "API & Webhooks", icon: Code2 },
    { name: "Billing", icon: Receipt },
    { name: "Security", icon: ShieldCheck },
    { name: "Settings", icon: Settings },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setAiChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
    const userMsg = chatInput;
    setChatInput("");
    
    setTimeout(() => {
      let reply = "I am processing your request using Groq LPU engine. Your availability has been dynamically updated across all calendars.";
      if (userMsg.toLowerCase().includes("reschedule")) {
        reply = "I've analyzed Dr. Sarah's availability. I can move the 3:00 PM session to tomorrow at 10:00 AM EST. Shall I dispatch the SMS confirmation?";
      } else if (userMsg.toLowerCase().includes("revenue")) {
        reply = "Your projected revenue for July 2026 is $14,250 USD, up 24% compared to June.";
      }
      setAiChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }, 600);
  };

  return (
    <div className="flex h-screen bg-[#050816] text-slate-100 overflow-hidden font-sans">
      
      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#090d20]/90 backdrop-blur-xl border-r border-slate-800/60
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* BRAND HEADER */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-blue-600/30">
              B
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              BookFlow <span className="text-blue-500">AI</span>
            </span>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKSPACE SWITCHER */}
        <div className="p-3">
          <button className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between hover:border-slate-700 transition-all text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                US
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Acme Inc (US East)</p>
                <p className="text-[10px] text-slate-400 truncate">Enterprise Plan</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" 
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* FOOTER USER CARD */}
        <div className="p-3 border-t border-slate-800/60 bg-[#070a1a]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
                MP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Mantu Patra</p>
                <p className="text-[10px] text-slate-400 truncate">mantu@bookflow.ai</p>
              </div>
            </div>
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-16 bg-[#090d20]/80 backdrop-blur-xl border-b border-slate-800/60 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* SEARCH BAR */}
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search appointments, customers, pages... (⌘K)"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Floating Button Trigger */}
            <button 
              onClick={() => setShowAiFloating(!showAiFloating)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            </button>

            {/* Live US EST Status Badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>US EST Timezone</span>
            </div>
          </div>
        </header>

        {/* DYNAMIC DASHBOARD BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "Dashboard" && <DashboardView setActiveTab={setActiveTab} />}
              {activeTab === "Calendar" && <CalendarView />}
              {activeTab === "Appointments" && <AppointmentsView />}
              {activeTab === "Booking Pages" && <BookingPagesView />}
              {activeTab === "Customers" && <CustomersView />}
              {activeTab === "Payments" && <PaymentsView />}
              {activeTab === "AI Assistant" && <AiAssistantView messages={aiChatMessages} onSend={handleSendMessage} input={chatInput} setInput={setChatInput} />}
              {activeTab === "SMS & Email" && <SmsEmailView />}
              {activeTab === "Availability" && <AvailabilityView />}
              {activeTab === "Team" && <TeamView />}
              {activeTab === "Analytics" && <AnalyticsView />}
              {activeTab === "Integrations" && <IntegrationsView />}
              {activeTab === "API & Webhooks" && <ApiWebhooksView />}
              {activeTab === "Billing" && <BillingView />}
              {activeTab === "Security" && <SecurityView />}
              {activeTab === "Settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* FLOATING AI COPILOT DRAWER */}
      {showAiFloating && (
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed bottom-6 right-6 w-96 h-[520px] bg-[#090d20]/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-xs tracking-wide uppercase">BookFlow AI Copilot</h3>
            </div>
            <button onClick={() => setShowAiFloating(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 text-xs">
            {aiChatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-200"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Groq AI to reschedule, query stats..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}

    </div>
  );
}

/* ==========================================================================
   MODULE 1: DASHBOARD VIEW
   ========================================================================== */
function DashboardView({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border border-slate-800/80 bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Real-Time Groq AI Optimizer Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient">Mantu Patra</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Your AI Scheduling pipeline is performing 34% better than last week. 12 appointments booked today across US EST timezone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveTab("Booking Pages")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Booking Page
            </button>
            <button 
              onClick={() => setActiveTab("Integrations")}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs px-5 py-3 rounded-xl transition-all"
            >
              Connect Calendar
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { title: "Today's Calls", val: "12", change: "+18%", positive: true },
          { title: "Revenue Today", val: "$1,850.00", change: "+32%", positive: true },
          { title: "Upcoming Meetings", val: "48", change: "+8%", positive: true },
          { title: "No-Show Rate", val: "1.2%", change: "-4.1%", positive: true },
          { title: "SMS Reminders", val: "142", change: "+100%", positive: true },
          { title: "Conversion Rate", val: "42.8%", change: "+5.4%", positive: true }
        ].map((card, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl glass-panel-hover">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">{card.val}</h3>
            <div className="flex items-center gap-1 mt-2">
              {card.positive ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className={`text-xs font-bold ${card.positive ? "text-emerald-400" : "text-rose-400"}`}>
                {card.change}
              </span>
              <span className="text-[10px] text-slate-500">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN ANALYTICS CHART & AI SUGGESTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE & BOOKINGS SIMULATED CHART */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Booking & Revenue Velocity</h3>
              <p className="text-xs text-slate-400">Real-time telemetry aggregated from US clients</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold">
              <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">Revenue</button>
              <button className="px-3 py-1 rounded-lg text-slate-400 hover:text-white">Bookings</button>
            </div>
          </div>

          {/* VISUAL CHART BAR MOCK */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-2 border-b border-slate-800/80 pb-4">
            {[40, 65, 45, 80, 95, 70, 85, 100, 75, 90, 110, 125].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  style={{ height: `${h}px` }} 
                  className="w-full bg-gradient-to-t from-blue-600/40 to-blue-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all cursor-pointer relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-800 transition-opacity whitespace-nowrap z-20">
                    ${h * 20} USD
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">Jul {i + 15}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI SUGGESTIONS PANEL */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Groq AI Telemetry</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
                <p className="font-bold text-blue-300">💡 Buffer Optimization Recommended</p>
                <p className="text-slate-400">Adding a 15-min buffer on Thursdays reduces fatigue and increases close rates by 14%.</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                <p className="font-bold text-purple-300">⚡ SMS Speed-to-Lead Triggered</p>
                <p className="text-slate-400">Automated SMS dispatched to +1 (555) 019-2834 generated instant confirmation.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("AI Assistant")}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Open AI Copilot Console</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* UPCOMING MEETINGS DATA TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Upcoming Confirmed Meetings</h3>
            <p className="text-xs text-slate-400">Live sync with Google Calendar & Stripe Payments</p>
          </div>
          <button 
            onClick={() => setActiveTab("Appointments")}
            className="text-xs font-bold text-blue-400 hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {[
                { name: "John Doe", email: "john@techcorp.com", service: "Paid Strategy Session", time: "Today, 3:00 PM EST", status: "CONFIRMED", amount: "$150.00" },
                { name: "Sarah Connor", email: "sarah@cyberdyne.io", service: "15-Min Consultation", time: "Today, 4:30 PM EST", status: "CONFIRMED", amount: "Free" },
                { name: "Michael Scott", email: "m.scott@dundermifflin.com", service: "Executive Coaching", time: "Tomorrow, 10:00 AM EST", status: "PENDING", amount: "$300.00" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{row.name}</p>
                    <p className="text-[10px] text-slate-500">{row.email}</p>
                  </td>
                  <td className="p-4">{row.service}</td>
                  <td className="p-4">{row.time}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${row.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">{row.amount}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 2: CALENDAR VIEW
   ========================================================================== */
function CalendarView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Calendar Engine</h1>
          <p className="text-xs text-slate-400">Multi-calendar two-way synchronization active (EST Timezone)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold flex">
            <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">Month</button>
            <button className="px-3 py-1 rounded-lg text-slate-400 hover:text-white">Week</button>
            <button className="px-3 py-1 rounded-lg text-slate-400 hover:text-white">Day</button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-4 pb-2 border-b border-slate-800">
          <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-xs">
          {[...Array(31)].map((_, i) => (
            <div key={i} className={`min-h-[90px] p-2 rounded-2xl border ${i + 1 === 28 ? "border-blue-500 bg-blue-600/10" : "border-slate-800/60 bg-slate-950/40"} flex flex-col justify-between`}>
              <span className={`font-bold ${i + 1 === 28 ? "text-blue-400" : "text-slate-400"}`}>{i + 1}</span>
              {i % 4 === 0 && (
                <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 font-bold truncate">
                  Strategy Call ($150)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 3: APPOINTMENTS VIEW
   ========================================================================== */
function AppointmentsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Appointments Database</h1>
          <p className="text-xs text-slate-400">Search, filter, and export full client meeting records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800/80 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by client name, email, or meeting ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>
          <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="p-4">Meeting ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {[
                { id: "BK-8801", name: "Fatima Sy", email: "fatima@domain.com", type: "45 Min Paid Strategy", date: "July 28, 2026", status: "CONFIRMED", amount: "$150.00" },
                { id: "BK-8802", name: "David Miller", email: "david@law.com", type: "15 Min Legal Intro", date: "July 29, 2026", status: "COMPLETED", amount: "Free" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/50">
                  <td className="p-4 font-mono font-bold text-blue-400">{row.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{row.name}</p>
                    <p className="text-[10px] text-slate-500">{row.email}</p>
                  </td>
                  <td className="p-4">{row.type}</td>
                  <td className="p-4">{row.date}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-white">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 4: BOOKING PAGES VIEW
   ========================================================================== */
function BookingPagesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Booking Pages</h1>
          <p className="text-xs text-slate-400">Manage high-converting scheduling links and payment pages</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Booking Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "45-Min Executive Strategy Call", price: "$150 USD", link: "bookflow.ai/mantu/strategy", views: "1,240 views", active: true },
          { title: "15-Min Free Consultation Call", price: "Free", link: "bookflow.ai/mantu/consult", views: "3,890 views", active: true },
          { title: "Personal Training Session", price: "$75 USD", link: "bookflow.ai/mantu/pt", views: "510 views", active: false }
        ].map((card, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${card.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"}`}>
                  {card.active ? "ACTIVE" : "PAUSED"}
                </span>
                <span className="text-xs font-bold text-white">{card.price}</span>
              </div>
              <h3 className="font-bold text-white text-base mb-1">{card.title}</h3>
              <p className="text-xs font-mono text-blue-400">{card.link}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">{card.views}</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 5: CUSTOMERS (CRM) VIEW
   ========================================================================== */
function CustomersView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Client CRM Database</h1>
          <p className="text-xs text-slate-400">Total customer lifetime value and booking interaction history</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "John Doe", email: "john@techcorp.com", calls: 4, spent: "$600.00", tag: "VIP Client" },
            { name: "Sarah Connor", email: "sarah@cyberdyne.io", calls: 2, spent: "$150.00", tag: "Standard" }
          ].map((client, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {client.name.substring(0, 2)}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {client.tag}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{client.name}</h4>
                <p className="text-xs text-slate-400">{client.email}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold">
                <span className="text-slate-500">{client.calls} Total Calls</span>
                <span className="text-emerald-400">{client.spent} LTV</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 6: PAYMENTS VIEW
   ========================================================================== */
function PaymentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Stripe Payments & Escrow</h1>
          <p className="text-xs text-slate-400">Processed session payouts, escrow deposits, and invoice telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Gross Volume</p>
          <h2 className="text-3xl font-extrabold text-white mt-2">$18,450.00</h2>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Available Payout</p>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">$4,120.00</h2>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Pending Escrow</p>
          <h2 className="text-3xl font-extrabold text-purple-400 mt-2">$1,250.00</h2>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 7: AI ASSISTANT VIEW
   ========================================================================== */
function AiAssistantView({ messages, onSend, input, setInput }: any) {
  return (
    <div className="h-[calc(100vh-140px)] glass-panel rounded-3xl border border-slate-800/80 flex flex-col overflow-hidden">
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Groq LPU Conversational Scheduler</h3>
            <p className="text-[10px] text-emerald-400 font-bold">● Active 250 Tokens/Sec Response Rate</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
        {messages.map((m: any, idx: number) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-4 rounded-2xl ${m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-200"}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <input 
          type="text" 
          placeholder="Ask AI to reschedule appointments, check conflicts, or optimize calendar..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2">
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

/* ==========================================================================
   MODULE 8: SMS & EMAIL CAMPAIGNS VIEW
   ========================================================================== */
function SmsEmailView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Automated Speed-To-Lead Messaging</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm">SMS Notification Gateway</h3>
          <p className="text-xs text-slate-400">Dispatched under custom [BookFlow AI] sender ID at zero cost per message.</p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400">
            &quot;Hi John! Your Strategy Call with Mantu Patra is confirmed for 3:00 PM EST. Zoom Link: https://zoom.us/j/9901&quot;
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 9: AVAILABILITY VIEW
   ========================================================================== */
function AvailabilityView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Working Hours & Buffer Settings</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-2xl space-y-4">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="font-bold text-white">{day}</span>
            <span className="text-slate-400 font-mono">09:00 AM EST - 05:00 PM EST</span>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 10: TEAM ROUTING VIEW
   ========================================================================== */
function TeamView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Team Members & Round-Robin Routing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "Dr. Sarah Jenkins", role: "Medical Consultant", leads: 42 },
          { name: "Alex Rivera", role: "Senior Sales Lead", leads: 88 }
        ].map((m, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">{m.name}</h4>
            <p className="text-xs text-slate-400">{m.role}</p>
            <p className="text-xs text-blue-400 font-bold">{m.leads} Leads Assigned</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 11: ANALYTICS VIEW
   ========================================================================== */
function AnalyticsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Conversion & Traffic Analytics</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <p className="text-xs text-slate-400">Total Monthly Traffic Conversion Rate: <span className="text-emerald-400 font-bold">42.8%</span></p>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 12: INTEGRATIONS VIEW
   ========================================================================== */
function IntegrationsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Enterprise Integrations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { name: "Google Calendar", desc: "Two-way live event sync", connected: true },
          { name: "Zoom Video", desc: "Instant class meeting link generation", connected: true },
          { name: "Stripe Payments", desc: "Escrow checkout & paid booking", connected: true },
          { name: "Microsoft Outlook", desc: "Exchange calendar connector", connected: false },
          { name: "Twilio Gateway", desc: "Speed-to-lead SMS triggers", connected: true }
        ].map((card, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 glass-panel-hover">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">{card.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${card.connected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"}`}>
                {card.connected ? "CONNECTED" : "DISCONNECTED"}
              </span>
            </div>
            <p className="text-xs text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 13: API & WEBHOOKS VIEW
   ========================================================================== */
function ApiWebhooksView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Developer API Keys & Webhooks</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-2xl space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase">Live Secret API Key</label>
        <div className="flex gap-2">
          <input type="password" value="bk_live_99201920192019201" readOnly className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-300" />
          <button className="bg-blue-600 text-white text-xs font-bold px-4 rounded-xl">Copy</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 14: BILLING VIEW
   ========================================================================== */
function BillingView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Subscription Billing & Usage</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white">Enterprise Tier ($49/mo)</h3>
            <p className="text-xs text-slate-400">Renews on August 28, 2026</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Active</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 15: SECURITY VIEW
   ========================================================================== */
function SecurityView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Security & HIPAA Audit Log</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 max-w-2xl">
        <div className="flex justify-between items-center text-xs p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span>256-bit AES HIPAA Shield</span>
          <span className="text-emerald-400 font-bold">ACTIVE</span>
        </div>
        <div className="flex justify-between items-center text-xs p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span>Two-Factor Authentication (2FA)</span>
          <span className="text-emerald-400 font-bold">ENABLED</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE 16: SETTINGS VIEW
   ========================================================================== */
function SettingsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Workspace Configuration</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-2xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company Name</label>
          <input type="text" defaultValue="Acme Corporation US" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
        </div>
      </div>
    </div>
  );
}
