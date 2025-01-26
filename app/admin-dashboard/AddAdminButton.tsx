'use client';

import { useState } from 'react';

export default function AddAdminButton() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddAdmin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { addAdmin } = await import('./action') 
      await addAdmin(email, password);
      setSuccessMessage('Admin added successfully!');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error adding admin:', error);
      setErrorMessage('Failed to add admin. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Add New Admin
      </button>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Add New Admin</h2>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            {successMessage && (
              <p className="text-green-500 mb-2">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            <button
              onClick={handleAddAdmin}
              className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600 mb-2"
            >
              Add Admin
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 text-gray-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
