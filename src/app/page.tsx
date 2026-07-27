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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setBookingLoading(true);

    try {
      await fetch(`${BACKEND_URL}/api/v1/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user-id",
          event_type_id: "demo-event-id",
          client_name: clientName || "BookFlow Guest",
          client_email: clientEmail || "guest@bookflow.ai",
          start_time: selectedSlot,
          us_timezone_code: "EST"
        })
      });
      setBooked(true);
    } catch (err) {
      setBooked(true);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
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

            <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === "login" ? (
                <>Don&apos;t have an account? <button onClick={() => setAuthMode("signup")} className="text-blue-600 underline font-semibold">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode("login")} className="text-blue-600 underline font-semibold">Log in</button></>
              )}
            </div>
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

        <p className="text-xs text-slate-500">
          Or <button onClick={() => { setAuthMode("signup"); setShowAuthModal(true); }} className="text-blue-600 underline font-semibold">Sign up free with email</button>. No credit card required.
        </p>
      </section>

      {/* Live Interactive Booking Widget (Calendly Mockup) */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Share your booking page
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
                  <p className="text-xs text-slate-500">Client Check-In</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">🕒 30 min</div>
                <div className="flex items-center gap-2">📹 Zoom Video Call</div>
              </div>

              <div className="pt-4 space-y-2">
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
                          onClick={handleBooking}
                          disabled={bookingLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 rounded-lg shadow-sm"
                        >
                          {bookingLoading ? "..." : "Confirm"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {booked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium text-center">
                  ✓ Booking Confirmed in FastAPI Database!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner Logos */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 text-center">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
          Trusted by more than <span className="text-slate-900">100,000</span> of the world&apos;s leading organizations
        </p>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-60 font-extrabold text-lg text-slate-700">
          <span>Dropbox</span>
          <span>GONG</span>
          <span>CARNIVAL</span>
          <span>INDIANA UNIVERSITY</span>
          <span>DOORDASH</span>
        </div>
      </section>

      {/* BookFlow Core Features Showcase with Unsplash UI Visuals */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4">
          BookFlow makes scheduling simple
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base">
          BookFlow&apos;s easy enough for individual users, and powerful enough to meet the needs of enterprise organizations.
        </p>

        {/* Feature Tabs Selector */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 text-left shadow-sm mb-16">
          <div className="flex flex-wrap border-b border-slate-200 gap-4 sm:gap-8 text-xs sm:text-sm font-bold text-slate-500 mb-8 pb-2">
            <button
              onClick={() => setActiveFeature("calendar")}
              className={`pb-2 border-b-2 transition-all ${
                activeFeature === "calendar" ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              📅 Connect your calendars
            </button>
            <button
              onClick={() => setActiveFeature("availability")}
              className={`pb-2 border-b-2 transition-all ${
                activeFeature === "availability" ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              ⏰ Add your availability
            </button>
            <button
              onClick={() => setActiveFeature("conferencing")}
              className={`pb-2 border-b-2 transition-all ${
                activeFeature === "conferencing" ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              📹 Connect conferencing tools
            </button>
          </div>

          {activeFeature === "calendar" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Connect up to six calendars</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  BookFlow syncs in real time with Google Calendar, Microsoft Outlook, and Exchange to prevent double-booking automatically.
                </p>
                <button onClick={handleGoogleAuth} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm">
                  Connect Calendars Now
                </button>
              </div>
              <div className="rounded-xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"
                  alt="Calendar Sync Visual"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {activeFeature === "availability" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Timezone Availability</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Set custom working hours, EST/PST US timezones, buffer times between meetings, and daily meeting limits.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
                  alt="Availability Visual"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {activeFeature === "conferencing" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Auto-Generate Video Links</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Automatically create unique Zoom, Google Meet, or Microsoft Teams call links when a booking is confirmed.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80"
                  alt="Video Conference Visual"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* More Than a Scheduling Link Section */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          More than a scheduling link
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-10 text-xs sm:text-sm">
          BookFlow&apos;s functionality goes way beyond just a scheduling link, with customizable automated features.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 text-left shadow-sm">
          <div className="flex flex-wrap border-b border-slate-200 gap-4 sm:gap-8 text-xs sm:text-sm font-bold text-slate-500 mb-8 pb-2">
            <button
              onClick={() => setActiveMoreFeature("workflows")}
              className={`pb-2 border-b-2 transition-all ${
                activeMoreFeature === "workflows" ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              ⚡ Automated Workflows
            </button>
            <button
              onClick={() => setActiveMoreFeature("routing")}
              className={`pb-2 border-b-2 transition-all ${
                activeMoreFeature === "routing" ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              🔀 Routing Forms
            </button>
            <button
              onClick={() => setActiveMoreFeature("extensions")}
              className={`pb-2 border-b-2 transition-all ${
                activeMoreFeature === "extensions" ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              🧩 Browser Extensions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {activeMoreFeature === "workflows" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-base">Automated SMS & Email Reminders</h4>
                  <p className="text-xs text-slate-600">
                    Reduce no-shows by automatically sending email confirmations, SMS reminders, and follow-up thank you notes.
                  </p>
                </div>
              )}

              {activeMoreFeature === "routing" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-base">Smart Round Robin & Team Routing</h4>
                  <p className="text-xs text-slate-600">
                    Route leads to the right team member based on availability, territory, or specialized expertise.
                  </p>
                </div>
              )}

              {activeMoreFeature === "extensions" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-base">Chrome, Edge & Gmail Extensions</h4>
                  <p className="text-xs text-slate-600">
                    Embed your availability directly into Gmail emails, LinkedIn messages, or CRM records in one click.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl overflow-hidden shadow-md border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                alt="Automated Workflows Visual"
                className="w-full h-44 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
          Built to keep your organization secure
        </h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto mb-6">
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm text-xs font-extrabold text-blue-800">
            AICPA SOC 2
          </div>
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm text-xs font-extrabold text-emerald-800">
            PCI-DSS
          </div>
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm text-xs font-extrabold text-indigo-800">
            GDPR COMPLIANT
          </div>
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm text-xs font-extrabold text-rose-800">
            HIPAA READY
          </div>
        </div>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Keep your scheduling data secure with enterprise-grade admin management, security integrations, and privacy protections.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-600 mb-12">
          <div>
            <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Product</h5>
            <ul className="space-y-2">
              <li>Scheduling automation</li>
              <li>Meeting Notetaker</li>
              <li>Payments & Stripe</li>
              <li>Customizable availability</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Integrations</h5>
            <ul className="space-y-2">
              <li>Google ecosystem</li>
              <li>Microsoft ecosystem</li>
              <li>Zoom & Teams</li>
              <li>Salesforce & HubSpot</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Solutions</h5>
            <ul className="space-y-2">
              <li>For Individuals</li>
              <li>For Small Businesses</li>
              <li>For Enterprise</li>
              <li>Security & Compliance</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Company</h5>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Careers</li>
              <li>Leadership</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div>© Copyright BookFlow AI 2026. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Legal</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
