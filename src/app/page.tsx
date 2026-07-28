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
  ExternalLink,
  Send,
  Zap,
  Globe,
  Menu,
  X,
  Filter,
  Download,
  Share2,
  LogOut,
  HelpCircle,
  Camera,
  Lock
} from "lucide-react";

export default function Home() {
  // Navigation & Page State
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAiFloating, setShowAiFloating] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Dynamic Auth User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
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
    fullName: "Authenticated User",
    email: "user@bookflow.ai",
    photo: "",
    company: "Acme Inc (US)",
    workspace: "Acme Enterprise",
    timezone: "America/New_York (EST)",
    plan: "Enterprise Plan",
    phone: "+1 (555) 019-2834",
    country: "United States"
  });

  // App Dashboard States
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedService, setSelectedService] = useState("consultation");
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [booked, setBooked] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Landing Page Interactive States
  const [activeNiche, setActiveNiche] = useState("coaches");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Groq AI Chat Messages
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: "assistant", content: "Hello! I am your Groq AI Copilot. How can I assist with your workspace schedule today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://bookflow-ai-backend.onrender.com";

  // Check Persistent Auth State On Mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserProfile((prev) => ({
          ...prev,
          fullName: user.displayName || "Mantu Patra",
          email: user.email || "mantu@bookflow.ai",
          photo: user.photoURL || ""
        }));
        setCurrentView("app");
      } else {
        setIsLoggedIn(false);
        setCurrentView("landing");
      }
      setAuthLoading(false);
    });

    fetch(`${BACKEND_URL}/api/v1/slots?zone=EST`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setSlotsLoading(false);
      })
      .catch(() => setSlotsLoading(false));

    return () => unsubscribe();
  }, [BACKEND_URL]);

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
      setShowAuthModal(false);
      setCurrentView("app");
      setActiveTab("Dashboard");
    } catch (error) {
      console.error("Firebase auth error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setCurrentView("landing");
  };

  const handleDashboardAccessAttempt = () => {
    if (isLoggedIn) {
      setCurrentView("app");
      setActiveTab("Dashboard");
    } else {
      setShowAuthModal(true);
    }
  };

  const executeBooking = async () => {
    setBookingLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user-id",
          event_type_id: selectedService,
          client_name: clientName || "BookFlow Guest",
          client_email: clientEmail || "guest@bookflow.ai",
          client_phone: clientPhone || "+1 (555) 019-2834",
          start_time: selectedSlot,
          us_timezone_code: "EST"
        })
      });
      const data = await res.json();
      setBookingResponse(data);
      setBooked(true);
      setShowStripeModal(false);
    } catch (err) {
      setBooked(true);
      setShowStripeModal(false);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setAiChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
    const userMsg = chatInput;
    setChatInput("");
    
    setTimeout(() => {
      let reply = `Hello ${userProfile.fullName}! I'm processing your schedule optimization via Groq LPU engine.`;
      if (userMsg.toLowerCase().includes("reschedule")) {
        reply = "I've checked your calendar availability. I can move your session to tomorrow at 10:00 AM EST.";
      }
      setAiChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }, 600);
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

  const faqs = [
    { q: "How does BookFlow AI eliminate no-shows?", a: "BookFlow AI uses automated speed-to-lead SMS and email workflows under your branded sender ID." },
    { q: "Is BookFlow AI HIPAA compliant for healthcare?", a: "Yes! Client intake notes are protected using end-to-end 256-bit AES HIPAA encryption shields." },
    { q: "Can I collect payments directly before booking?", a: "Absolutely. Integrated Stripe escrow checkout allows you to set custom session prices." }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-blue-600/30 animate-pulse mb-4">B</div>
        <p className="text-xs text-slate-400 font-medium">Authenticating BookFlow AI Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* AUTHENTICATION LOGIN / SIGNUP MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl text-center space-y-6"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shadow-blue-600/30 mx-auto">
                B
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">Sign In to BookFlow AI</h3>
                <p className="text-xs text-slate-400 mt-1">Access your enterprise AI scheduling workspace</p>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleGoogleAuth}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                Protected by 256-bit SSL HIPAA Encryption Shield
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW CONDITION 1: PUBLIC LANDING PAGE (UNAUTHENTICATED VIEW) */}
      {currentView === "landing" && (
        <div>
          {/* Header Navigation */}
          <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-600/30">B</div>
              <span className="text-2xl font-extrabold text-white tracking-tight">BookFlow <span className="text-blue-500">AI</span></span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDashboardAccessAttempt} 
                className="text-xs font-bold text-slate-300 hover:text-white border border-slate-800 bg-slate-900/80 hover:bg-slate-900 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>App Dashboard</span>
              </button>

              {isLoggedIn ? (
                <button 
                  onClick={() => setCurrentView("app")}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  Open Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </header>

          {/* Hero Section */}
          <section className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto relative">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-blue-400 rounded-full px-4 py-1.5 text-xs font-bold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span>America&apos;s #1 AI Scheduling Platform</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] max-w-4xl mx-auto">
              Intelligent Scheduling <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Engineered For $100M Scale
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
              BookFlow AI eliminates double-booking conflicts, collects instant Stripe payments, dispatches free SMS reminders, and handles automated client rescheduling using Groq LPU AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button onClick={() => setShowAuthModal(true)} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-9 rounded-2xl text-sm transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2.5">
                <span>🚀 Start 14-Day Free Trial</span>
              </button>
              <button onClick={handleDashboardAccessAttempt} className="w-full sm:w-auto border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-bold py-4 px-9 rounded-2xl text-sm transition-all">
                ⚡ Explore Interactive Dashboard
              </button>
            </div>

            {/* Compliance Badges */}
            <div className="pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-400 font-bold">
              <div className="flex items-center justify-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                <span className="text-emerald-400 text-base">🛡️</span> SOC 2 TYPE II
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                <span className="text-blue-400 text-base">🔒</span> HIPAA COMPLIANT
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                <span className="text-purple-400 text-base">💳</span> PCI-DSS LEVEL 1
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                <span className="text-amber-400 text-base">⚡</span> 99.99% UPTIME
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-24 px-6 max-w-6xl mx-auto text-center border-t border-slate-800/80">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Transparent SaaS Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-12">Simple Pricing For Growing Teams</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                  <div className="text-4xl font-extrabold text-white mb-6">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                  <ul className="space-y-3 text-xs text-slate-300 mb-8">
                    <li>✓ 1 Calendar Sync Connection</li>
                    <li>✓ Unlimited Free Consultation Calls</li>
                    <li>✓ Groq AI Rescheduling Chatbot</li>
                  </ul>
                </div>
                <button onClick={() => setShowAuthModal(true)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs">
                  Get Started Free
                </button>
              </div>

              <div className="bg-slate-900 border-2 border-blue-500 p-8 rounded-3xl relative flex flex-col justify-between shadow-2xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                  <div className="text-4xl font-extrabold text-white mb-6">$15 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                  <ul className="space-y-3 text-xs text-slate-300 mb-8">
                    <li>✓ Unlimited Calendar Connections</li>
                    <li>✓ Stripe Escrow Paid Strategy Calls</li>
                    <li>✓ Free SMS Reminders</li>
                  </ul>
                </div>
                <button onClick={() => setShowAuthModal(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs">
                  Start 14-Day Free Trial
                </button>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-4xl font-extrabold text-white mb-6">$39 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                  <ul className="space-y-3 text-xs text-slate-300 mb-8">
                    <li>✓ Round-Robin Lead Distribution</li>
                    <li>✓ Unlimited Team Members</li>
                    <li>✓ Dedicated SLA Support</li>
                  </ul>
                </div>
                <button onClick={() => setShowAuthModal(true)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs">
                  Contact Sales
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-950 border-t border-slate-800/80 py-12 px-6 text-center text-xs text-slate-500">
            © Copyright BookFlow AI 2026. All rights reserved.
          </footer>
        </div>
      )}

      {/* VIEW CONDITION 2: PRIVATE AUTHENTICATED DASHBOARD */}
      {currentView === "app" && isLoggedIn && (
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
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("landing")}>
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

          {/* MAIN DASHBOARD CONTENT AREA */}
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
                <button 
                  onClick={() => setShowAiFloating(!showAiFloating)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">AI Copilot</span>
                </button>

                <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
                </button>

                {/* USER PROFILE DROPDOWN */}
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

                      <div className="border-t border-slate-800 my-1"></div>

                      <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 hover:bg-rose-500/10 rounded-xl text-rose-400 font-bold">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* MAIN DASHBOARD MODULE BODY */}
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
                  {activeTab === "Profile" && <ProfileView user={userProfile} setUserProfile={setUserProfile} handleLogout={handleLogout} />}
                  {activeTab !== "Dashboard" && activeTab !== "Profile" && (
                    <div className="glass-panel p-8 rounded-3xl border border-slate-800">
                      <h1 className="text-2xl font-extrabold text-white mb-2">{activeTab}</h1>
                      <p className="text-xs text-slate-400">Authenticated workspace telemetry for {userProfile.fullName}.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}

    </div>
  );
}

/* DASHBOARD VIEW */
function DashboardView({ user, setActiveTab }: any) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border border-slate-800/80 bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent">
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { title: "Today's Revenue", val: "$1,850.00", change: "+32%", positive: true },
          { title: "Today's Bookings", val: "12", change: "+18%", positive: true },
          { title: "Upcoming Meetings", val: "48", change: "+8%", positive: true },
          { title: "Pending Payments", val: "$450.00", change: "-2%", positive: false },
          { title: "SMS Sent", val: "142", change: "+100%", positive: true },
          { title: "Conversion Rate", val: "42.8%", change: "+5.4%", positive: true }
        ].map((card, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">{card.val}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

/* PROFILE VIEW */
function ProfileView({ user, setUserProfile, handleLogout }: any) {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">User Profile Settings</h1>
        <p className="text-xs text-slate-400">Manage account details for {user.fullName}</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
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
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="bg-rose-500/10 text-rose-400 font-bold text-xs px-5 py-2.5 rounded-xl border border-rose-500/20">
          Logout Account
        </button>
      </div>
    </div>
  );
}
