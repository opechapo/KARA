// frontend/src/components/UpdateProfile.jsx
import React, { useState } from 'react';

const UpdateProfile = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      setMessage('Profile updated successfully');
      setEmail(data.email);
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-900 text-white p-2 rounded-md hover:bg-purple-700"
        >
          Update Profile
        </button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default UpdateProfile;