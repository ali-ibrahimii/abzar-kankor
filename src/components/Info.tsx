import React from "react";

const Info = () => {
  return (
    <div className="w-full h-40 mb-10 flex justify-center space-x-16 text-white flex-row items-center bg-blue-700">
      <div className="flex justify-center flex-row items-center">
        <h1 className="font-light text-[4em]">10</h1>
        <p className="w-20 pt-2 leading-6">Years fo Experience</p>
      </div>
      <div className="flex justify-center flex-row items-center">
        <h1 className="font-light text-[4em]">40K+</h1>
        <p className="w-24 pt-2 leading-6">Students in the country</p>
      </div>
      <div className="flex justify-center flex-row items-center">
        <h1 className="font-light text-[4em]">100K+</h1>
        <p className="w-20 leading-6 pt-2">Books in the Library</p>
      </div>
      <div className="flex justify-center flex-row items-center">
        <h1 className="font-light text-[4em]">50</h1>
        <p className="w-17 pt-2 leading-6">Teacher in to help</p>
      </div>
    </div>
  );
};

export default Info;
