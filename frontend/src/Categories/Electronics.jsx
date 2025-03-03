import React from "react";
import { Link } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import CategorySideBar from "../Layouts/CategorySideBar";
import Electronics1 from "../assets/Electronics1.png";
import Electronics2 from "../assets/Electronics2.png";
import Electronics3 from "../assets/Electronics3.png";
import Electronics4 from "../assets/Electronics4.png";
import Electronics5 from "../assets/Electronics5.png";
import Electronics6 from "../assets/Electronics6.png";

const subCategories = [
  { name: "Laptops & Computers", img: Electronics1, link: "/electronics/laptops" },
  { name: "TV & Projector", img: Electronics2, link: "/electronics/tv-projector" },
  { name: "Audio & Music Equipment", img: Electronics3, link: "/electronics/audio" },
  { name: "Cameras", img: Electronics4, link: "/electronics/cameras" },
  { name: "Printer & Scanner", img: Electronics5, link: "/electronics/printers" },
  { name: "Video Games & Consoles", img: Electronics6, link: "/electronics/games" },
];

const Electronics = () => {
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

        {/* Electronics Content */}
        <div className="w-3/4 px-10 pt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Electronics:</h2>

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
      <Footer/>
    </>
  );
};

export default Electronics;
