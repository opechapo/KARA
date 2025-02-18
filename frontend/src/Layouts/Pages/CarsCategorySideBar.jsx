import React from "react";
import { ChevronRight } from "lucide-react";

const vehicleCategories = [
  "Cars",
  "Buses & Micro Buses",
  "Motorcycles & Tricycles",
  "Trucks & Trailers",
  "Others",
];

const CarsCategorySideBar = () => {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg p-4">
      {/* Categories Header */}
      <h2 className="text-xl font-bold text-white bg-blue-600 p-1 rounded-md text-center">
        Categories
      </h2>

      {/* Subheader */}
      <h3 className="text-lg font-semibold text-gray-700 mt-4">Vehicles:</h3>

      {/* Category List */}
      <ul className="mt-2 space-y-2">
        {vehicleCategories.map((category, index) => (
          <li
            key={index}
            className="flex justify-between items-center  p-3 rounded-md cursor-pointer hover:bg-gray-100 transition"
            onClick={() => alert(`Clicked on ${category}`)} // Replace with navigation logic
          >
            <span className="text-gray-700 font-medium">{category}</span>
            <ChevronRight size={20} className="text-gray-500" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarsCategorySideBar;
