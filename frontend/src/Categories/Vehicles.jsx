import React from "react";
import { Link } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import CategorySideBar from "../Layouts/CategorySideBar";
import Vehicle1 from "../assets/Vehicle1.png";
import Vehicle2 from "../assets/Vehicle2.png";
import Vehicle3 from "../assets/Vehicle3.png";
import Vehicle4 from "../assets/Vehicle4.png";
import Vehicle5 from "../assets/Vehicle5.png";


const subCategories = [
  { name: "Cars", img: Vehicle1, link: "/cars" },
  { name: "Bus & Minibus", img: Vehicle2, link: "/bus&minibus" },
  { name: "Motorcycle & Tricycle", img: Vehicle3, link: "/motorcycleandtricycle" },
  { name: "Trucks & Trailers", img: Vehicle4, link: "/vehicles/trucks-trailers" },
  { name: "Heavy Duty", img: Vehicle5, link: "/vehicles/heavy-duty" },
  
];

const Vehicles = () => {
  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <div className="flex min-h-screen px-6 py-4">
        {/* Sidebar */}
        <div className="w-1/4 min-h-screen border-r border-gray-300">
          <CategorySideBar />
        </div>

        {/* Vehicles Content */}
        <div className="w-3/4 px-10 pt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Vehicles</h2>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-3 gap-6">
            {subCategories.map((category, index) => (
              <Link key={index} to={category.link} className="text-center cursor-pointer">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-300 hover:border-purple-500 transition">
                  <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-lg font-medium text-gray-800">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Vehicles;
