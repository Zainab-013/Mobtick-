import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function RevenueOverview() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);

  // Example sales data by brand for all 12 months
  const data = [
    { month: "Jan", Titan: 4000, Fossil: 2400, Casio: 2000 },
    { month: "Feb", Titan: 3000, Fossil: 1398, Casio: 2210 },
    { month: "Mar", Titan: 5000, Fossil: 3800, Casio: 2290 },
    { month: "Apr", Titan: 2780, Fossil: 3908, Casio: 2000 },
    { month: "May", Titan: 4890, Fossil: 4800, Casio: 2181 },
    { month: "Jun", Titan: 2390, Fossil: 3800, Casio: 2500 },
    { month: "Jul", Titan: 3490, Fossil: 4300, Casio: 2100 },
    { month: "Aug", Titan: 4200, Fossil: 3100, Casio: 2800 },
    { month: "Sep", Titan: 3800, Fossil: 2900, Casio: 2700 },
    { month: "Oct", Titan: 4600, Fossil: 3700, Casio: 3100 },
    { month: "Nov", Titan: 5200, Fossil: 4000, Casio: 3300 },
    { month: "Dec", Titan: 6100, Fossil: 4500, Casio: 3900 },
  ];

  // Add total sales for each month
  const dataWithTotal = data.map((item) => ({
    ...item,
    Total: item.Titan + item.Fossil + item.Casio,
  }));

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
        
        {/* Navbar */}
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
              onClick={() => navigate("/dashboard")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Page Heading */}
        <div
          className={`text-center mt-8 mb-6 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            Revenue Overview
          </h2>
        </div>

        {/* Graph Section */}
        <main
          className={`px-6 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md border border-black dark:border-white">
            <h3 className="text-xl font-bold mb-4 text-center">
              Monthly Sales by Brand
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                key={darkMode ? "dark" : "light"} // 🔥 re-renders on theme change
                data={dataWithTotal}
                margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                {/* X Axis */}
                <XAxis
                  dataKey="month"
                  tickMargin={15}
                  tick={{ angle: -30, textAnchor: "end" }}
                  label={{
                    value: "Months",
                    position: "outsideBottom",
                    dy: 35,
                  }}
                />

                {/* Y Axis */}
                <YAxis
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  label={{
                    value: "Sales (₹)",
                    angle: -90,
                    position: "insideLeft",
                    dx: -40,
                    dy: 50,
                  }}
                  tickMargin={10}
                />

                <Tooltip
  formatter={(value) => `₹${value.toLocaleString()}`}
  contentStyle={{
    backgroundColor: darkMode ? "#1f2937" : "#ffffff", // dark gray / white
    color: darkMode ? "#ffffff" : "#000000", // text color
    borderRadius: "8px",
    border: "1px solid #8884d8",
  }}
  labelStyle={{
    color: darkMode ? "#f3f4f6" : "#111827", // label color
    fontWeight: "bold",
  }}
/>

<Legend
  verticalAlign="top"
  wrapperStyle={{
    color: darkMode ? "#ffffff" : "#000000", // legend text color
    marginBottom: "20px",
  }}
/>


                {/* Brand Sales Lines with animation */}
                <Line type="monotone" dataKey="Titan" stroke="#8884d8" strokeWidth={2} isAnimationActive />
                <Line type="monotone" dataKey="Fossil" stroke="#82ca9d" strokeWidth={2} isAnimationActive />
                <Line type="monotone" dataKey="Casio" stroke="#ffc658" strokeWidth={2} isAnimationActive />

                {/* Total Sales Line with animation */}
                <Line
                  type="monotone"
                  dataKey="Total"
                  stroke="#ff0000"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RevenueOverview;