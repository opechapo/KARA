// frontend/src/components/Store.jsx
import React, { useState } from 'react';

const Store = () => {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: storeName, description }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      setMessage('Store created successfully');
      setStoreName('');
      setDescription('');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a Store</h2>
      <form onSubmit={handleCreateStore}>
        <div className="mb-4">
          <label className="block text-gray-700">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter store name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Describe your store"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-900 text-white p-2 rounded-md hover:bg-purple-700"
        >
          Create Store
        </button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Store;