import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageProduct = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [showShimmer, setShowShimmer] = useState(true);

  // State for all form fields
  const [formData, setFormData] = useState({
    title: '',
    brandName: '',
    topDeals: '',
    discount: '',
    price: '',
    gender: 'Male',
    typeOfWatch: 'Select Type',
    availability: 'In Stock',
    startDate: '',
    endDate: '',
    productImage: null,
  });

  // State for upload feedback
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Create a new FormData object to send the file and form data
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: data, // Note: no 'Content-Type' header is needed with FormData
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage(result.msg);
        // Clear the form after successful upload
        setFormData({
          title: '',
          brandName: '',
          topDeals: '',
          discount: '',
          price: '',
          gender: 'Male',
          typeOfWatch: 'Select Type',
          availability: 'In Stock',
          startDate: '',
          endDate: '',
          productImage: null,
        });
      } else {
        setError(result.msg);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLogout = () => navigate('/');

  useEffect(() => {
    const timer = setTimeout(() => setShowShimmer(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 relative overflow-hidden">

        {/* Shimmer background */}
        {showShimmer && (
          <div className="absolute inset-0 z-0 animate-background-shimmer bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 opacity-60"></div>
        )}

        {/* Navbar */}
        <nav className="bg-black border-2 border-white shadow-lg px-4 sm:px-6 py-3 flex justify-between items-center dark:text-white z-10 relative animate-slide-down">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Mobtick Logo" className="h-10 w-10 rounded-full" />
            <h1 className="text-2xl font-bold text-white">Mobtick</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="text-xs text-gray-300 hover:underline transition">
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button onClick={handleLogout} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-300">
              Logout
            </button>
          </div>
        </nav>

        {/* Main Form */}
        <div className="flex justify-center mt-10 px-4">
          <div className="w-full max-w-3xl bg-[#0b1320] text-white border-2 rounded-xl shadow-xl p-8 animate-fade-in border border-white">

            <h2 className="text-2xl font-semibold text-center mb-6">Manage Product</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {[
                { label: 'Title', type: 'text', name: 'title' },
                { label: 'Brand Name', type: 'text', name: 'brandName' },
                { label: 'Top Deals', type: 'text', name: 'topDeals' },
                { label: 'Discount (%)', type: 'number', min: 0, max: 100, name: 'discount' },
                { label: 'Price', type: 'number', min: 0, name: 'price' },
              ].map((field, idx) => (
                <div key={idx}>
                  <label htmlFor={field.name} className="block mb-1">{field.label}</label>
                  <input
                    id={field.name}
                    type={field.type}
                    min={field.min}
                    max={field.max}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="gender" className="block mb-1">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Unisex</option>
                </select>
              </div>

              <div>
                <label htmlFor="typeOfWatch" className="block mb-1">Type of Watch</label>
                <select id="typeOfWatch" name="typeOfWatch" value={formData.typeOfWatch} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white">
                  <option>Select Type</option>
                  <option>Analog</option>
                  <option>Digital</option>
                  <option>Smart</option>
                  <option>couple</option>
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block mb-1">Availability</label>
                <select id="availability" name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white">
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="startDate" className="block mb-1">Start Date</label>
                  <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2" />
                </div>

                <div className="w-full sm:w-1/2">
                  <label htmlFor="endDate" className="block mb-1">End Date</label>
                  <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2" />
                </div>
              </div>

              <div>
                <label htmlFor="productImage" className="block mb-1">Upload Image</label>
                <input type="file" id="productImage" name="productImage" onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2" />
              </div>
              
              {loading && <p className="text-center text-blue-400">Uploading product...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

              <div className="flex justify-center mt-6">
                <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageProduct;
