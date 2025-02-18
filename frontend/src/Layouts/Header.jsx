import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdNotifications, IoMdCart, IoMdPersonAdd } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import kara from "../assets/KARA.png";

const navItems = [
  { title: "Stores", link: "#" },
  { title: "Collections", link: "#" },
  {  title: "About Us", link: "/aboutus" },
];

const Header = () => {
  const location = useLocation();
  const [categoryOpen, setCategoryOpen] = useState(false);

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
              className="flex items-center space-x-2 text-lg font-medium text-gray-700 cursor-pointer hover:text-indigo-600 transition"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <FaBars className="text-xl" />
              <span>Categories</span>
            </button>
            {categoryOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md p-4 w-48">
                <ul className="space-y-2 text-gray-700">
                  <li><Link to="/electronics" className="block hover:text-indigo-600">Electronics</Link></li>
                  <li><Link to="/smartphonetab" className="block hover:text-indigo-600">Smart Phones & Tabs</Link></li>
                  <li><Link to="/vehicles" className="block hover:text-indigo-600">Vehicles</Link></li>
                  <li><Link to="/fashion" className="block hover:text-indigo-600">Fashion</Link></li>
                  <li><Link to="/home&garden" className="block hover:text-indigo-600">Home & Gardens</Link></li>
                </ul>
              </div>
            )}
          </div>

          {/* Stores & About Us Links */}
          {navItems.map(({ link, title }, index) => (
            <Link
              key={index}
              to={link}
              className={`text-lg font-medium text-gray-700 hover:text-indigo-600 transition ${
                location.pathname === link ? "text-indigo-700 font-semibold" : ""
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
            placeholder="🔍 Search product, and stores"
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
        <div className="flex items-center space-x-6 text-2xl text-gray-700 ml-6">
          {/* Non-Custodial Login */}
          <button className="hover:text-indigo-600 cursor-pointer transition">
            <IoMdPersonAdd />
          </button>

          {/* Notifications Bell */}
          <button className="relative hover:text-indigo-600 cursor-pointer transition">
            <IoMdNotifications />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Shopping Cart */}
          <button className="relative hover:text-indigo-600 cursor-pointer transition">
            <IoMdCart />
            {/* Cart Badge */}
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Header;
