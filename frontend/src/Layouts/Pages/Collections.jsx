import React from "react";
import Header from "../Header";

const collections = [
  { name: "Cubanna Autos", link: "#" },
  { name: "Smadeh Store", link: "#" },
  { name: "Emeka & Sons Electronics", link: "#" },
];

const Collections = () => {
  return (
    <>
      {/* {Header} */}
     <div>
     <Header />
     </div>
      
      {/* {Body} */}
      <div className="mt-20 px-6">
        <h1 className="text-5xl font-bold">Collections:</h1>
        <div className="mt-6 space-y-4">
       {collections.map((collection,index) => (
        <p key= {index} className="text-2xl text-purple-600 hover:underline">
          <a href={collection.link}>{collection.name}</a>
        </p>
       ))}
      </div>
      </div>
      
    </>
  );
};

export default Collections;
