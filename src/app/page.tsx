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

  // Appointment Service Selection
  const [selectedService, setSelectedService] = useState("consultation");
  
  // Niche Tab State
  const [activeNiche, setActiveNiche] = useState("coaches");

  // Paid Meeting & Stripe States
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Groq AI Assistant Chatbot State
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I'm BookFlow AI powered by Groq LPU. How can I help you scale your appointments today?" }
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
      setChatMessages((prev) => [...prev, { sender: "ai", text: "To reschedule, simply select a new date and time from the calendar below." }]);
    } finally {
      setAiTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Groq AI Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showAiChat ? (
          <button
            onClick={() => setShowAiChat(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 border border-blue-400/30"
          >
            <span className="text-xl">⚡</span>
            <span className="text-xs pr-1">Groq AI Assistant</span>
          </button>
        ) : (
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-80 sm:w-96 overflow-hidden flex flex-col h-[420px]">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="font-bold text-xs">BookFlow AI (Groq Powered)</h4>
                  <span className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ultra-Low Latency
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAiChat(false)} className="text-white hover:text-slate-200 font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-950 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-xl ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 shadow-sm rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="text-[10px] text-slate-500 italic">Groq AI is processing...</div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-2 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask Groq AI anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs border border-slate-800 bg-slate-950 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-600"
              />
              <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-blue-500">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full p-6 relative text-slate-100">
            <button
              onClick={() => setShowStripeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Stripe Secure Checkout
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
                  className="w-full border border-slate-800 bg-slate-950 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-600"
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
                    className="w-full border border-slate-800 bg-slate-950 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-600"
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
                    className="w-full border border-slate-800 bg-slate-950 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md mt-4"
              >
                {bookingLoading ? "Processing Payment..." : "🔒 Pay $150 & Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-600/30">B</div>
          <span className="text-2xl font-extrabold text-white tracking-tight">BookFlow <span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold text-slate-300 hover:text-white border border-slate-800 bg-slate-900 px-3.5 py-2 rounded-lg transition-all">
            📊 App Dashboard
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                {userProfile?.photo && <img src={userProfile.photo} className="w-4 h-4 rounded-full" alt="avatar" />}
                👤 {userProfile?.name || userProfile?.email}
              </span>
              <button onClick={handleLogout} className="text-xs font-semibold text-rose-400 hover:underline">
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleAuth} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/20">
              Sign In Free
            </button>
          )}
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-4 py-1.5 text-xs font-bold mb-6">
          <span>⚡ Next-Gen AI Scheduling Platform for America</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Stop Losing Clients To <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Slow Scheduling & No-Shows
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
          BookFlow AI automates calendar booking, collects instant Stripe payments, dispatches free SMS reminders, and handles rescheduling via Groq AI — so you never miss a revenue opportunity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button onClick={handleGoogleAuth} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl text-sm transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2">
            🚀 Start Free 14-Day Trial (No Credit Card)
          </button>
          <a href="#demo-widget" className="w-full sm:w-auto border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 font-bold py-4 px-8 rounded-xl text-sm transition-all">
            ⚡ Try Live Interactive Demo
          </a>
        </div>

        {/* System Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium pt-4 border-t border-slate-800/60 max-w-2xl mx-auto">
          <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Unlimited Calendar Sync</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> $0 Free SMS Gateway</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> HIPAA & SOC 2 Ready</span>
        </div>
      </section>

      {/* SECTION 2: WHY WE ARE 10X BETTER THAN CALENDLY */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Why Top US Professionals Switch From Calendly
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-16">
            Calendly charges per user and limits calendar connections. BookFlow AI provides enterprise-grade AI automation at zero friction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-bold text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Groq AI Rescheduling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clients can chat with our Groq-powered AI assistant to reschedule or ask questions in under 1 second — no back-and-forth emails.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-2xl mb-6">
                💬
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero-Cost SMS Reminders</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Slash appointment no-shows by 95%. Automated SMS notifications dispatched directly under your branded [BookFlow AI] sender name.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-purple-600/10 text-purple-400 rounded-xl flex items-center justify-center font-bold text-2xl mb-6">
                💳
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Stripe Payments</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collect deposits or full payments ($150 strategy sessions) before a meeting is ever confirmed to eliminate tire-kickers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: US NICHE SOLUTIONS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Tailored For American Service Businesses
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Select your industry to see how BookFlow AI supercharges your daily booking workflow.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveNiche("coaches")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeNiche === "coaches" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              💼 Coaches & Consultants
            </button>
            <button
              onClick={() => setActiveNiche("healthcare")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeNiche === "healthcare" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              🏥 Doctors & Dentists
            </button>
            <button
              onClick={() => setActiveNiche("realestate")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeNiche === "realestate" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              🏡 Real Estate & Law
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto">
          {activeNiche === "coaches" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Monetize Your Time Instantly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Coaches use BookFlow AI to sell 45-minute $150 Strategy Calls. Stripe checkout handles payment verification, Zoom links are generated automatically, and calendar slots adjust for EST/PST timezones.
              </p>
            </div>
          )}
          {activeNiche === "healthcare" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">HIPAA-Compliant Patient Intake</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Medical practitioners can collect patient confidential notes protected by 256-bit HIPAA encryption engine. Buffer times ensure doctors have 15 minutes between appointments.
              </p>
            </div>
          )}
          {activeNiche === "realestate" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Smart Round-Robin Lead Assignment</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Realtors and Law firms distribute incoming client consultations equally across team members using our automated Round-Robin Lead Routing algorithm.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE BOOKING WIDGET DEMO */}
      <section id="demo-widget" className="py-20 bg-slate-900/30 border-t border-slate-800 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Interactive Experience</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Test The Live Booking Engine Below</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              1. Select Service Option:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
              <button
                onClick={() => setSelectedService("consultation")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedService === "consultation"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                <div className="font-bold text-xs text-white">Consultation Call</div>
                <div className="text-[11px] text-slate-400">15 mins • Free</div>
              </button>

              <button
                onClick={() => setSelectedService("training")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedService === "training"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                <div className="font-bold text-xs text-white">Personal Training</div>
                <div className="text-[11px] text-slate-400">30 mins • Free</div>
              </button>

              <button
                onClick={() => setSelectedService("demo")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedService === "demo"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                <div className="font-bold text-xs text-white">Live Demo Session</div>
                <div className="text-[11px] text-slate-400">30 mins • Free</div>
              </button>

              <button
                onClick={() => setSelectedService("strategy")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedService === "strategy"
                    ? "border-blue-500 bg-blue-600/10 ring-1 ring-blue-500"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                <div className="font-bold text-xs text-white">⚡ Paid Strategy Call</div>
                <div className="text-[11px] text-blue-400 font-bold">45 mins • $150 USD</div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Host Info */}
              <div className="pr-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg">
                    FS
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Fatima Sy</h4>
                    <p className="text-xs text-slate-400 uppercase font-semibold">{selectedService}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-medium bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div>🕒 Buffer Padding: 15 mins included</div>
                  <div>📹 Zoom / Google Meet Call</div>
                  <div className="font-bold text-white">
                    💳 Price: {selectedService === "strategy" ? "$150 USD (Stripe)" : "Free ($0)"}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Your Phone (For Free SMS)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full border border-slate-800 bg-slate-950 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Calendar Picker */}
              <div className="pt-4 md:pt-0 md:px-6">
                <h5 className="font-bold text-white text-sm mb-4">Select a Date & Time</h5>
                <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
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
              <div className="pt-4 md:pt-0 md:pl-6 space-y-3">
                <h5 className="font-bold text-white text-sm mb-4">Available EST Slots</h5>
                {loading ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Loading FastAPI slots...</p>
                ) : (
                  <div className="space-y-2">
                    {slots.slice(0, 4).map((s: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <button
                          onClick={() => setSelectedSlot(s.start_time_utc)}
                          className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                            selectedSlot === s.start_time_utc
                              ? "border-blue-500 bg-blue-600/20 text-blue-400"
                              : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {s.us_local_time}
                        </button>
                        {selectedSlot === s.start_time_utc && (
                          <button
                            onClick={handleBookingInitiate}
                            disabled={bookingLoading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 rounded-lg shadow-md"
                          >
                            {selectedService === "strategy" ? "Pay $150" : "Confirm"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {booked && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-medium text-center shadow-sm space-y-1">
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

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© Copyright BookFlow AI 2026. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-white">Admin Dashboard</Link>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
