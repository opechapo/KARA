import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdMenu, IoMdClose, IoMdPerson, IoMdNotifications, IoMdCart, IoMdPersonAdd } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import kara from "../assets/KARA.png";


const navItems = [
  { url: "/stores", title: "Stores" },
  { url: "/about", title: "About Us" },
];

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 ">
      <nav className="container mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={kara} alt="Logo" className="w-16 h-auto" />
          </Link>

          {/* Categories with Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 text-lg font-medium text-gray-700 hover:text-indigo-600 transition"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <span>Categories</span>
              <FaBars className="text-xl" />
            </button>
            {categoryOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md p-4 w-48">
                <ul className="space-y-2 text-gray-700">
                  <li><Link to="/category1" className="block hover:text-indigo-600">Category 1</Link></li>
                  <li><Link to="/category2" className="block hover:text-indigo-600">Category 2</Link></li>
                  <li><Link to="/category3" className="block hover:text-indigo-600">Category 3</Link></li>
                </ul>
              </div>
            )}
          </div>

          {/* Stores & About Us Links */}
          {navItems.map(({ url, title }, index) => (
            <Link
              key={index}
              to={url}
              className={`text-lg font-medium text-gray-700 hover:text-indigo-600 transition ${
                location.pathname === url ? "text-indigo-700 font-semibold" : ""
              }`}
            >
              {title}
            </Link>
          ))}
        </div>

        {/* Middle Section - Search Bar */}
        <div className="flex-grow-7 max-w-md">
          <input
            type="text"
            placeholder="Search product, and stores"
            className="w-min p-2 border border-gray-300 rounded-full focus:outline-none  placeholder-gray-500 px-4"
          />
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-6 text-2xl text-gray-700">
          {/* Non-Custodial Login */}
          <button className="hover:text-indigo-600 transition">
            <IoMdPersonAdd />
          </button>

          {/* Notifications Bell */}
          <button className="relative hover:text-indigo-600 transition">
            <IoMdNotifications />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Shopping Cart */}
          <button className="relative hover:text-indigo-600 transition">
            <IoMdCart />
            {/* Cart Badge */}
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Header;
