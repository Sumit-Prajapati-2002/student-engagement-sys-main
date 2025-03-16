import React from "react";
import Link from "next/link";

function HomeButton() {
  return (
    <Link
      href="/"
      className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all duration-300 w-full py-2 rounded-xl flex items-center justify-center gap-2"
    >
      <i className="fas fa-home"></i>
      <span>Back to Home</span>
    </Link>
  );
}

export default HomeButton;
