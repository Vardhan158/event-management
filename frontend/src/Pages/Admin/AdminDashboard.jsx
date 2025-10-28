// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import child pages
import Overview from "./Overview";
import Users from "./Users";
import Events from "./Events";
import Bookings from "./Bookings";
import Payments from "./Payments";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    payments: 0,
  });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  // ✅ Fetch dashboard data once
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin");
      if (!token) return toast.error("Unauthorized! Please login again.");

      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, eventsRes, bookingsRes, paymentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users", { headers }),
        axios.get("http://localhost:5000/api/admin/events", { headers }),
        axios.get("http://localhost:5000/api/admin/bookings", { headers }),
        axios.get("http://localhost:5000/api/admin/payments", { headers }),
      ]);

      setUsers(usersRes.data || []);
      setEvents(eventsRes.data || []);
      setBookings(bookingsRes.data || []);
      setPayments(paymentsRes.data || []);
      setStats({
        users: usersRes.data?.length || 0,
        events: eventsRes.data?.length || 0,
        bookings: bookingsRes.data?.length || 0,
        payments: paymentsRes.data?.length || 0,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <div className="flex mt-[70px]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-6 h-[calc(100vh-70px)] fixed left-0 top-[70px] flex flex-col border-r border-gray-200">
          <h2 className="text-2xl font-bold mb-8 text-indigo-600 text-center">
            Admin Panel
          </h2>

          <ul className="flex flex-col gap-4">
            {["overview", "users", "events", "bookings", "payments"].map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer p-2 rounded-lg text-center transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-indigo-500 text-white scale-105"
                    : "hover:bg-indigo-100 text-gray-700"
                } capitalize`}
              >
                {tab}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              localStorage.removeItem("admin");
              window.location.href = "/login";
            }}
            className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </aside>

        {/* ✅ Main Section */}
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          {activeTab === "overview" && <Overview stats={stats} />}
          {activeTab === "users" && <Users users={users} fetchData={fetchData} />}
          {activeTab === "events" && <Events events={events} fetchData={fetchData} />}
          {activeTab === "bookings" && <Bookings bookings={bookings} fetchData={fetchData} />}
          {activeTab === "payments" && <Payments payments={payments} />}
          <ToastContainer position="top-center" autoClose={1500} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
