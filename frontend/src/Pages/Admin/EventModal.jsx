// src/pages/Admin/EventModal.jsx
import React from "react";
import { motion } from "framer-motion";

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
          onChange={(e) =>
            setEventData({ ...eventData, description: e.target.value })
          }
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
          onChange={(e) =>
            setEventData({ ...eventData, location: e.target.value })
          }
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

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setEventData({ ...eventData, image: e.target.files[0] })
          }
          className="w-full border p-2 rounded-md"
        />

        {/* Preview */}
        {eventData.image && (
          <img
            src={
              typeof eventData.image === "object"
                ? URL.createObjectURL(eventData.image)
                : eventData.image
            }
            alt="Preview"
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

export default EventModal;
