// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCopy } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
      console.log('Sending token:', token); 
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token || ''}` },
          credentials: 'include',
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(errorText || 'Unauthorized');
        }
        const data = await response.json();
        console.log('Profile data:', data);
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'PUT',
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
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto flex space-x-6">
      {/* Left Side */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col items-center">
        <img
  src={user.avatarUrl ? `http://localhost:3000${user.avatarUrl}` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='}
  alt="Profile"
  className="w-32 h-32 rounded-full mb-4 object-cover"
  onError={(e) => {
    console.log('Image load error for:', user.avatarUrl);
    e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  }}
/>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800">{user.displayName || 'Unnamed'}</h2>
          <div className="flex items-center space-x-2">
            <p className="text-gray-600 truncate max-w-xs">{user.walletAddress}</p>
            <button onClick={copyToClipboard} className="text-purple-900 hover:text-purple-700">
              <FaCopy />
            </button>
            {copied && <span className="text-green-500 text-sm">Copied!</span>}
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Orders Created</span><span>0</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Orders Received</span><span>0</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Products</span><span>0</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Stores</span><span>0</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Rating</span><span>0.0</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Joined</span><span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-2/3 bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-4 mb-4">
          <Link to="/stores" className="text-lg font-semibold text-purple-900 hover:underline">Stores</Link>
          <Link to="/products" className="text-lg font-semibold text-purple-900 hover:underline">Products</Link>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Stores Created</h3>
          <p className="text-gray-600">No stores created yet.</p>
          {/* Placeholder for store list */}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Last Actions</h3>
          <ul className="text-gray-600 space-y-2">
            <li>Connected wallet - {new Date().toLocaleString()}</li>
            {/* Placeholder for more actions */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;