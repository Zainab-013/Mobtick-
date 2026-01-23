import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ViewCustomer() {
  const [darkMode, setDarkMode] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch customers from database
  useEffect(() => {
    fetchCustomers();
  }, []);
// In ViewCustomer.js - Update this line
const fetchCustomers = async () => {
  try {
    setLoading(true);
    // Change this URL:
    const response = await fetch('http://localhost:5000/api/order/customers');
    const result = await response.json();
    
    if (result.success) {
      setCustomers(result.data);
    } else {
      setError('Failed to load customer data');
    }
  } catch (err) {
    console.error('Error fetching customers:', err);
    setError('Failed to connect to server');
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

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

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
            MOBTICK
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

      {/* Main Section */}
      <main className="p-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-extrabold mb-6 text-center"
        >
          View Customer Orders
        </motion.h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading customer data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchCustomers}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="overflow-x-auto rounded-xl shadow-lg border-2 border-black dark:border-white"
          >
            {customers.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-300">No customer orders found</p>
              </div>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-400 text-white"}`}>
                  <tr>
                    <th className="px-4 py-3 border border-black dark:border-white">Customer Name</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Email</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Phone No</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Address</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Brand Name</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Type of Watch</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Quantity</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Order Date</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Delivery Status</th>
                    <th className="px-4 py-3 border border-black dark:border-white">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        darkMode 
                          ? index % 2 === 0 ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900 hover:bg-gray-700"
                          : index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
                      } transition`}
                    >
                      <td className="px-4 py-3 border border-black dark:border-white">{customer.customerName}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">{customer.email}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">{customer.phone}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">{customer.address}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">{customer.brandName}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">{customer.watchType}</td>
                      <td className="px-4 py-3 border border-black dark:border-white text-center">{customer.quantityPurchased}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">{formatDate(customer.orderDate)}</td>
                      <td className="px-4 py-3 border border-black dark:border-white">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          customer.deliveryStatus === 'Delivered' ? 'bg-green-200 text-green-800' :
                          customer.deliveryStatus === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                          customer.deliveryStatus === 'Processing' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {customer.deliveryStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 border border-black dark:border-white font-semibold">
                        {formatCurrency(customer.totalAmount)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default ViewCustomer;
