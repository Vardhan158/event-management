import React, { useState, useEffect } from "react";
import axios from "axios";
import Birthday from "../assets/Cake.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Vite-safe import

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState({ name: "", email: "", avatar: Birthday });
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

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
      const decoded = jwtDecode(token);
      console.log(decoded);
      
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
          {["overview", "myList", "payments"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer p-2 rounded-lg text-center ${
                activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              } capitalize`}
            >
              {tab === "myList" ? "My List" : tab}
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem("customer");
            navigate("/");
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
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </label>
            </div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-1">
              {user.name}
            </h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex justify-around w-full mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-500">
                  {bookedCount}
                </p>
                <p className="text-gray-600">Booked</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">
                  {completedCount}
                </p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        )}

        {/* My List */}
        {activeTab === "myList" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">
              My Booked Events
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bookings.length === 0 ? (
                <p className="text-gray-600 col-span-full text-center">
                  No bookings yet.
                </p>
              ) : (
                bookings.map((booking) => {
                  const event = booking.event || {};
                  return (
                    <div
                      key={booking._id}
                      className="rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-white"
                      onClick={() =>
                        event._id && navigate(`/booking/${event._id}`)
                      }
                    >
                      <img
                        src={event.img || Birthday}
                        alt={event.title || "Event"}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {event.title || "Untitled"}
                        </h3>
                        <p
                          className={`mt-1 font-medium ${
                            booking.status === "Booked"
                              ? "text-blue-500"
                              : "text-green-500"
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
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">
              Payments
            </h1>
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
                      <td className="py-3 px-6">
                        {booking.event?.title || "Untitled"}
                      </td>
                      <td
                        className={`py-3 px-6 font-semibold ${
                          booking.status === "Completed"
                            ? "text-green-600"
                            : "text-yellow-600"
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

        <ToastContainer position="top-center" autoClose={1500} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
