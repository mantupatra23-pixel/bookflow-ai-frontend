"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
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
  UserCheck,
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
  QrCode,
  LogOut,
  HelpCircle,
  ShieldAlert,
  Camera
} from "lucide-react";

export default function BookFlowDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAiFloating, setShowAiFloating] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dynamic Auth User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    email: string;
    photo: string;
    company: string;
    workspace: string;
    timezone: string;
    plan: string;
    phone: string;
    country: string;
  }>({
    fullName: "Mantu Patra",
    email: "mantu@bookflow.ai",
    photo: "",
    company: "Acme Inc (US)",
    workspace: "Acme Enterprise",
    timezone: "America/New_York (EST)",
    plan: "Enterprise Plan",
    phone: "+1 (555) 019-2834",
    country: "United States"
  });

  const [aiChatMessages, setAiChatMessages] = useState([
    { role: "assistant", content: "Hello! I am your Groq AI Copilot. How can I assist with your workspace schedule today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserProfile((prev) => ({
          ...prev,
          fullName: user.displayName || prev.fullName,
          email: user.email || prev.email,
          photo: user.photoURL || prev.photo
        }));
        setActiveTab("Dashboard");
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUserProfile((prev) => ({
        ...prev,
        fullName: result.user.displayName || "Authenticated User",
        email: result.user.email || "user@bookflow.ai",
        photo: result.user.photoURL || ""
      }));
      setIsLoggedIn(true);
      setActiveTab("Dashboard");
    } catch (error) {
      console.error("Firebase auth error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setShowUserMenu(false);
  };

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
    { name: "Profile", icon: UserCheck },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setAiChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
    const userMsg = chatInput;
    setChatInput("");
    
    setTimeout(() => {
      let reply = `Hello ${userProfile.fullName}! Processing your request using Groq LPU engine.`;
      if (userMsg.toLowerCase().includes("reschedule")) {
        reply = "I've analyzed your schedule. I can adjust your slots to tomorrow at 10:00 AM EST and dispatch SMS updates.";
      } else if (userMsg.toLowerCase().includes("revenue")) {
        reply = "Your projected revenue for this month is up 32% across your workspace.";
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
                {userProfile.company.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{userProfile.company}</p>
                <p className="text-[10px] text-slate-400 truncate">{userProfile.plan}</p>
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
              {userProfile.photo ? (
                <img src={userProfile.photo} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
                  {userProfile.fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{userProfile.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
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
                placeholder="Search appointments, customers... (⌘K)"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Copilot Button */}
            <button 
              onClick={() => setShowAiFloating(!showAiFloating)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </button>

            {/* AUTH / USER DROPDOWN MENU */}
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  {userProfile.photo ? (
                    <img src={userProfile.photo} className="w-6 h-6 rounded-full" alt="profile" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                      {userProfile.fullName.substring(0, 1)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-white hidden md:inline">{userProfile.fullName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                    <div className="p-2 border-b border-slate-800 mb-1">
                      <p className="font-bold text-white">{userProfile.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                    </div>

                    <button onClick={() => { setActiveTab("Profile"); setShowUserMenu(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl text-slate-300">
                      <UserCheck className="w-4 h-4 text-blue-400" /> Profile
                    </button>
                    <button onClick={() => { setActiveTab("Settings"); setShowUserMenu(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl text-slate-300">
                      <Globe className="w-4 h-4 text-purple-400" /> Workspace
                    </button>
                    <button onClick={() => { setActiveTab("Billing"); setShowUserMenu(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl text-slate-300">
                      <Receipt className="w-4 h-4 text-emerald-400" /> Billing
                    </button>
                    <button onClick={() => { setActiveTab("Settings"); setShowUserMenu(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl text-slate-300">
                      <Settings className="w-4 h-4 text-amber-400" /> Settings
                    </button>
                    <button onClick={() => { setActiveTab("AI Assistant"); setShowUserMenu(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl text-slate-300">
                      <HelpCircle className="w-4 h-4 text-indigo-400" /> Help Center
                    </button>

                    <div className="border-t border-slate-800 my-1"></div>

                    <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 hover:bg-rose-500/10 rounded-xl text-rose-400 font-bold">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleGoogleAuth}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Sign In with Google
              </button>
            )}
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
              {activeTab === "Dashboard" && <DashboardView user={userProfile} setActiveTab={setActiveTab} />}
              {activeTab === "Calendar" && <CalendarView />}
              {activeTab === "Appointments" && <AppointmentsView />}
              {activeTab === "Booking Pages" && <BookingPagesView />}
              {activeTab === "Customers" && <CustomersView />}
              {activeTab === "Payments" && <PaymentsView />}
              {activeTab === "AI Assistant" && <AiAssistantView user={userProfile} messages={aiChatMessages} onSend={handleSendMessage} input={chatInput} setInput={setChatInput} />}
              {activeTab === "SMS & Email" && <SmsEmailView />}
              {activeTab === "Availability" && <AvailabilityView />}
              {activeTab === "Team" && <TeamView />}
              {activeTab === "Analytics" && <AnalyticsView />}
              {activeTab === "Integrations" && <IntegrationsView />}
              {activeTab === "API & Webhooks" && <ApiWebhooksView />}
              {activeTab === "Billing" && <BillingView />}
              {activeTab === "Security" && <SecurityView />}
              {activeTab === "Settings" && <SettingsView user={userProfile} />}
              {activeTab === "Profile" && <ProfileView user={userProfile} setUserProfile={setUserProfile} handleLogout={handleLogout} />}
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
function DashboardView({ user, setActiveTab }: any) {
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
              Welcome back, <span className="text-gradient">{user.fullName}</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Your AI Scheduling Business is Growing. 12 appointments booked today across {user.timezone}.
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
          { title: "Today's Revenue", val: "$1,850.00", change: "+32%", positive: true },
          { title: "Today's Bookings", val: "12", change: "+18%", positive: true },
          { title: "Upcoming Meetings", val: "48", change: "+8%", positive: true },
          { title: "Pending Payments", val: "$450.00", change: "-2%", positive: false },
          { title: "SMS Sent", val: "142", change: "+100%", positive: true },
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

      {/* MAIN ANALYTICS CHART & AI RECOMMENDATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue & Booking Telemetry</h3>
              <p className="text-xs text-slate-400">Real-time stats synced for {user.company}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold">
              <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">Revenue</button>
              <button className="px-3 py-1 rounded-lg text-slate-400 hover:text-white">Appointments</button>
            </div>
          </div>

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

        {/* AI RECOMMENDATIONS */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
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

      {/* UPCOMING MEETINGS TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Upcoming Confirmed Meetings</h3>
            <p className="text-xs text-slate-400">Live sync with Google Calendar & Stripe Payments</p>
          </div>
          <button onClick={() => setActiveTab("Appointments")} className="text-xs font-bold text-blue-400 hover:underline">
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
                { name: "Sarah Connor", email: "sarah@cyberdyne.io", service: "15-Min Consultation", time: "Today, 4:30 PM EST", status: "CONFIRMED", amount: "Free" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{row.name}</p>
                    <p className="text-[10px] text-slate-500">{row.email}</p>
                  </td>
                  <td className="p-4">{row.service}</td>
                  <td className="p-4">{row.time}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
   MODULE: PROFILE PAGE
   ========================================================================== */
function ProfileView({ user, setUserProfile, handleLogout }: any) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    company: user.company,
    country: user.country,
    timezone: user.timezone
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev: any) => ({
      ...prev,
      ...formData
    }));
    alert("Profile settings saved successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">User Profile Settings</h1>
        <p className="text-xs text-slate-400">Manage your account profile details and authentication credentials</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        {/* AVATAR SECTION */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
          {user.photo ? (
            <img src={user.photo} className="w-20 h-20 rounded-full border-2 border-blue-500" alt="avatar" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl">
              {user.fullName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-white text-base">{user.fullName}</h3>
            <p className="text-xs text-slate-400 mb-3">{user.email}</p>
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl text-slate-300 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" /> Change Photo
            </button>
          </div>
        </div>

        {/* PROFILE FORM */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Company / Workspace</label>
              <input 
                type="text" 
                value={formData.company} 
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Country</label>
              <input 
                type="text" 
                value={formData.country} 
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Timezone</label>
              <input 
                type="text" 
                value={formData.timezone} 
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={handleLogout} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs px-5 py-2.5 rounded-xl border border-rose-500/20">
              Logout Account
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE REUSE STUBS FOR FULL COMPATIBILITY
   ========================================================================== */
function CalendarView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Calendar Engine</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs">Multi-calendar two-way synchronization active.</div>
    </div>
  );
}
function AppointmentsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Appointments Database</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs">Manage appointment records and history.</div>
    </div>
  );
}
function BookingPagesView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Booking Pages</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs">Manage scheduling landing pages.</div>
    </div>
  );
}
function CustomersView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Client CRM Database</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs">View customer activity and booking telemetry.</div>
    </div>
  );
}
function PaymentsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Stripe Payments & Escrow</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs">Payment payouts and gross volume.</div>
    </div>
  );
}
function AiAssistantView({ user, messages, onSend, input, setInput }: any) {
  return (
    <div className="h-[calc(100vh-140px)] glass-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
      <div className="p-4 bg-slate-900 border-b border-slate-800 font-bold text-xs text-white">Groq AI Copilot for {user.fullName}</div>
      <div className="flex-1 p-6 overflow-y-auto space-y-3 text-xs">
        {messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-xl max-w-[80%] ${m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-200"}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={onSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask AI..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Send</button>
      </form>
    </div>
  );
}
function SmsEmailView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">SMS & Email Campaigns</div>; }
function AvailabilityView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Working Hours & Availability</div>; }
function TeamView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Team Members & Round Robin</div>; }
function AnalyticsView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Analytics Dashboard</div>; }
function IntegrationsView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Integrations Matrix</div>; }
function ApiWebhooksView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">API Keys & Webhooks</div>; }
function BillingView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Billing & Invoices</div>; }
function SecurityView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Security & Audit Logs</div>; }
function SettingsView({ user }: any) { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Settings for {user.company}</div>; }
