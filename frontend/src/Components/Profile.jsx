// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCopy, FaUpload } from 'react-icons/fa';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';




const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || ''); 

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please connect your wallet to view your profile.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.message);
      // Handle token expiration
      if (err.message.includes('token')) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
  };
  
  
  

  useEffect(() => {
    fetchProfile();
  }, [token]); // Refetch when token changes

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
          body: formData,
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const data = await response.json();
        setUser(data);
        setAvatarFile(null);
        await fetchProfile();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user?.walletAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCreateOptions = () => {
    setShowCreateOptions(!showCreateOptions);
  };

  return (
    <>
      <Header />
      <div className="h-12"></div>
      <div className="p-6 max-w-5xl mx-auto flex space-x-6 bg-gray-50 rounded-xl shadow-lg">
        {error ? (
          <div className="text-red-500 p-6 w-full">{error}</div>
        ) : !user ? (
          <div className="p-6 w-full">Loading...</div>
        ) : (
          <>
            <div className="w-1/2 bg-white rounded-lg shadow-md p-6 ml-[-20px] border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={
                      user.avatarUrl
                        ? `http://localhost:3000${user.avatarUrl}`
                        : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full mb-4 object-cover ring-2 ring-purple-200"
                    onError={(e) =>
                      (e.target.src =
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==')
                    }
                  />
                  <label className="absolute bottom-4 right-0 cursor-pointer">
                    <FaUpload className="text-purple-900 hover:text-purple-700" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-600 mt-2 italic">{user.email || 'No email provided'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-gray-600 truncate max-w-xs font-mono">{user.walletAddress}</p>
                  <button
                    onClick={copyToClipboard}
                    className="text-purple-900 hover:text-purple-700"
                  >
                    <FaCopy />
                  </button>
                  {copied && <span className="text-green-500 text-sm">Copied!</span>}
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="font-medium">Orders Created</span>
                  <span>{user.ordersCreated}</span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="font-medium">Orders Received</span>
                  <span>{user.ordersReceived}</span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="font-medium">Joined</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="w-2/3 bg-white rounded-lg shadow-md p-6 mx-auto border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <div className="flex space-x-6">
                  <Link
                    to="/stores"
                    className="text-lg font-semibold text-purple-900 hover:text-purple-700 transition-colors"
                  >
                    My Stores
                  </Link>
                  <Link
                    to="/products"
                    className="text-lg font-semibold text-purple-900 hover:text-purple-700 transition-colors"
                  >
                    My Products
                  </Link>
                </div>
                <button
                  onClick={toggleCreateOptions}
                  className="bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors"
                >
                  Create
                </button>
              </div>
              {showCreateOptions && (
                <div className="flex space-x-4 mb-6">
                  <Link
                    to="/create-store"
                    className="bg-transparent text-purple-900 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    Store
                  </Link>
                  <Link
                    to="/create-collection"
                    className="bg-transparent text-purple-900 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    Collection
                  </Link>
                  <Link
                    to="/create-product"
                    className="bg-transparent text-purple-900 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    Product
                  </Link>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Stores Created</h3>
                <p className="text-gray-600">No stores created yet.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Last Actions</h3>
                <ul className="text-gray-600 space-y-2 list-disc pl-5">
                  <li>Connected wallet - {new Date().toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;