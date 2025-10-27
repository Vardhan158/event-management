import React, { useState, useEffect } from "react";
import axios from "axios";
import Birthday from "../assets/Cake.png";
import Anniversary from "../assets/Anniversary.png";
import BabyShower from "../assets/BabyShower.jpg";
import Camping from "../assets/Camping.jpg";
import Corporate from "../assets/Corporate.jpg";
import Graduation from "../assets/Graduation.jpg";
import Theme from "../assets/Theme.jpg";
import Wedding from "../assets/Wedding.jpg";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from 'jwt-decode'; // Vite-safe import

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState({ name: "", email: "", avatar: Birthday });
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const services = [
    { title: "Anniversary", img: Anniversary, slug: "anniversary" },
    { title: "Weddings", img: Wedding, slug: "weddings" },
    { title: "Corporate Events", img: Corporate, slug: "corporate-events" },
    { title: "Theme Parties", img: Theme, slug: "theme-parties" },
    { title: "Baby Showers", img: BabyShower, slug: "baby-showers" },
    { title: "Graduation", img: Graduation, slug: "graduation" },
    { title: "Birthday Party", img: Birthday, slug: "birthday-party" },
    { title: "Camping", img: Camping, slug: "camping" },
  ];

  // Change profile avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setUser({ ...user, avatar: imgURL });
    }
  };

  // Fetch user info & bookings
  useEffect(() => {
    const token = localStorage.getItem("customer");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token); // Vite-safe decode
      setUser({
        name: decoded.name || "Customer",
        email: decoded.email || "",
        avatar: Birthday,
      });
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("customer");
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const safeBookings = (res.data.bookings || []).map((b) => ({
          ...b,
          event: b.event || {},
        }));
        setBookings(safeBookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err.response || err);
        toast.error("Failed to load your bookings");
      }
    };
    fetchBookings();
  }, [navigate]);

  const bookedCount = bookings.filter((b) => b.status === "Booked").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-indigo-600">Dashboard</h2>
        <ul className="flex flex-col gap-4">
          {["overview", "myList", "payments", "services", "reviews"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer p-2 rounded-lg text-center ${
                activeTab === tab ? "bg-indigo-500 text-white" : "hover:bg-indigo-100 text-gray-700"
              } capitalize`}
            >
              {tab === "myList" ? "My List" : tab}
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem("customer");
            navigate("/customer-login");
          }}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-indigo-200"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-500 p-1 rounded-full cursor-pointer hover:bg-indigo-600">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </label>
            </div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-1">{user.name}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex justify-around w-full mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-500">{bookedCount}</p>
                <p className="text-gray-600">Booked</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{completedCount}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        )}

        {/* My List */}
        {activeTab === "myList" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">My Booked Events</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bookings.length === 0 ? (
                <p className="text-gray-600 col-span-full text-center">No bookings yet.</p>
              ) : (
                bookings.map((booking) => {
                  const event = booking.event || {};
                  return (
                    <div
                      key={booking._id}
                      className="rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-white"
                      onClick={() => event._id && navigate(`/booking/${event._id}`)}
                    >
                      <img
                        src={event.img || Birthday}
                        alt={event.title || "Event"}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-lg text-gray-800">{event.title || "Untitled"}</h3>
                        <p
                          className={`mt-1 font-medium ${
                            booking.status === "Booked" ? "text-blue-500" : "text-green-500"
                          }`}
                        >
                          {booking.status}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Payments */}
        {activeTab === "payments" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">Payments</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left">Event Name</th>
                    <th className="py-3 px-6 text-left">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6">{booking.event?.title || "Untitled"}</td>
                      <td
                        className={`py-3 px-6 font-semibold ${
                          booking.status === "Completed" ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {booking.status === "Completed" ? "Paid" : "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Services */}
        {activeTab === "services" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">Our Services</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => navigate(`/booking/${service.slug}`)}
                >
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center text-center p-4">
                    <h3 className="text-white text-xl font-semibold">{service.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">Reviews</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bookings.map((booking) => {
                const event = booking.event || {};
                return (
                  <div key={booking._id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="font-semibold text-lg mb-2 text-indigo-600">{event.title || "Untitled"}</h3>
                    <p className="text-gray-700">{booking.notes || "No feedback yet."}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <ToastContainer position="top-center" autoClose={1500} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
