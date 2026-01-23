import React, { useState, useEffect } from "react";
import { Sun, Moon, TrendingUp, ShoppingCart, DollarSign, CreditCard, Package, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Statistics() {
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://mobtick-backend.onrender.com/api/order/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.stats);
        console.log('✅ Statistics loaded:', result.stats);
      } else {
        setError(result.message || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    navigate("/dashboard");
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get month name
  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-${color}-500 dark:border-${color}-400`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
          {subtext && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`bg-${color}-100 dark:bg-${color}-900 p-4 rounded-full`}>
          <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "dark bg-black/90 text-white" : "bg-white text-black"
      }`}
    >
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-black dark:border-white bg-black transition-all duration-500">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="MOBTICK Logo" className="h-10 w-10 rounded-full" />
          <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">
            MOBTICK STATISTICS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="text-xs sm:text-sm text-white hover:underline"
          >
            {darkMode ? (
              <>
                <Sun className="inline w-4 h-4 mr-1 text-yellow-400" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="inline w-4 h-4 mr-1 text-gray-300" /> Dark Mode
              </>
            )}
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
          >
            LOGOUT
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold mb-6"
        >
          Dashboard Overview
        </motion.h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading statistics...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <button 
              onClick={fetchStatistics}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Grid */}
        {!loading && !error && stats && (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={ShoppingCart}
                color="blue"
                subtext={`${stats.recentOrders} in last 7 days`}
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                color="green"
                subtext="From successful orders"
              />
              <StatCard
                title="Pending Revenue"
                value={formatCurrency(stats.pendingRevenue)}
                icon={AlertCircle}
                color="yellow"
                subtext="COD & Pending payments"
              />
              <StatCard
                title="Avg Order Value"
                value={formatCurrency(stats.avgOrderValue)}
                icon={TrendingUp}
                color="purple"
                subtext="Per successful order"
              />
            </div>

            {/* Order Status & Payment Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-black dark:border-white"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Package className="mr-2 w-6 h-6" />
                  Order Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Successful Orders</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.successfulOrders}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(stats.successfulOrders / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600 dark:text-gray-400">Pending Orders</span>
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {stats.pendingOrders}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600 dark:text-gray-400">Failed Orders</span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {stats.failedOrders}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(stats.failedOrders / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Mode */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-black dark:border-white"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="mr-2 w-6 h-6" />
                  Payment Methods
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Online Payments</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.onlineOrders}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(stats.onlineOrders / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600 dark:text-gray-400">Cash on Delivery</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.codOrders}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(stats.codOrders / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Online Preference</span>
                      <span className="font-bold">
                        {Math.round((stats.onlineOrders / stats.totalOrders) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-black dark:border-white mb-8"
            >
              <h3 className="text-xl font-bold mb-4">Top Selling Products</h3>
              {stats.topProducts.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No products sold yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">Product Name</th>
                        <th className="px-4 py-3 text-center">Units Sold</th>
                        <th className="px-4 py-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topProducts.map((product, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-3">{product._id || 'Unknown'}</td>
                          <td className="px-4 py-3 text-center font-semibold">
                            {product.totalQuantity}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(product.totalRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Monthly Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-black dark:border-white"
            >
              <h3 className="text-xl font-bold mb-4">Monthly Revenue (Last 6 Months)</h3>
              {stats.monthlyRevenue.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No revenue data available</p>
              ) : (
                <div className="space-y-3">
                  {stats.monthlyRevenue.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 min-w-[100px]">
                        {getMonthName(month._id.month)} {month._id.year}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(month.revenue / Math.max(...stats.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white min-w-[120px] text-right">
                        {formatCurrency(month.revenue)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-4 min-w-[80px] text-right">
                        ({month.orders} orders)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}

export default Statistics;
