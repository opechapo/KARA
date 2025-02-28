import React from "react";
import { FaLaptop, FaMobileAlt, FaHome, FaTshirt, FaCar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const categories = [
  { name: "Electronics", icon: <FaLaptop />, link: "/electronics" },
  { name: "Mobile Phones & Tabs", icon: <FaMobileAlt />, link: "/mobilephoneandtabs" },
  { name: "Vehicles", icon: <FaCar />, link: "/vehicles" },
  { name: "Fashion", icon: <FaTshirt />, link: "/fashion" },
  { name: "Home & Gardens", icon: <FaHome />, link: "/homeandgarden" },
  
 
];

const CategorySideBar = () => {
  return (
    <div className="w-64 bg-white shadow-md rounded-lg p-4">
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li key={index} className="rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <Link to={category.link} className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 text-lg">{category.icon}</span>
                <span className="text-gray-600 font-medium">{category.name}</span>
              </div>
              <IoIosArrowForward className="text-gray-500" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySideBar;
