import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔹 Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

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
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [loadingBookingId, setLoadingBookingId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    date: "",
  });
  const [editEvent, setEditEvent] = useState(null);

  // ✅ Fetch Dashboard Data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin");
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

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
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Animated Counter
  const Counter = ({ target }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 1000;
      const increment = target / (duration / 30);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        setCount(Math.floor(start));
      }, 30);
      return () => clearInterval(interval);
    }, [target]);
    return <span>{count}</span>;
  };

  // ✅ Add Event
const handleAddEvent = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("admin");
  if (!token) {
    toast.error("Unauthorized! Please log in again.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("price", newEvent.price);
    formData.append("location", newEvent.location);
    formData.append("date", newEvent.date);

    // ✅ Append only if image file exists
    if (newEvent.image instanceof File) {
      formData.append("image", newEvent.image);
    }

    toast.info("📤 Uploading event to Cloudinary...");

    const res = await axios.post(
      "http://localhost:5000/api/admin/events",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("🎉 Event added successfully!");
    setShowAddEvent(false);

    // ✅ Reset form
    setNewEvent({
      title: "",
      description: "",
      price: "",
      location: "",
      date: "",
      image: null,
    });

    // ✅ Refresh event list
    fetchData();
  } catch (err) {
    console.error("❌ Add event error:", err.response?.data || err.message);
    toast.error("Failed to add event. Please try again.");
  }
};


  // ✅ Edit Event
  const handleEditEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin");
    try {
      await axios.put(
        `http://localhost:5000/api/admin/events/${editEvent._id}`,
        editEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Event updated successfully!");
      setShowEditEvent(false);
      setEditEvent(null);
      fetchData();
    } catch (err) {
      console.error("Edit event error:", err);
      toast.error("Failed to update event");
    }
  };

  // ✅ Delete Event
  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem("admin");
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("admin");
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // ✅ Update Booking Status (confirm/reject)
  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("admin");
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    try {
      setLoadingBookingId(bookingId); // show spinner/loading
      const headers = { Authorization: `Bearer ${token}` };

      // ✅ Update status properly
      const res = await axios.put(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers }
      );

      toast.success(`Booking ${newStatus} successfully!`);

      // ✅ Update local state without refetching everything
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
    } finally {
      setLoadingBookingId(null);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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

        {/* Main Content */}
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          {/* ✅ Overview Section */}
          {activeTab === "overview" && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              {[
                { title: "Users", value: stats.users, color: "from-pink-500 to-rose-400" },
                { title: "Events", value: stats.events, color: "from-blue-500 to-cyan-400" },
                { title: "Bookings", value: stats.bookings, color: "from-indigo-500 to-purple-400" },
                { title: "Payments", value: stats.payments, color: "from-green-500 to-emerald-400" },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-r ${card.color} text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform`}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-4xl font-bold">
                    <Counter target={card.value} />
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ✅ Users Table */}
          {activeTab === "users" && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-indigo-600 mb-6">Users</h2>
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 capitalize">{user.role}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ✅ Events Table */}
          {activeTab === "events" && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-600">Events</h2>
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  + Add Event
                </button>
              </div>

              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{event.title}</td>
                        <td className="p-3">₹{event.price}</td>
                        <td className="p-3">{event.location}</td>
                        <td className="p-3">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => {
                              setEditEvent(event);
                              setShowEditEvent(true);
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Add/Edit Event Modals */}
              {showAddEvent && (
                <EventModal
                  title="Add New Event"
                  eventData={newEvent}
                  setEventData={setNewEvent}
                  onClose={() => setShowAddEvent(false)}
                  onSubmit={handleAddEvent}
                />
              )}
              {showEditEvent && (
                <EventModal
                  title="Edit Event"
                  eventData={editEvent}
                  setEventData={setEditEvent}
                  onClose={() => setShowEditEvent(false)}
                  onSubmit={handleEditEvent}
                />
              )}
            </motion.div>
          )}

          {/* ✅ Bookings Table */}
          {activeTab === "bookings" && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-indigo-600 mb-6">Bookings</h2>
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                      <th className="p-3">Event</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{b.event?.title || "N/A"}</td>
                        <td className="p-3">{b.user?.name || "N/A"}</td>
                        <td className="p-3 capitalize">{b.status}</td>
                        <td className="p-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ✅ Payments Table */}
          {activeTab === "payments" && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-indigo-600 mb-6">Payments</h2>
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                      <th className="p-3">Event</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{p.event?.title || "N/A"}</td>
                        <td className="p-3">{p.user?.name || "N/A"}</td>
                        <td className="p-3 capitalize">{p.paymentStatus}</td>
                        <td className="p-3">₹{p.event?.price || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <ToastContainer position="top-center" autoClose={1500} />
        </main>
      </div>
    </div>
  );
};

// ✅ Reusable Modal for Add/Edit Event
// ✅ Reusable Modal for Add/Edit Event
const EventModal = ({ title, eventData, setEventData, onClose, onSubmit }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-6 rounded-xl shadow-lg w-[400px]"
    >
      <h3 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
        {title}
      </h3>
      <form onSubmit={onSubmit} className="space-y-3">
  <input
    type="text"
    placeholder="Title"
    value={eventData.title}
    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
    required
    className="w-full border p-2 rounded-md"
  />
  <textarea
    placeholder="Description"
    value={eventData.description || ""}
    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
    required
    className="w-full border p-2 rounded-md"
  />
  <input
    type="number"
    placeholder="Price"
    value={eventData.price}
    onChange={(e) => setEventData({ ...eventData, price: e.target.value })}
    required
    className="w-full border p-2 rounded-md"
  />
  <input
    type="text"
    placeholder="Location"
    value={eventData.location}
    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
    required
    className="w-full border p-2 rounded-md"
  />
  <input
    type="date"
    value={eventData.date ? eventData.date.split("T")[0] : ""}
    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
    required
    className="w-full border p-2 rounded-md"
  />

  {/* ✅ Image Upload */}
{/* Image upload */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setEventData({ ...eventData, image: file });
  }}
  className="w-full border p-2 rounded-md"
/>

{/* Image Preview */}
{eventData.image && (
  <img
    src={
      typeof eventData.image === "object"
        ? URL.createObjectURL(eventData.image) // local preview
        : eventData.image // cloudinary URL
    }
    alt="Preview"
    className="w-full h-40 object-cover rounded-md"
  />
)}


   {/* ✅ Image Preview for already uploaded images (edit mode) */}
  {eventData.image && typeof eventData.image === "string" && (
    <img
      src={`http://localhost:5000${eventData.image}`}
      alt="Event"
      className="w-full h-40 object-cover rounded-md"
    />
  )}

  <div className="flex justify-end gap-3 mt-4">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    >
      Save
    </button>
  </div>
</form>
</motion.div>
</div>
);


export default AdminDashboard;
