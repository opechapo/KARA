import React from "react";
import { Link } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import CategorySideBar from "../Layouts/CategorySideBar";
import HomeGarden1 from "../assets/Home&Garden1.png";
import HomeGarden2 from "../assets/Home&Garden2.png";
import HomeGarden5 from "../assets/Home&Garden5.png";
// import HomeGarden5 from "../assets/Home&Garden5.png";
import HomeGarden4 from "../assets/Home&Garden4.png";

const subCategories = [
  { name: "Furniture", img: HomeGarden1, link: "/furnitures" },
  { name: "Home Appliance", img: HomeGarden2, link: "/homeappliance" },
  { name: "Kitchen Appliance", img: HomeGarden5, link: "/kitchenappliances" },
  { name: "Home Accessories", img: HomeGarden4, link: "#" },
];

const HomeGardens = () => {
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

        {/* Home & Gardens Content */}
        <div className="w-3/4 px-10 pt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Home & Gardens</h2>

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

export default HomeGardens;
