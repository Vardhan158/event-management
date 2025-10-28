import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ConfirmDeleteModal from "../../Components/ConfirmModal"; // Make sure path matches your project

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Users = ({ users, fetchData }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Handle delete request
  const handleDeleteUser = async () => {
    const token = localStorage.getItem("admin");
    if (!selectedUserId) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${selectedUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User deleted successfully");
      setShowModal(false);
      setSelectedUserId(null);
      fetchData(); // Refresh user list
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="p-4 md:p-6"
    >
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Users</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setShowModal(true);
                      }}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition-all active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Floating Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDeleteUser}
      />
    </motion.div>
  );
};

export default Users;
