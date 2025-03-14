// frontend/src/components/MyListings.jsx
import React, { useState, useEffect } from 'react';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/listings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchListings();
  }, []);

  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Listings</h2>
      {listings.length === 0 ? (
        <p className="text-gray-600">You have no listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-purple-900 font-semibold">${item.price}</p>
              <p className="text-gray-500">Stock: {item.stock}</p>
              <p className="text-gray-500">Category: {item.category}</p>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover mt-2 rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;