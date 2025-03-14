// frontend/src/components/Logout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      localStorage.removeItem('token');
      setMessage(data.message);
      setTimeout(() => navigate('/'), 1000); // Redirect to home after 1s
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Logout</h2>
      <button
        onClick={handleLogout}
        className="w-full bg-purple-900 text-white p-2 rounded-md hover:bg-purple-700"
      >
        Logout
      </button>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Logout;