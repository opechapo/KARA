import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMdNotifications, IoMdCart } from 'react-icons/io';
import { FaBars, FaUser, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import kara from '../assets/KARA.png';
import { ethers } from 'ethers';
// const ethers = window.ethers;

// const navigate = useNavigate();
const navItems = [
  { title: 'Stores', link: '/stores' },
  { title: 'Collections', link: '/collections' },
  { title: 'About Us', link: '/aboutus' },
];

const Header = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      await getCurrentWalletConnected();
      addWalletListener();
      const storedToken = localStorage.getItem('token');
      setToken(storedToken || '');
    };
    initializeWallet();
  }, []); // Empty dependency array to run only once on mount

  // Add separate useEffect for walletAddress changes
useEffect(() => {
  const handleWalletChange = async () => {
    const storedToken = localStorage.getItem('token');
    if (walletAddress && !storedToken) {
      console.log('Wallet connected but no token, authenticating...');
      await connectWallet();
    }
  };
  handleWalletChange();
}, [walletAddress]);



  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMessage('Please install MetaMask');
      return;
    }
    try {
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      console.log('Got address:', address);
      setWalletAddress(address);
  
      console.log('Fetching nonce...');
      const nonceResponse = await fetch(`http://localhost:3000/user/nonce/${address}`);
      console.log('Nonce response status:', nonceResponse.status);
      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        throw new Error(`Failed to fetch nonce: ${errorText}`);
      }
      const { nonce } = await nonceResponse.json();
      console.log('Received nonce:', nonce);
  
      console.log('Preparing to sign message...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const message = `Connect wallet with nonce: ${nonce}`;
      console.log('Signing message:', message);
      let signature;
      try {
        signature = await signer.signMessage(message);
      } catch (signErr) {
        console.error('Signing failed:', signErr.message, signErr.code);
        throw new Error(`Signature error: ${signErr.message}`);
      }
      console.log('Generated signature:', signature);
  
      console.log('Sending connect request...');
      const payload = { walletAddress: address, signature };
      const connectResponse = await fetch('http://localhost:3000/user/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      console.log('Connect response status:', connectResponse.status);
      if (!connectResponse.ok) throw new Error(await connectResponse.text());
      const data = await connectResponse.json();
      console.log('Connect response:', data);
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        console.log('Token stored:', data.token);
        navigate('/profile');
      } else {
        throw new Error('No token in response');
      }
    } catch (err) {
      console.error('Wallet connection error:', err.message, err.stack);
      setErrorMessage(err.message);
    }
  };


  const getCurrentWalletConnected = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log('Wallet already connected:', accounts[0]);
      }
    } catch (err) {
      console.error('Error checking wallet:', err.message);
    }
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress('');
          setToken('');
          localStorage.removeItem('token');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setWalletAddress('');
    setIsDropdownOpen(false);
    console.log('Logged out');
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
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
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