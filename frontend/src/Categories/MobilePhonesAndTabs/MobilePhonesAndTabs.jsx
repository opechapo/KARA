import React from "react";
import { Link } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import CategorySideBar from "../Layouts/CategorySideBar";
import mobile1 from "../assets/mobile1.png";
import mobile2 from "../assets/mobile2.png";
import mobile3 from "../assets/mobile3.png";
import mobile4 from "../assets/mobile4.png";


const subCategories = [
  { name: "Mobile Phones", img: mobile1, link: "#" },
  { name: "Tablets", img: mobile2, link: "#" },
  { name: "Smart Watch", img: mobile3, link: "#" },
  { name: "Accessories for Phone and Tablets", img: mobile4, link: "#" }
];

const mobilePhonesAndTabs = () => {
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Mobile Phones & Tabs</h2>

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

export default mobilePhonesAndTabs;
