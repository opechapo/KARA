import React, { useState } from "react";
import Header from "./Layouts/Header";
import EnnyCapStore from "./assets/EnnyCapStore.png";
import AnotherStore from "./assets/AnotherStore.png";
import NewArrivals1 from "./assets/NewArrivals1.png";
import NewArrivals2 from "./assets/NewArrivals2.png";
import NewArrivals3 from "./assets/NewArrivals3.png";
import NewArrivals4 from "./assets/NewArrivals4.png";
import NewArrivals5 from "./assets/NewArrivals5.png";
import Categories1 from "./assets/Categories1.png";
import Categories2 from "./assets/Categories2.png";
import Categories3 from "./assets/Categories3.png";
import Categories4 from "./assets/Categories4.png";
import Categories5 from "./assets/Categories5.png";
import Electronics1 from "./assets/Electronics1.png";
import Electronics2 from "./assets/Electronics2.png";
import Electronics3 from "./assets/Electronics3.png";
import Electronics4 from "./assets/Electronics4.png";
import Electronics5 from "./assets/Electronics5.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const storeData = [
  { img: EnnyCapStore, name: "EnnyCap Store" },
  { img: AnotherStore, name: "Another Store" },
];

const newArrivals = [
  { img: NewArrivals1, price: "0.05 ETH", desc: "Stylish Yahweh Shirt" },
  { img: NewArrivals2, price: "0.1 ETH", desc: "Single Chair" },
  { img: NewArrivals3, price: "0.08 ETH", desc: "Pro Sport Bicycle" },
  { img: NewArrivals4, price: "0.12 ETH", desc: "Ikea Plum" },
  { img: NewArrivals5, price: "0.07 ETH", desc: "Rayban Black sunglass " },
];

const categories = [
  { img: Categories1, name: "Vehicles" },
  { img: Categories2, name: "Smartphones & Tablets" },
  { img: Categories3, name: "Home & Gardens" },
  { img: Categories4, name: "Fashion" },
  { img: Categories5, name: "Electronics" },
];

const electronics = [
  { img: Electronics1, name: "Laptops & Computers" },
  { img: Electronics2, name: "Television & Projector" },
  { img: Electronics3, name: "Audio & Music Equipment" },
  { img: Electronics4, name: "Photos & Video Cameras" },
  { img: Electronics5, name: "Printers & Scanners" },
];

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % storeData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? storeData.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      {/* Header Section */}
      <Header />

      {/* Full-Screen Image Slider */}
      <section className="relative w-full h-screen">
        <img
          src={storeData[currentIndex].img}
          alt="Store"
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-20 left-16 text-left text-white">
          <p className="text-4xl font-bold drop-shadow-lg">
            {storeData[currentIndex].name}
          </p>
          <button className="mt-4 px-6 py-3 bg-purple-900 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition cursor-pointer">
            Shop Now
          </button>
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2  bg-opacity-50 p-3 rounded-full cursor-pointer text-white hover:bg-opacity-70 transition"
        >
          <IoIosArrowBack size={40} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 p-3 rounded-full text-white cursor-pointer hover:bg-opacity-70 transition"
        >
          <IoIosArrowForward size={40} />
        </button>
      </section>

      {/* New Arrivals Section */}
      <section className="container mx-auto my-12 px-6">
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-6">
          New Arrivals
        </h2>

        <div className="flex overflow-x-auto space-x-6 pb-4 cursor-pointer scrollbar-hide">
          {newArrivals.map((item, index) => (
            <div key={index} className="min-w-[250px]">
              <div className="w-60 h-60 bg-gray-100 rounded-lg overflow-hidden ">
                <img
                  src={item.img}
                  alt="New Arrival"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg mt-2">
                <p className="text-lg font-semibold text-gray-900">{item.price}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto my-12 px-6 ">
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-6">
          Categories
        </h2>

        <div className="flex overflow-x-auto space-x-6 pb-4  cursor-pointer scrollbar-hide ">
          {categories.map((category, index) => (
            <div key={index} className="min-w-[250px]">
              <div className="w-60 h-60 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={category.img}
                  alt="Category"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg mt-2">
                <p className="text-lg font-semibold text-gray-900">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Electronics Section */}
      <section className="container mx-auto my-12 px-6">
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-6">
          Electronics
        </h2>

        <div className="flex overflow-x-auto space-x-6 pb-4 cursor-pointer scrollbar-hide">
          {electronics.map((item, index) => (
            <div key={index} className="min-w-[250px]">
              <div className="w-60 h-60 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.img}
                  alt="Electronics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg mt-2">
                <p className="text-lg font-semibold text-gray-900">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between px-6">
          <p className="text-lg font-semibold">&copy; 2025 KARA . All rights reserved.</p>
          <nav className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Contact Us</a>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
