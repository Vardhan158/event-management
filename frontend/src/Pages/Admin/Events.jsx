import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import EventModal from "../../Pages/Admin/EventModal";
import ConfirmDeleteModal from "../../Components/ConfirmModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Events = ({ events, fetchData }) => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    date: "",
    image: null,
  });

  const [editEvent, setEditEvent] = useState(null);

  // ✅ Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin");
    if (!token) return toast.error("Unauthorized! Please log in again.");

    try {
      const formData = new FormData();
      Object.entries(newEvent).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });

      toast.info("📤 Uploading event...");
      await axios.post("http://localhost:5000/api/admin/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("🎉 Event added!");
      setShowAddEvent(false);
      setNewEvent({
        title: "",
        description: "",
        price: "",
        location: "",
        date: "",
        image: null,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add event");
    }
  };

  // ✅ Edit event
  const handleEditEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin");
    try {
      await axios.put(
        `http://localhost:5000/api/admin/events/${editEvent._id}`,
        editEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Event updated!");
      setShowEditEvent(false);
      setEditEvent(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update event");
    }
  };

  // ✅ Delete event
  const handleDeleteEvent = async () => {
    const token = localStorage.getItem("admin");
    if (!selectedEventId) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/events/${selectedEventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Event deleted");
      setShowDeleteModal(false);
      setSelectedEventId(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">Events</h2>
        <button
          onClick={() => setShowAddEvent(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          + Add Event
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full text-left border-collapse">
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
                    onClick={() => {
                      setSelectedEventId(event._id);
                      setShowDeleteModal(true);
                    }}
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

      {/* Floating Modals */}
      {showAddEvent && (
        <EventModal
          title="Add Event"
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

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEvent}
      />
    </motion.div>
  );
};

export default Events;
