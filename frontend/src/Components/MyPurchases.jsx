// frontend/src/components/MyPurchases.jsx
import React, { useState, useEffect } from 'react';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/purchases', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPurchases();
  }, []);

  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Purchases</h2>
      {purchases.length === 0 ? (
        <p className="text-gray-600">You have no purchases yet.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700">Order ID: {order._id}</p>
              <p className="text-gray-700">Total: ${order.totalAmount}</p>
              <p className="text-gray-700">Status: {order.status}</p>
              <div className="mt-2">
                <h4 className="text-gray-800 font-medium">Items:</h4>
                {order.products.map((item, index) => (
                  <div key={index} className="text-gray-600">
                    - {item.product.name} (Qty: {item.quantity}, Price: ${item.price})
                  </div>
                ))}
              </div>
              <p className="text-gray-500 mt-2">
                Shipping: {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state}, {order.shippingAddress.country}{' '}
                {order.shippingAddress.postalCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;