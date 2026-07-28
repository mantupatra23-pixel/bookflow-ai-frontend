"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [bookings, setBookings] = useState([
    { id: "#1", client: "John Doe", service: "Paid Strategy Session", duration: "45 Mins", status: "Approved", payment: "$150.00", date: "July 28, 2026" },
    { id: "#2", client: "Sarah Smith", service: "Consultation Call", duration: "15 Mins", status: "Approved", payment: "Free", date: "July 29, 2026" },
    { id: "#3", client: "Michael Brown", service: "Personal Training", duration: "30 Mins", status: "Pending", payment: "Free", date: "July 30, 2026" },
    { id: "#4", client: "Emily Davis", service: "Paid Strategy Session", duration: "45 Mins", status: "Cancelled", payment: "$150.00", date: "July 31, 2026" }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg">B</div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">BookFlow AI Dashboard</span>
        </div>
        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline">
          ← Back to Booking Page
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Revenue</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">$300.00</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Bookings</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">4</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Completed Calls</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">2</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Cancellation Rate</div>
            <div className="text-2xl font-extrabold text-rose-500 mt-1">25%</div>
          </div>
        </div>

        {/* Appointments Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Upcoming Appointments</h3>
            <span className="text-xs text-slate-400">Live Sync with FastAPI Database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-400">{item.id}</td>
                    <td className="p-4 font-bold text-slate-900">{item.client}</td>
                    <td className="p-4 text-slate-600">{item.service}</td>
                    <td className="p-4 text-slate-500">{item.duration}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                        item.status === "Pending" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{item.payment}</td>
                    <td className="p-4 text-slate-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
