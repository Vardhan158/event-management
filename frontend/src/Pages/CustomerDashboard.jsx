import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Components/Navbar";
import "react-toastify/dist/ReactToastify.css";

// ✅ Event images
import Birthday from "../assets/Cake.png";
import Anniversary from "../assets/Anniversary.png";
import BabyShower from "../assets/BabyShower.jpg";
import Camping from "../assets/Camping.jpg";
import Corporate from "../assets/Corporate.jpg";
import Graduation from "../assets/Graduation.jpg";
import Theme from "../assets/Theme.jpg";
import Wedding from "../assets/Wedding.jpg";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState({ name: "", email: "", avatar: Birthday });
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const eventImages = {
    anniversary: Anniversary,
    wedding: Wedding,
    corporate: Corporate,
    theme: Theme,
    baby: BabyShower,
    graduation: Graduation,
    birthday: Birthday,
    camping: Camping,
  };

  // ✅ Flexible event image finder
  const getEventImage = (title) => {
    if (!title) return Birthday;
    const lowerTitle = title.toLowerCase();

    for (const [key, img] of Object.entries(eventImages)) {
      if (lowerTitle.includes(key)) return img;
    }

    return Birthday;
  };

  // ✅ Handle avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("customer");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      toast.info("Uploading image...");
      const res = await axios.post(
        "http://localhost:5000/api/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => ({ ...prev, avatar: res.data.imageUrl }));
      toast.success("Profile image updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image");
    }
  };

  // ✅ Fetch user and dashboard data
  useEffect(() => {
    const token = localStorage.getItem("customer");
    if (!token) {
      navigate("/login");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("customer");
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: res.data.name || decoded.name || "Customer",
          email: res.data.email || decoded.email || "",
          avatar: res.data.avatar || Birthday,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUser({
          name: decoded.name || "Customer",
          email: decoded.email || "",
          avatar: Birthday,
        });
      }
    };

    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, paymentsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/payment/status", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const safeBookings = (bookingsRes.data.bookings || []).map((b) => ({
          ...b,
          event: b.event || {},
        }));

        const safePayments = (paymentsRes.data.payments || []).map((p) => ({
          ...p,
          event: p.event || {},
        }));

        setBookings(safeBookings);
        setPayments(safePayments);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        toast.error("Failed to load dashboard data");
      }
    };

    fetchUserProfile();
    fetchDashboardData();
  }, [navigate]);

  const bookedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "booked"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <Navbar />

      <div className="flex mt-[70px]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-6 h-[calc(100vh-70px)] fixed left-0 top-[70px] flex flex-col border-r border-gray-200">
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
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 ml-64 overflow-y-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bookings.length === 0 ? (
                  <p className="text-gray-600 col-span-full text-center">
                    No bookings yet.
                  </p>
                ) : (
                  bookings.map((booking) => {
                    const event = booking.event || {};
                    const status = booking.status?.toLowerCase() || "";
                    return (
                      <div
                        key={booking._id}
                        className="rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-white"
                        onClick={() =>
                          navigate(`/booking-details/${booking._id}`)
                        }
                      >
                        <img
                          src={getEventImage(event.title)}
                          alt={event.title || "Event"}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="p-4 text-center">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {event.title || "Untitled"}
                          </h3>
                          <p
                            className={`mt-1 font-medium ${
                              status === "booked"
                                ? "text-blue-500"
                                : "text-green-500"
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
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
                      <th className="py-3 px-6 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 text-center text-gray-500"
                        >
                          No payments yet.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-6">
                            {payment.event?.title || "Untitled"}
                          </td>
                          <td
                            className={`py-3 px-6 font-semibold ${
                              payment.paymentStatus === "paid"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {payment.paymentStatus?.toUpperCase()}
                          </td>
                          <td className="py-3 px-6">
                            ₹{payment.event?.price || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <ToastContainer position="top-center" autoClose={1500} />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
