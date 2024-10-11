import React from "react";

const quickDrawPlay = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h2 className="text-3xl text-pink-500 text-center mb-5">Quick Draw</h2>
      <div className="border-2 border-pink-500 p-10 rounded-lg shadow-md w-[70vw]">
        <div className="flex justify-between">
          <p className="text-xl">Draw: promp goes here blah</p>
          <p className="text-xl">time goes here</p>
        </div>
      </div>
    </div>
  );
};

export default quickDrawPlay;
