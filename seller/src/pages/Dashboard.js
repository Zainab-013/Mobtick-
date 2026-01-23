import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaChartLine, FaShoppingBag } from "react-icons/fa";

export default function Dashboard() {
  const [animateMain, setAnimateMain] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [darkMode, setDarkMode] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-black/90 text-black dark:text-white font-sans transition-all duration-500">

        {/* Header */}
        <header
          className={`flex items-center justify-between border-b border-black dark:border-white px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
            animateHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="MOBTICK Logo" className="h-10 w-10 rounded-full" />
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">
              MOBTICK
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xs sm:text-sm text-white hover:underline"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-20 px-4 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* CARD - Manage Product */}
          <div
            onClick={() => navigate("/ManageProduct")}
            className="group w-full h-56 sm:h-60 rounded-xl border-2 border-black dark:border-white bg-black hover:bg-gray-900 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center font-bold text-white text-base sm:text-lg cursor-pointer"
          >
            <FaBoxOpen
              size={38}
              className="mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-400"
            />
            MANAGE PRODUCT
          </div>

          {/* CARD - View Product */}
          <div
            onClick={() => navigate("/ViewProduct")}
            className="group w-full h-56 sm:h-60 rounded-xl border-2 border-black dark:border-white bg-black hover:bg-gray-900 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center font-bold text-white text-base sm:text-lg cursor-pointer"
          >
            <FaShoppingBag
              size={38}
              className="mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-green-400"
            />
            VIEW PRODUCT
          </div>

          {/* CARD - View Customer */}
          <div
            onClick={() => navigate("/ViewCustomer")}
            className="group w-full h-56 sm:h-60 rounded-xl border-2 border-black dark:border-white bg-black hover:bg-gray-900 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center font-bold text-white text-base sm:text-lg cursor-pointer"
          >
            <FaUsers
              size={38}
              className="mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-400"
            />
            VIEW CUSTOMER
          </div>

          {/* CARD - Revenue Overview */}
          <div
            onClick={() => navigate("/statistics")}
            className="group w-full h-56 sm:h-60 rounded-xl border-2 border-black dark:border-white bg-black hover:bg-gray-900 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center font-bold text-white text-base sm:text-lg cursor-pointer"
          >
            <FaChartLine
              size={38}
              className="mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-400"
            />
             View Statistics
          </div>
        </main>
      </div>
    </div>
  );
}
