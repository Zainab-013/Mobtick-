import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://mobtick-backend.onrender.com/api/products"; 

function ViewProduct() {
  const navigate = useNavigate();
const [darkMode] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Data Fetching Logic (FIXED: Extracts array from response object) ---
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json(); 
      
      // The fix: Extract the 'products' array from the result object
      if (result.success && Array.isArray(result.products)) {
          setProducts(result.products); 
      } else {
          throw new Error(result.msg || "Invalid data format received from server.");
      }
      
    } catch (err) {
      setError("Failed to fetch products. Check if the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []); 

  // --- DELETE Functionality ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok) {
        // Remove the deleted product from the local state
        setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
        alert(result.msg); 
      } else {
        throw new Error(result.msg || "Deletion failed on server.");
      }
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
      console.error("Delete Error:", err);
    }
  };
  
  // --- UPDATE Functionality ---
  const handleUpdate = (id) => {
    // Navigates to the edit page with the product ID
    navigate(`/manageproduct/${id}`); 
  };

  if (loading) {
    return <div className="text-center p-10 text-xl text-black dark:text-white dark:bg-black/90 min-h-screen">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-xl text-red-500 dark:bg-black/90 min-h-screen">{error}</div>;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* ... (Your JSX remains the same, using product._id for key and actions) ... */}
      <div className="min-h-screen bg-white dark:bg-black/90 text-black dark:text-white font-sans transition-all duration-500">
        <header className={`flex items-center justify-between border-b border-black dark:border-white px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${animateHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="MOBTICK Logo" className="h-10 w-10 rounded-full" />
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">MOBTICK</span>
          </div>
          {/* ... (Mode Toggle and Logout buttons) ... */}
        </header>
        <div className={`text-center mt-8 mb-6 transition-all duration-700 ${animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl font-semibold text-black dark:text-white">View Product ({products.length})</h2>
        </div>
        <main className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 transition-all duration-700 ${animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {products.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md border border-black dark:border-white hover:shadow-xl hover:scale-105 transition flex flex-col">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex justify-center border-b border-gray-300 dark:border-gray-600">
                <img src={product.imageUrl} alt={product.description} className="h-48 object-contain" />
              </div>
              <div className="mt-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.brandName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{product.description}</p>
                <p className="mt-3 text-2xl font-bold text-black dark:text-white">₹ {product.price}</p>
                {/* ... (Discount and Availability display) ... */}
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button onClick={() => handleDelete(product._id)} className="text-sm sm:text-lg font-bold bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-700 transition">DELETE</button>
                <button onClick={() => handleUpdate(product._id)} className="text-sm sm:text-lg font-bold bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-blue-700 transition">UPDATE</button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default ViewProduct;