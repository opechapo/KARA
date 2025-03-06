import React, { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdNotifications, IoMdCart, IoMdPersonAdd } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import kara from "../assets/KARA.png";

const navItems = [
  { title: "Stores", link: "/stores" },
  { title: "Collections", link: "/collections" },
  {  title: "About Us", link: "/aboutus" },
];

const Header = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect (() => {
    getCurrentWalletConnected()
    addWalletListener()
  });

  const connectWallet = async() => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try{
        // Metamask is installed
        const accounts= await window.ethereum.request({ method: "eth_requestAccounts"});
        setWalletAddress(accounts[0]);
        console.log(accounts[0])
      }catch(err){
        console.error(err.message);
      }
  }else {
    // Metamask is not installed
    console.log("Please install Metamask to connect your wallet");

  }
};

const getCurrentWalletConnected = async() => {
  if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
    try{
      // Metamask is installed
      const accounts= await window.ethereum.request({ method: "eth_accounts"});
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } else {
        console.log("Please connect your wallect using the connect button");
      }
     
    }catch(err){
      console.error(err.message);
    }
}else {
  // Metamask is not installed
  console.log("Please install Metamask to connect your wallet");

}
};
  
const addWalletListener = async() => {
  if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
   window.ethereum.on("accountChanged", (account) => {
     setWalletAddress(account[0]);
     console.log(account[0]);
   })
}else {
  // Metamask is not installed
  setWalletAddress("");
  console.log("Please install Metamask to connect your wallet");

}
};

  return (
    <header className="fixed top-0 w-full bg-white z-50 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={kara} alt="Logo" className="w-16 h-auto" />
          </Link>

          {/* Categories with Dropdown */}
          <div className="relative ">
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
                  <li><Link to="/fashion" className="block hover:text-purple-600">Fashion</Link></li>
                  <li><Link to="/home&garden" className="block hover:text-purple-600">Home & Gardens</Link></li>
                </ul>
              </div>
            )}
          </div>

          {/* Stores & About Us Links */}
          {navItems.map(({ link, title }, index) => (
            <Link
              key={index}
              to={link}
              className={`text-lg font-medium text-gray-700 hover:text-purple-600 transition ${
                location.pathname === link ? "text-purple-700 font-semibold" : ""
              }`}
            >
              {title}
            </Link>
          ))}
        </div>

        {/* Middle Section - Search Bar with Gradient Border */}
        <div className="flex-grow max-w-sm ml-auto relative">
          <input
            type="text"
            placeholder=" Search product, and stores"
            className="w-full p-2 border-none rounded-full focus:outline-none placeholder-gray-500 px-4 bg-white"
            style={{
              border: "1.5px solid transparent",
              borderRadius: "20px",
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(90deg, #FFA5A5 0%, #A044FF 29%, #FFA5A5 73%, #A044FF 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          />
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-2 text-xl text-gray-700 ml-6">

          {/* Non-Custodial Login */}
        
          <button className="hover:bg-purple-700 cursor-pointer transition bg-purple-900 text-white px-2 py-1 font-small rounded-2xl " onClick={connectWallet}>
            {walletAddress && walletAddress.length > 0 ? `Connected: ${walletAddress.substring(0,6)}...${walletAddress.substring(38)}` : "Connect Wallet"}
          </button>

          {/* Notification*/}
          <button className="relative hover:text-purple-600 cursor-pointer transition">
            <IoMdNotifications />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Shopping Cart */}
          <button className="relative hover:text-purple-600 cursor-pointer transition">
            <IoMdCart />
            {/* Cart Badge */}
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Header;
