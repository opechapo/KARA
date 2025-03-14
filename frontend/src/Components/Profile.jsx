// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
      <p><strong>Wallet Address:</strong> {user.walletAddress}</p>
      <p><strong>Email:</strong> {user.email || 'Not set'}</p>
      <p>You can buy and sell items on KARA!</p>
      {/* Add transaction history here later */}
    </div>
  );
};

export default Profile;