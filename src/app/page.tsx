"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Lock,
  CheckCircle2,
  QrCode,
  Copy,
  Trash2,
  Briefcase,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

export default function Home() {
  // Navigation State
  const [currentView, setCurrentView] = useState<"landing" | "onboarding" | "app">("landing");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAiFloating, setShowAiFloating] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Onboarding Wizard State (Steps 1 to 6)
  const [wizardStep, setWizardStep] = useState(1);
  const [businessType, setBusinessType] = useState("Consultant");
  const [gcalConnected, setGcalConnected] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    businessName: "Acme Enterprise",
    timezone: "America/New_York (EST)",
    meetingDuration: "30 Mins",
    workingHours: "09:00 AM - 05:00 PM EST"
  });

  // Dynamic Auth User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
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

  // Booking Page Modal States
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  // AI Chat Messages
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: "assistant", content: "Hello! I am your Groq AI Copilot. How can I assist with your workspace schedule today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://bookflow-ai-backend.onrender.com";

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
      } else {
        setIsLoggedIn(false);
        setCurrentView("landing");
      }
      setAuthLoading(false);
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
      setShowAuthModal(false);
      
      // Check onboarding state: redirect to Wizard if first time
      setWizardStep(1);
      setCurrentView("onboarding");
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
      let reply = `Hello ${userProfile.fullName}! I'm optimizing your workspace calendar via Groq LPU engine.`;
      if (userMsg.toLowerCase().includes("reschedule")) {
        reply = "I've checked your calendar availability. I can move your session to tomorrow at 10:00 AM EST.";
      }
      setAiChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }, 600);
  };

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

      {/* VIEW CONDITION 1: PUBLIC LANDING PAGE (UNAUTHENTICATED) */}
      {currentView === "landing" && (
        <div>
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
          </section>

          <footer className="bg-slate-950 border-t border-slate-800/80 py-12 px-6 text-center text-xs text-slate-500">
            © Copyright BookFlow AI 2026. All rights reserved.
          </footer>
        </div>
      )}

      {/* VIEW CONDITION 2: FIRST-TIME SETUP ONBOARDING WIZARD */}
      {currentView === "onboarding" && (
        <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl w-full relative shadow-2xl space-y-8">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">B</div>
                <span className="font-extrabold text-white text-sm">Onboarding Wizard</span>
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Step {wizardStep} of 6</span>
            </div>

            {/* STEP 1: WELCOME */}
            {wizardStep === 1 && (
              <div className="space-y-6 text-center">
                <h2 className="text-3xl font-extrabold text-white">Welcome, {userProfile.fullName}! 👋</h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Let&apos;s set up your automated AI scheduling workspace in under 60 seconds.
                </p>
                <button 
                  onClick={() => setWizardStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/20"
                >
                  Continue Setup →
                </button>
              </div>
            )}

            {/* STEP 2: BUSINESS TYPE */}
            {wizardStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-white">Select Your Business Type</h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {["Coach", "Consultant", "Agency", "Clinic", "Salon", "Lawyer", "Real Estate", "Other"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setBusinessType(item)}
                      className={`p-3.5 rounded-xl border text-left font-bold transition-all ${
                        businessType === item ? "border-blue-500 bg-blue-600/10 text-white" : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setWizardStep(3)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs"
                >
                  Next: Calendar Integration →
                </button>
              </div>
            )}

            {/* STEP 3: GOOGLE CALENDAR */}
            {wizardStep === 3 && (
              <div className="space-y-6 text-center">
                <h2 className="text-xl font-extrabold text-white">Connect Google Calendar</h2>
                <p className="text-xs text-slate-400">Sync your calendar slots in real-time to avoid double booking.</p>
                <button 
                  onClick={() => setGcalConnected(true)}
                  className={`w-full p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-3 ${
                    gcalConnected ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-slate-800 bg-slate-950 text-white"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                  <span>{gcalConnected ? "✓ Google Calendar Connected" : "One-Click Connect Google Calendar"}</span>
                </button>
                <button 
                  onClick={() => setWizardStep(4)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs"
                >
                  Next: Connect Stripe →
                </button>
              </div>
            )}

            {/* STEP 4: STRIPE CONNECT */}
            {wizardStep === 4 && (
              <div className="space-y-6 text-center">
                <h2 className="text-xl font-extrabold text-white">Connect Stripe Escrow</h2>
                <p className="text-xs text-slate-400">Collect session deposits and $150 strategy call payments automatically.</p>
                <button 
                  onClick={() => setStripeConnected(true)}
                  className={`w-full p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-3 ${
                    stripeConnected ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-slate-800 bg-slate-950 text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>{stripeConnected ? "✓ Stripe Escrow Connected" : "Connect Stripe Account"}</span>
                </button>
                <button 
                  onClick={() => setWizardStep(5)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs"
                >
                  Next: Workspace Info →
                </button>
              </div>
            )}

            {/* STEP 5: BUSINESS INFO */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-white">Business Information</h2>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Name</label>
                  <input 
                    type="text" 
                    value={onboardingData.businessName}
                    onChange={(e) => setOnboardingData({ ...onboardingData, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Timezone</label>
                  <input 
                    type="text" 
                    value={onboardingData.timezone}
                    onChange={(e) => setOnboardingData({ ...onboardingData, timezone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <button 
                  onClick={() => setWizardStep(6)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs mt-4"
                >
                  Next: Generate Booking Page →
                </button>
              </div>
            )}

            {/* STEP 6: GENERATE BOOKING PAGE */}
            {wizardStep === 6 && (
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-extrabold text-white">🎉 Setup Complete!</h2>
                <p className="text-xs text-slate-400">Your custom AI booking page is live and connected to Groq LPU.</p>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-blue-400">
                  https://bookflow.ai/{userProfile.fullName.toLowerCase().replace(/\s+/g, '')}/consultation
                </div>
                <button 
                  onClick={() => {
                    setCurrentView("app");
                    setActiveTab("Dashboard");
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl text-xs shadow-xl shadow-blue-600/20"
                >
                  Launch App Dashboard 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW CONDITION 3: PRIVATE AUTHENTICATED DASHBOARD WITH ALL PAGES */}
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
                    {onboardingData.businessName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{onboardingData.businessName}</p>
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

            {/* DYNAMIC DASHBOARD PAGES ROUTER */}
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
                  {activeTab === "Booking Pages" && <BookingPagesView setShowQrModal={setShowQrModal} setQrCodeLink={setQrCodeLink} />}
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
        </div>
      )}

      {/* QR CODE MODAL FOR BOOKING PAGES */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Booking Page QR Code</h3>
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>
            <p className="text-xs font-mono text-blue-400 truncate">{qrCodeLink}</p>
            <button onClick={() => setShowQrModal(false)} className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      )}

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
   FRONTEND DASHBOARD PAGES
   ========================================================================== */

/* 1. DASHBOARD PAGE */
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

          <button 
            onClick={() => setActiveTab("Booking Pages")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Booking Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { title: "Today's Revenue", val: "$1,850.00" },
          { title: "Today's Bookings", val: "12" },
          { title: "Upcoming Meetings", val: "48" },
          { title: "Pending Payments", val: "$450.00" },
          { title: "SMS Sent", val: "142" },
          { title: "Conversion Rate", val: "42.8%" }
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

/* 2. CALENDAR PAGE */
function CalendarView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Calendar Engine</h1>
          <p className="text-xs text-slate-400">Month, Week, Day and Agenda view with drag and drop</p>
        </div>
        <div className="flex gap-2 bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs font-bold">
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white">Month</button>
          <button className="px-3 py-1.5 rounded-lg text-slate-400">Week</button>
          <button className="px-3 py-1.5 rounded-lg text-slate-400">Day</button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-4">
          <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-xs">
          {[...Array(31)].map((_, i) => (
            <div key={i} className={`min-h-[80px] p-2 rounded-2xl border ${i + 1 === 28 ? "border-blue-500 bg-blue-600/10" : "border-slate-800 bg-slate-950/40"}`}>
              <span className="font-bold text-slate-400">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3. APPOINTMENTS PAGE */
function AppointmentsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Appointments Database</h1>
          <p className="text-xs text-slate-400">Upcoming, Completed, Cancelled and Rescheduled meetings</p>
        </div>
        <button className="bg-slate-900 border border-slate-800 text-xs font-bold px-4 py-2 rounded-xl text-slate-300 flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 p-4">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Event Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {[
              { name: "John Doe", type: "45 Min Paid Strategy", date: "July 28, 2026", status: "CONFIRMED", amount: "$150.00" },
              { name: "Sarah Connor", type: "15 Min Consultation", date: "July 29, 2026", status: "COMPLETED", amount: "Free" }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-900/50">
                <td className="p-4 font-bold text-white">{row.name}</td>
                <td className="p-4">{row.type}</td>
                <td className="p-4">{row.date}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">{row.status}</span></td>
                <td className="p-4 text-right font-bold text-white">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 4. BOOKING PAGES */
function BookingPagesView({ setShowQrModal, setQrCodeLink }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Booking Pages</h1>
          <p className="text-xs text-slate-400">List, edit, share, and generate QR codes for booking links</p>
        </div>
        <button className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "45-Min Executive Strategy Call", price: "$150 USD", link: "https://bookflow.ai/mantu/strategy" },
          { title: "15-Min Free Consultation Call", price: "Free", link: "https://bookflow.ai/mantu/consult" }
        ].map((card, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">{card.title}</h3>
            <p className="text-xs font-mono text-blue-400 truncate">{card.link}</p>
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => { setQrCodeLink(card.link); setShowQrModal(true); }} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <QrCode className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 5. CUSTOMERS PAGE */
function CustomersView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Customers CRM</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-slate-300">
        Customer LTV profiles, notes, and booking histories.
      </div>
    </div>
  );
}

/* 6. PAYMENTS PAGE */
function PaymentsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Payments & Escrow</h1>
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-slate-300">
        Stripe transactions, refunds, and payout balances.
      </div>
    </div>
  );
}

/* 7. AI ASSISTANT PAGE */
function AiAssistantView({ user, messages, onSend, input, setInput }: any) {
  return (
    <div className="h-[calc(100vh-140px)] glass-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
      <div className="p-4 bg-slate-900 border-b border-slate-800 font-bold text-xs text-white">Groq AI Copilot Console</div>
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

/* 8. SMS & EMAIL */
function SmsEmailView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">SMS & Email Speed-To-Lead Automation</div>; }
/* 9. AVAILABILITY */
function AvailabilityView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Working Hours & Buffer Settings</div>; }
/* 10. TEAM */
function TeamView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Team Members & Round-Robin Routing</div>; }
/* 11. ANALYTICS */
function AnalyticsView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Analytics, Traffic & Conversion Heatmaps</div>; }
/* 12. INTEGRATIONS */
function IntegrationsView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Integrations Matrix (Google Calendar, Zoom, Stripe, Twilio)</div>; }
/* 13. API & WEBHOOKS */
function ApiWebhooksView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">API Keys & Webhooks Logs</div>; }
/* 14. BILLING */
function BillingView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Subscription Plan & Billing History</div>; }
/* 15. SECURITY */
function SecurityView() { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">2FA & HIPAA Encryption Audit Logs</div>; }
/* 16. SETTINGS */
function SettingsView({ user }: any) { return <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs text-white">Workspace Branding & Domain Settings</div>; }

/* 17. PROFILE PAGE */
function ProfileView({ user, setUserProfile, handleLogout }: any) {
  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-extrabold text-white">User Profile Settings</h1>
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl">
            {user.fullName.substring(0, 2).toUpperCase()}
          </div>
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
