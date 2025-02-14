import React from "react";
import { FaLaptop, FaMobileAlt, FaHome, FaTshirt, FaCar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const categories = [
  { name: "Electronics", icon: <FaLaptop />, link: "/electronics" },
  { name: "Smart Phones & Tabs", icon: <FaMobileAlt />, link: "/smartphones" },
  { name: "Home & Gardens", icon: <FaHome />, link: "/home-gardens" },
  { name: "Fashion", icon: <FaTshirt />, link: "/fashion" },
  { name: "Vehicles", icon: <FaCar />, link: "/vehicles" },
];

const CategorySideBar = () => {
  return (
    <div className="w-64 bg-white shadow-md rounded-lg p-4 ">
      {/* <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2> */}
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li
            key={index}
            className="flex items-center justify-between px-4 py-2  rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-gray-600 text-lg">{category.icon}</span>
              <span className="text-gray-800 font-medium">{category.name}</span>
            </div>
            <IoIosArrowForward className="text-gray-500" />
          </li>
        ))}
      </ul>
    </div>
  
  );
};

export default CategorySideBar;
