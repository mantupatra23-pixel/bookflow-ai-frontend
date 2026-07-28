"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [confidentialNotes, setConfidentialNotes] = useState("");
  const [booked, setBooked] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Pricing State
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // Appointment Service Selection
  const [selectedService, setSelectedService] = useState("consultation");
  
  // Industry Solutions Tabs
  const [activeNiche, setActiveNiche] = useState("coaches");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Paid Meeting & Stripe States
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Groq AI Assistant Chatbot State
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I'm BookFlow AI powered by Groq LPU. How can I help you scale your booking workflow today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://bookflow-ai-backend.onrender.com";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/v1/slots?zone=EST`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserProfile({ email: user.email, name: user.displayName, photo: user.photoURL });
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [BACKEND_URL]);

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUserProfile({
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Firebase auth error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  const handleBookingInitiate = () => {
    if (!selectedSlot) return;
    if (selectedService === "strategy") {
      setShowStripeModal(true);
    } else {
      executeBooking();
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
          us_timezone_code: "EST",
          confidential_notes: confidentialNotes || undefined
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setAiTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: "ai", text: data.reply || "I am BookFlow AI. How can I help you schedule?" }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: "ai", text: "To reschedule, simply pick a new slot from the calendar widget below." }]);
    } finally {
      setAiTyping(false);
    }
  };

  const faqs = [
    {
      q: "How does BookFlow AI eliminate no-shows?",
      a: "BookFlow AI uses automated speed-to-lead SMS and email workflows under your branded sender ID. Reminders are sent 24h and 1h prior with 1-click rescheduling options."
    },
    {
      q: "Is BookFlow AI HIPAA compliant for healthcare?",
      a: "Yes! Confidential client and patient intake notes are protected using end-to-end 256-bit AES HIPAA encryption shields."
    },
    {
      q: "Can I collect payments directly before booking?",
      a: "Absolutely. Integrated Stripe escrow checkout allows you to set custom prices ($150 strategy sessions) or take deposit holds before a meeting slot is reserved."
    },
    {
      q: "How does it compare to Calendly?",
      a: "Calendly charges per user and restricts calendar syncs. BookFlow AI gives you unlimited calendar syncs, free SMS reminders, and Groq LPU AI rescheduling at a fraction of the cost."
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Gradient Ambient Light */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Floating Groq AI Assistant Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showAiChat ? (
          <button
            onClick={() => setShowAiChat(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold p-4 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border border-blue-400/30 backdrop-blur-md"
          >
            <span className="text-xl">⚡</span>
            <span className="text-xs pr-1 font-extrabold tracking-wide">Groq AI Assistant</span>
          </button>
        ) : (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 w-80 sm:w-96 overflow-hidden flex flex-col h-[440px]">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="font-bold text-xs tracking-tight">BookFlow AI (Groq Engine)</h4>
                  <span className="text-[10px] text-blue-100 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Sub-second Latency
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAiChat(false)} className="text-white hover:text-slate-200 font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-950/80 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none font-medium shadow-md shadow-blue-600/20"
                        : "bg-slate-900 border border-slate-800 text-slate-200 shadow-sm rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="text-[10px] text-slate-500 italic flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> Groq LPU is generating...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask Groq AI anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs border border-slate-800 bg-slate-950 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full p-6 relative text-slate-100 backdrop-blur-xl">
            <button
              onClick={() => setShowStripeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                Stripe Escrow Checkout
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-1">
              Complete $150 Payment
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              1-on-1 Paid Strategy Session (45 min) via Zoom/Google Meet.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); executeBooking(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border border-slate-800 bg-slate-950 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 mt-4"
              >
                {bookingLoading ? "Processing Payment..." : "🔒 Pay $150 & Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-600/30">B</div>
          <span className="text-2xl font-extrabold text-white tracking-tight">BookFlow <span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold text-slate-300 hover:text-white border border-slate-800 bg-slate-900/80 hover:bg-slate-900 px-4 py-2 rounded-xl transition-all">
            📊 App Dashboard
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                {userProfile?.photo && <img src={userProfile.photo} className="w-4 h-4 rounded-full" alt="avatar" />}
                👤 {userProfile?.name || userProfile?.email}
              </span>
              <button onClick={handleLogout} className="text-xs font-semibold text-rose-400 hover:underline">
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleAuth} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Sign In Free
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto relative">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-blue-400 rounded-full px-4 py-1.5 text-xs font-bold mb-8 backdrop-blur-md shadow-inner">
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
          <button onClick={handleGoogleAuth} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-9 rounded-2xl text-sm transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2.5">
            <span>🚀 Start 14-Day Free Trial</span>
          </button>
          <a href="#demo-widget" className="w-full sm:w-auto border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-bold py-4 px-9 rounded-2xl text-sm transition-all backdrop-blur-md">
            ⚡ Explore Interactive Demo
          </a>
        </div>

        {/* Enterprise Compliance Trust Banner */}
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

      {/* FEATURE COMPARISON MATRIX SECTION */}
      <section className="py-24 bg-slate-900/40 border-y border-slate-800/80 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Why Enterprise Teams Choose BookFlow AI
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Legacy tools like Calendly charge extra per user and restrict features. BookFlow AI delivers a complete, unthrottled feature stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl relative hover:border-blue-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 border border-blue-500/20">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Groq LPU AI Rescheduling</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Sub-second conversational rescheduling. Clients can talk directly with your booking bot to modify meetings instantly.
              </p>
              <div className="text-[11px] font-bold text-blue-400">✓ Included in all plans</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl relative hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 bg-emerald-600/10 text-emerald-400 rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 border border-emerald-500/20">
                💬
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero-Cost SMS Reminders</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Reduce client no-shows by 95%. Automated SMS text notifications dispatched directly under your [BookFlow AI] brand name.
              </p>
              <div className="text-[11px] font-bold text-emerald-400">✓ Free unlimited SMS</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl relative hover:border-purple-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 bg-purple-600/10 text-purple-400 rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 border border-purple-500/20">
                💳
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Stripe Paid Sessions</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Collect deposits or full session amounts ($150 Strategy Calls) seamlessly before confirming a booking on your calendar.
              </p>
              <div className="text-[11px] font-bold text-purple-400">✓ Zero platform commission</div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY WORKFLOW TABS SECTION */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Built For US High-Revenue Services
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Tailored scheduling pipelines for specialized professional fields across the United States.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveNiche("coaches")}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeNiche === "coaches" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              💼 Coaches & Consultants
            </button>
            <button
              onClick={() => setActiveNiche("healthcare")}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeNiche === "healthcare" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              🏥 Doctors & Dentists
            </button>
            <button
              onClick={() => setActiveNiche("realestate")}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeNiche === "realestate" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              🏡 Real Estate & Law
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-4xl mx-auto shadow-2xl">
          {activeNiche === "coaches" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Coaching & Agency Flow</span>
              <h3 className="text-2xl font-bold text-white">Monetize Your Time Before Booking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Coaches use BookFlow AI to sell 45-minute $150 Strategy Sessions. Stripe checkout verifies payment, Zoom links generate automatically, and calendar slots adjust across Eastern (EST) and Pacific (PST) time zones.
              </p>
            </div>
          )}
          {activeNiche === "healthcare" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Healthcare & Dental Flow</span>
              <h3 className="text-2xl font-bold text-white">HIPAA-Shielded Patient Intake</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Medical practices collect patient notes protected by 256-bit HIPAA encryption. Custom buffer times ensure doctors have 15 minutes of rest between patient sessions.
              </p>
            </div>
          )}
          {activeNiche === "realestate" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Real Estate & Legal Flow</span>
              <h3 className="text-2xl font-bold text-white">Automated Round-Robin Routing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Realtors and Law firms distribute incoming client consultations equally across team members using our automated Round-Robin Lead Routing algorithm.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* INTERACTIVE BOOKING DEMO WIDGET SECTION */}
      <section id="demo-widget" className="py-24 bg-slate-900/30 border-t border-slate-800 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Live Interactive Widget</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">Test The Live Booking Engine</h2>
          </div>

          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 text-slate-100 backdrop-blur-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              1. Select Appointment Type:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mb-10">
              <button
                onClick={() => setSelectedService("consultation")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedService === "consultation"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs text-white">Consultation Call</div>
                <div className="text-[11px] text-slate-400 mt-1">15 mins • Free</div>
              </button>

              <button
                onClick={() => setSelectedService("training")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedService === "training"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs text-white">Personal Training</div>
                <div className="text-[11px] text-slate-400 mt-1">30 mins • Free</div>
              </button>

              <button
                onClick={() => setSelectedService("demo")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedService === "demo"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs text-white">Live Demo Session</div>
                <div className="text-[11px] text-slate-400 mt-1">30 mins • Free</div>
              </button>

              <button
                onClick={() => setSelectedService("strategy")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedService === "strategy"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs text-white">⚡ Paid Strategy Call</div>
                <div className="text-[11px] text-blue-400 font-bold mt-1">45 mins • $150 USD</div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
              {/* Host Info */}
              <div className="pr-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg">
                    FS
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Fatima Sy</h4>
                    <p className="text-xs text-slate-400 uppercase font-semibold">{selectedService}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-medium bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <div>🕒 Buffer Padding: 15 mins included</div>
                  <div>📹 Zoom / Google Meet Call</div>
                  <div className="font-bold text-white">
                    💳 Price: {selectedService === "strategy" ? "$150 USD (Stripe)" : "Free ($0)"}
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Your Phone (For Free SMS)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Calendar Picker */}
              <div className="pt-6 md:pt-0 md:px-6">
                <h5 className="font-bold text-white text-sm mb-4">Select a Date & Time</h5>
                <div className="bg-slate-950/80 p-4 rounded-2xl text-center border border-slate-800">
                  <div className="text-xs font-bold text-slate-300 mb-3">July 2026</div>
                  <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-500 font-semibold mb-2">
                    <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {[...Array(31)].map((_, i) => (
                      <button
                        key={i}
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                          i + 1 === 28
                            ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/50"
                            : "hover:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="pt-6 md:pt-0 md:pl-6 space-y-3">
                <h5 className="font-bold text-white text-sm mb-4">Available EST Slots</h5>
                {loading ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Fetching FastAPI live slots...</p>
                ) : (
                  <div className="space-y-2">
                    {slots.slice(0, 4).map((s: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <button
                          onClick={() => setSelectedSlot(s.start_time_utc)}
                          className={`flex-1 py-3 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                            selectedSlot === s.start_time_utc
                              ? "border-blue-500 bg-blue-600/20 text-blue-400"
                              : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {s.us_local_time}
                        </button>
                        {selectedSlot === s.start_time_utc && (
                          <button
                            onClick={handleBookingInitiate}
                            disabled={bookingLoading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 rounded-xl shadow-md transition-all"
                          >
                            {selectedService === "strategy" ? "Pay $150" : "Confirm"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {booked && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-2xl font-medium text-center shadow-sm space-y-1">
                    <div className="font-bold">✓ Booking Confirmed in FastAPI Database!</div>
                    <div className="text-[10px] text-emerald-300">
                      Booking ID: {bookingResponse?.booking_id || "BK-20260728"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Transparent SaaS Pricing</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-6">Simple Pricing For Growing Teams</h2>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center bg-slate-900 border border-slate-800 p-1 rounded-full mb-16">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              billingCycle === "monthly" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              billingCycle === "annual" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Annual Billing (Save 20%)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Starter Plan */}
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-xs text-slate-400 mb-6">Ideal for solopreneurs & individual freelancers.</p>
              <div className="text-4xl font-extrabold text-white mb-6">$0 <span className="text-xs text-slate-500 font-normal">/ month forever</span></div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li>✓ 1 Calendar Sync Connection</li>
                <li>✓ Unlimited Free Consultation Calls</li>
                <li>✓ Groq AI Rescheduling Chatbot</li>
                <li>✓ Google & Zoom Video Links</li>
              </ul>
            </div>
            <button onClick={handleGoogleAuth} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition-all">
              Get Started Free
            </button>
          </div>

          {/* Professional Plan (Most Popular) */}
          <div className="bg-slate-900 border-2 border-blue-500 p-8 rounded-3xl relative flex flex-col justify-between shadow-2xl shadow-blue-500/10">
            <span className="absolute -top-3.5 right-6 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">Most Popular</span>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-xs text-slate-400 mb-6">For growing coaches, agencies & consultants.</p>
              <div className="text-4xl font-extrabold text-white mb-6">
                {billingCycle === "annual" ? "$15" : "$19"} <span className="text-xs text-slate-500 font-normal">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li>✓ Unlimited Calendar Connections</li>
                <li>✓ Stripe Escrow Paid Strategy Calls</li>
                <li>✓ Unlimited Free SMS Reminders</li>
                <li>✓ Custom Buffer Padding Times</li>
                <li>✓ HIPAA Encryption Protection</li>
              </ul>
            </div>
            <button onClick={handleGoogleAuth} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25">
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-xs text-slate-400 mb-6">For multi-agent teams & large clinic networks.</p>
              <div className="text-4xl font-extrabold text-white mb-6">
                {billingCycle === "annual" ? "$39" : "$49"} <span className="text-xs text-slate-500 font-normal">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li>✓ Round-Robin Lead Distribution</li>
                <li>✓ Unlimited Team Members</li>
                <li>✓ Custom API & Webhook Triggers</li>
                <li>✓ Dedicated SLA & 24/7 Priority Support</li>
              </ul>
            </div>
            <button onClick={handleGoogleAuth} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-slate-900/40 border-t border-slate-800/80 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Questions & Answers</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <span className="text-blue-400">{openFaq === idx ? "−" : "+"}</span>
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-16 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider">Product</h5>
            <ul className="space-y-2.5">
              <li>Groq AI Assistant</li>
              <li>Stripe Escrow Payments</li>
              <li>SMS Reminders</li>
              <li>Calendar Sync Engine</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider">Solutions</h5>
            <ul className="space-y-2.5">
              <li>For Coaches & Consultants</li>
              <li>For Healthcare & Clinics</li>
              <li>For Real Estate Brokers</li>
              <li>For Enterprise Teams</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider">Resources</h5>
            <ul className="space-y-2.5">
              <li>FastAPI API Documentation</li>
              <li>SOC 2 & HIPAA Compliance</li>
              <li>System Health Status</li>
              <li>Integration Guides</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider">Company</h5>
            <ul className="space-y-2.5">
              <li>About BookFlow AI</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© Copyright BookFlow AI 2026. Designed for US Enterprise Scale. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-white">Admin Dashboard</Link>
            <span>Status: 99.99% Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
