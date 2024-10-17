import React from "react";
import Link from "next/link";
import QuickDrawPlay from "./play/page";

const QuickDrawStart = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-[#2a0e20] border-pink-500 p-16 rounded-lg shadow-md">
        <h2 className="text-3xl text-pink-500 text-center">Quick Draw</h2>
        <Link
          href="/quickDraw/play"
          className="flex text-xl justify-center mt-8 border border-pink-500 bg-pink-500 text-white hover:bg-transparent hover:text-pink-500 px-4 py-2 rounded"
        >
          Play
        </Link>
      </div>
    </div>
  );
};

export default QuickDrawStart;
