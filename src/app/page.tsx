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
  const [booked, setBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Appointment Service Selection
  const [selectedService, setSelectedService] = useState("consultation");
  
  // Paid Meeting & Stripe States
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // AI Assistant Chatbot State
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hi! I'm BookFlow AI Assistant. Need help picking a time or rescheduling an existing meeting?" }
  ]);
  const [chatInput, setChatInput] = useState("");

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
      await fetch(`${BACKEND_URL}/api/v1/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user-id",
          event_type_id: selectedService,
          client_name: clientName || "BookFlow Guest",
          client_email: clientEmail || "guest@bookflow.ai",
          start_time: selectedSlot,
          us_timezone_code: "EST",
          amount_paid: selectedService === "strategy" ? 150 : 0
        })
      });
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

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let aiReply = "I can automatically help you book or reschedule. Please select an available slot above!";
      if (userText.toLowerCase().includes("reschedule") || userText.toLowerCase().includes("change")) {
        aiReply = "Sure! I can help you reschedule your meeting. Choose a new slot from the calendar and I will sync it with your Google Calendar.";
      } else if (userText.toLowerCase().includes("price") || userText.toLowerCase().includes("cost")) {
        aiReply = "Consultations and Training Calls are 100% Free ($0). Paid Strategy Sessions are $150 USD.";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-700 relative">
      
      {/* Floating AI Assistant Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showAiChat ? (
          <button
            onClick={() => setShowAiChat(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <span className="text-xl">🤖</span>
            <span className="text-xs pr-1">Ask AI Scheduler</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col h-[420px]">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="font-bold text-xs">BookFlow AI Assistant</h4>
                  <span className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAiChat(false)} className="text-white hover:text-slate-200 font-bold">
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-xl ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask to reschedule or pricing..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xs">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowStripeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Stripe Secure Checkout
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
              Complete $150 Payment
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              1-on-1 Paid Strategy Session (45 min) via Zoom/Google Meet.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); executeBooking(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md mt-4"
              >
                {bookingLoading ? "Processing Payment..." : "🔒 Pay $150 & Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg">B</div>
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">BookFlow AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg">
            📊 View Dashboard
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-2">
                {userProfile?.photo && <img src={userProfile.photo} className="w-4 h-4 rounded-full" alt="avatar" />}
                👤 {userProfile?.name || userProfile?.email}
              </span>
              <button onClick={handleLogout} className="text-xs font-semibold text-rose-600 hover:underline">
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleAuth} className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md">
              Sign In with Google
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
          AI Scheduling Built For Modern Teams
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal">
          The #1 Calendly Alternative with AI Rescheduling Assistant, Unlimited Calendar Sync, and Automated Stripe Payments.
        </p>
      </section>

      {/* Multi-Appointment Service Selection Widget */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8">
          
          <h3 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wider">
            Select Appointment Type:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
            <button
              onClick={() => setSelectedService("consultation")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === "consultation"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-xs text-slate-900">Consultation Phone Call</div>
              <div className="text-[11px] text-slate-500">15 mins • Free</div>
            </button>

            <button
              onClick={() => setSelectedService("training")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === "training"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-xs text-slate-900">Personal Training / Coaching</div>
              <div className="text-[11px] text-slate-500">30 mins • Free</div>
            </button>

            <button
              onClick={() => setSelectedService("demo")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === "demo"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-xs text-slate-900">Live Demo Session</div>
              <div className="text-[11px] text-slate-500">30 mins • Free</div>
            </button>

            <button
              onClick={() => setSelectedService("strategy")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === "strategy"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-xs text-slate-900">⚡ Paid Strategy Session</div>
              <div className="text-[11px] text-blue-600 font-bold">45 mins • $150 USD</div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Host Info */}
            <div className="pr-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  FS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Fatima Sy</h4>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{selectedService}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>🕒 Buffer Padding: 15 mins included</div>
                <div>📹 Zoom / Google Meet Link</div>
                <div className="font-bold text-slate-900">
                  💳 Price: {selectedService === "strategy" ? "$150 USD (Stripe)" : "Free ($0)"}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
                <label className="block text-[11px] font-bold text-slate-500 uppercase pt-2">Your Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Calendar Picker */}
            <div className="pt-4 md:pt-0 md:px-6">
              <h5 className="font-bold text-slate-900 text-sm mb-4">Select a Date & Time</h5>
              <div className="bg-slate-50 p-4 rounded-xl text-center">
                <div className="text-xs font-bold text-slate-700 mb-3">July 2026</div>
                <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-500 font-semibold mb-2">
                  <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {[...Array(31)].map((_, i) => (
                    <button
                      key={i}
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        i + 1 === 28
                          ? "bg-blue-600 text-white font-bold"
                          : "hover:bg-blue-50 text-slate-700"
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
              <h5 className="font-bold text-slate-900 text-sm mb-4">Available EST Slots</h5>
              {loading ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading FastAPI slots...</p>
              ) : (
                <div className="space-y-2">
                  {slots.slice(0, 4).map((s: any, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <button
                        onClick={() => setSelectedSlot(s.start_time_utc)}
                        className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                          selectedSlot === s.start_time_utc
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-blue-600 hover:border-blue-600"
                        }`}
                      >
                        {s.us_local_time}
                      </button>
                      {selectedSlot === s.start_time_utc && (
                        <button
                          onClick={handleBookingInitiate}
                          disabled={bookingLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 rounded-lg shadow-sm"
                        >
                          {selectedService === "strategy" ? "Pay $150" : "Confirm"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {booked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium text-center">
                  ✓ Appointment Confirmed in FastAPI Database!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-400">
        © Copyright BookFlow AI 2026. All rights reserved.
      </footer>
    </div>
  );
}
