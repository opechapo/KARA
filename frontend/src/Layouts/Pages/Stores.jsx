import React from "react";
import Header from "../Header";

const stores = [
  { name: "Cubanna Autos", link: "#" },
  { name: "Smadeh Store", link: "#" },
  { name: "Emeka & Sons Electronics", link: "#" },
];

const Stores = () => {
  return (
    <>
      {/* {Header} */}
      <Header />
      
      {/* {Body} */}
      <div className="mt-20 px-6">
        <h1 className="text-5xl font-bold">Stores:</h1>
        <div className="mt-6 space-y-4">
       {stores.map((store,index) => (
        <p key= {index} className="text-2xl text-purple-600 hover:underline">
          <a href={store.link}>{store.name}</a>
        </p>
       ))}
       
      </div>
      </div>
      
    </>
  );
};

export default Stores;
