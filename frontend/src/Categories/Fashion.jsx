import React from "react";
import { Link } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import CategorySideBar from "../Layouts/CategorySideBar";
import Fashion1 from "../assets/Fashion1.png";
import Fashion2 from "../assets/Fashion2.png";
import Fashion3 from "../assets/Fashion3.png";
import Fashion4 from "../assets/Fashion4.png";
import Fashion5 from "../assets/Fashion5.png";


const subCategories = [
  { name: "Bags", img: Fashion1, link: "/fashion/bags" },
  { name: "Clothing", img: Fashion2, link: "/fashion/clothing" },
  { name: "Jewelry", img: Fashion3, link: "/fashion/jewelry" },
  { name: "Shoes", img: Fashion4, link: "/fashion/shoes" },
  { name: "Cloth Accessories", img: Fashion5, link: "/fashion/accessories" },
];

const Fashion = () => {
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

        {/* Fashion Content */}
        <div className="w-3/4 px-10 pt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Fashion</h2>

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

export default Fashion;
