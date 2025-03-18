// frontend/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoMdNotifications, IoMdCart } from 'react-icons/io';
import { FaBars, FaUser, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import kara from '../assets/KARA.png';
import { ethers } from 'ethers';

const navItems = [
  { title: 'Stores', link: '/stores' },
  { title: 'Collections', link: '/collections' },
  { title: 'About Us', link: '/aboutus' },
];

const Header = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to connect your wallet');
      setErrorMessage('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      console.log('Connected address:', address);
      setWalletAddress(address);
      setErrorMessage('');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      console.log('Fetching nonce from:', `http://localhost:3000/user/nonce/${address}`);
      const nonceResponse = await fetch(`http://localhost:3000/user/nonce/${address}`);
      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        console.error('Nonce fetch response:', errorText);
        throw new Error(`Failed to fetch nonce: ${errorText}`);
      }
      const { nonce } = await nonceResponse.json();
      console.log('Received nonce:', nonce);

      setIsEmailModalOpen(true);
      const email = await new Promise((resolve) => {
        const handleModalSubmit = (submittedEmail) => resolve(submittedEmail);
        window.handleModalSubmit = handleModalSubmit;
      });
      console.log('Provided email:', email);
      setIsEmailModalOpen(false);
      delete window.handleModalSubmit;

      const message = `Connect wallet with nonce: ${nonce}`;
      console.log('Message to sign:', message);
      let signature;
      try {
        signature = await signer.signMessage(message);
        console.log('Generated signature:', signature);
        if (!signature || !signature.startsWith('0x') || signature.length !== 132) {
          throw new Error('Invalid signature format generated');
        }
      } catch (signError) {
        console.error('Signing error:', signError.message);
        throw new Error('Failed to sign message');
      }

      const payload = { walletAddress: address, signature, email: email || undefined };
      console.log('Payload to send:', payload);
      const connectResponse = await fetch('http://localhost:3000/user/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!connectResponse.ok) {
        const errorText = await connectResponse.text();
        console.error('Connect wallet failed with status:', connectResponse.status, 'Response:', errorText);
        throw new Error(`Failed to connect wallet: ${errorText}`);
      }
      const data = await connectResponse.json();
      console.log('Backend response:', data);

      if (data.token) {
        console.log('Received token:', data.token);
        setToken(data.token);
        console.log('Wallet connected successfully:', address);
      } else {
        console.error('Failed to get token:', data.error);
        setErrorMessage(data.error || 'Failed to connect wallet');
      }
    } catch (err) {
      console.error('Wallet connection error:', err.message);
      setErrorMessage(err.message);
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        if (token) console.log('Wallet already connected:', accounts[0]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const addWalletListener = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress('');
          setToken('');
        }
      });
    }
  };

  const handleEmailSubmit = () => {
    if (window.handleModalSubmit) {
      window.handleModalSubmit(emailInput || null);
    }
    setEmailInput('');
  };

  const handleEmailSkip = () => {
    if (window.handleModalSubmit) {
      window.handleModalSubmit(null);
    }
    setIsEmailModalOpen(false);
    setEmailInput('');
  };

  return (
    <header className="fixed top-0 w-full bg-white z-50 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <img src={kara} alt="Logo" className="w-16 h-auto" />
          </Link>
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-lg font-medium text-gray-700 cursor-pointer hover:text-purple-600 transition"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <FaBars className="text-xl" />
              <span>Categories</span>
            </button>
            {categoryOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md p-4 w-48">
                <ul className="space-y-2 text-gray-700">
                  <li><Link to="/electronics" className="block hover:text-purple-600">Electronics</Link></li>
                  <li><Link to="/mobilephoneandtabs" className="block hover:text-purple-600">Mobile Phones & Tabs</Link></li>
                  <li><Link to="/vehicles" className="block hover:text-purple-600">Vehicles</Link></li>
                  <li><Link to="/fashion" className="block hover:text-purple-600">Fashions</Link></li>
                  <li><Link to="/home&garden" className="block hover:text-purple-600">Home & Gardens</Link></li>
                </ul>
              </div>
            )}
          </div>
          {navItems.map(({ link, title }, index) => (
            <Link
              key={index}
              to={link}
              className={`text-lg font-medium text-gray-700 hover:text-purple-600 transition ${
                location.pathname === link ? 'text-purple-700 font-semibold' : ''
              }`}
            
            >
              {title}
            </Link>
          ))}
        </div>
        <div className="flex-grow max-w-sm ml-auto relative">
          <input
            type="text"
            placeholder=" Search product, and stores"
            className="w-full p-2 border-none rounded-full focus:outline-none placeholder-gray-500 px-4 bg-white"
            style={{
              border: '1.5px solid transparent',
              borderRadius: '20px',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(90deg, #FFA5A5 0%, #A044FF 29%, #FFA5A5 73%, #A044FF 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          />
        </div>
        <div className="flex items-center space-x-4 text-xl text-gray-700 ml-6">
          {!walletAddress ? (
            <button
              className="hover:bg-purple-700 cursor-pointer transition bg-purple-900 text-white px-2 py-1 font-small rounded-2xl"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:bg-purple-700 cursor-pointer transition bg-purple-900 text-white px-2 py-1 font-small rounded-2xl"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaUser />
                <span>{`${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/logout"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
          {errorMessage && (
            <span className="text-red-500 text-sm ml-2">{errorMessage}</span>
          )}
          <button className="relative hover:text-purple-600 cursor-pointer transition">
            <IoMdNotifications />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>
          <button className="relative hover:text-purple-600 cursor-pointer transition">
            <IoMdCart />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </button>
        </div>
      </nav>

      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Email</h2>
            <p className="text-gray-600 mb-4">Provide an email to receive notifications (optional).</p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEmailSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Skip
              </button>
              <button
                onClick={handleEmailSubmit}
                className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;