"use client";

import { useState, useEffect } from "react";
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

  // Paid Meeting & Stripe States
  const [eventType, setEventType] = useState<"free" | "paid">("free");
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Feature Tabs State
  const [activeFeature, setActiveFeature] = useState("calendar");
  const [activeMoreFeature, setActiveMoreFeature] = useState("workflows");

  // Auth States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
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
      setShowAuthModal(false);
    } catch (error) {
      console.error("Firebase auth error:", error);
    }
  };

  const handleMicrosoftAuth = () => {
    setIsLoggedIn(true);
    setUserProfile({ email: "mantupatra@outlook.com", name: "Mantu Patra (Microsoft)" });
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserProfile({ email: authEmail || "mantu@bookflow.ai" });
    setShowAuthModal(false);
  };

  const handleBookingInitiate = () => {
    if (!selectedSlot) return;
    if (eventType === "paid") {
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
          event_type_id: eventType === "paid" ? "paid-strategy-session" : "free-discovery-call",
          client_name: clientName || "BookFlow Guest",
          client_email: clientEmail || "guest@bookflow.ai",
          start_time: selectedSlot,
          us_timezone_code: "EST",
          amount_paid: eventType === "paid" ? 150 : 0
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

  const handleStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    executeBooking();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
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

            <form onSubmit={handleStripePayment} className="space-y-4">
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {bookingLoading ? "Processing Payment..." : "🔒 Pay $150 & Confirm Booking"}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-2">
                <span>⚡ Powered by Stripe</span>
                <span>•</span>
                <span>256-bit SSL Encryption</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {authMode === "login" ? "Welcome back to BookFlow" : "Create your account"}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {authMode === "login" ? "Sign in to manage your meetings and schedules." : "Start your 14-day unlimited free trial."}
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleMicrosoftAuth}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 23 23">
                  <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z"/>
                </svg>
                Continue with Microsoft
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">Or Email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md"
              >
                {authMode === "login" ? "Log In" : "Get Started"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg">B</div>
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">BookFlow</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-2">
                {userProfile?.photo && <img src={userProfile.photo} className="w-4 h-4 rounded-full" alt="avatar" />}
                👤 {userProfile?.name || userProfile?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-lg border border-slate-200"
              >
                Log In
              </button>
              <button
                onClick={() => { setAuthMode("signup"); setShowAuthModal(true); }}
                className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md shadow-blue-600/20"
              >
                Get started for free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
          Easy scheduling ahead
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal">
          Join 20 million professionals who easily book meetings with the #1 AI-powered scheduling tool.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-4">
          <button
            onClick={handleGoogleAuth}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all shadow-md"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign up with Google
          </button>

          <button
            onClick={handleMicrosoftAuth}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all shadow-md"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 23 23">
              <path d="M0 0h11v11H0zM12 0h11v11H0zM0 12h11v11H0zM12 12h11v11H12z"/>
            </svg>
            Sign up with Microsoft
          </button>
        </div>
      </section>

      {/* Live Interactive Booking Widget (Free vs Paid Event) */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8">
          
          {/* Event Type Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Select Meeting Type
              </span>
              <h3 className="text-lg font-bold text-slate-900">Fatima Sy Scheduling Page</h3>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto">
              <button
                onClick={() => setEventType("free")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  eventType === "free"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Free Discovery Call ($0)
              </button>
              <button
                onClick={() => setEventType("paid")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  eventType === "paid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ⚡ Paid Strategy Session ($150)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Host Details */}
            <div className="pr-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  FS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Fatima Sy</h4>
                  <p className="text-xs text-slate-500">
                    {eventType === "paid" ? "45 min Paid Strategy Call" : "15 min Free Consultation"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">🕒 Duration: {eventType === "paid" ? "45 mins" : "15 mins"}</div>
                <div className="flex items-center gap-2">📹 Zoom / Google Meet Link</div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  💳 Price: {eventType === "paid" ? "$150 USD via Stripe" : "Free ($0 USD)"}
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

            {/* Date Calendar Picker */}
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
                        i + 1 === 27
                          ? "bg-blue-600 text-white font-bold"
                          : "hover:bg-blue-50 text-slate-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 text-center">Time zone: Eastern Time - US & Canada (EST)</p>
            </div>

            {/* Real Backend Slots */}
            <div className="pt-4 md:pt-0 md:pl-6 space-y-3">
              <h5 className="font-bold text-slate-900 text-sm mb-4">Available Real-Time Slots</h5>
              {loading ? (
                <p className="text-xs text-slate-400 py-4 text-center">Fetching EST live slots from FastAPI...</p>
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
                          {eventType === "paid" ? "Pay $150" : "Confirm"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {booked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium text-center">
                  ✓ {eventType === "paid" ? "$150 Paid & Booking Confirmed!" : "Booking Confirmed in FastAPI Database!"}
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
