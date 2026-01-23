// src/pages/ManageProduct.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Backend API endpoint for products
const API_BASE_URL = 'https://mobtick-backend.onrender.com/api/products'; 

const initialFormData = {
    description: '', brandName: '', topDeals: false, discount: '', 
    price: '', gender: 'Male', // ✅ FIX: Changed 'Men' to 'Male' to match Mongoose schema
    typeOfWatch: 'Select Type', 
    availability: 'In Stock', startDate: '', endDate: '', imageUrl: '',
    dialShape: '', dialColor: '', strapMaterial: '', strapColor: '', 
    caseSize: '', caseMaterial: '', specialEdition: '', discountRange: '',
};

const ManageProduct = () => {
    const navigate = useNavigate();
    const { id: productId } = useParams(); 
    
    const [darkMode, setDarkMode] = useState(true);
    const [showShimmer, setShowShimmer] = useState(true);

    const [formData, setFormData] = useState(initialFormData);

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

    // --- EFFECT: Load data for EDIT mode ---
    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setFormData(initialFormData);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/${productId}`); 
            
            if (!res.ok) {
                const errorResult = await res.json();
                throw new Error(errorResult.msg || `Failed to fetch product with status ${res.status}`);
            }
            
            const result = await res.json();
            const product = result.product || result; 
            
            // Set form data
            setFormData({
                description: product.description || '',
                brandName: product.brandName || '',
                topDeals: product.topDeals || false,
                discount: product.discount !== undefined ? String(product.discount) : '',
                price: product.price !== undefined ? String(product.price) : '',
                gender: product.gender || 'Male', // Use 'Male' as fallback
                typeOfWatch: product.typeOfWatch || 'Select Type',
                availability: product.availability || 'In Stock',
                startDate: formatDate(product.startDate), 
                endDate: formatDate(product.endDate), 
                imageUrl: product.imageUrl || '',
                // Load NEW FIELDS (coalesce to empty string for the UI)
                dialShape: product.dialShape || '',
                dialColor: product.dialColor || '',
                strapMaterial: product.strapMaterial || '',
                strapColor: product.strapColor || '',
                caseSize: product.caseSize || '',
                caseMaterial: product.caseMaterial || '',
                specialEdition: product.specialEdition || '',
                discountRange: product.discountRange || '',
            });
            
        } catch (err) {
            setError(`Error fetching product: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    // Cleanup shimmer effect
    useEffect(() => {
        const timer = setTimeout(() => setShowShimmer(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setError(''); 
        setSuccessMessage('');

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // --- FUNCTION: Handle form submission (POST or PUT) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `${API_BASE_URL}/${productId}` : API_BASE_URL; 
        
        let dataToSend = {
            ...formData,
            discount: Number(formData.discount) || 0,
            price: Number(formData.price) || 0,
        };

        // ✅ CRITICAL FIX: Clean up empty string fields before sending to the Mongoose backend
        Object.keys(dataToSend).forEach(key => {
            // Check if the value is a string and is empty or contains only whitespace
            if (typeof dataToSend[key] === 'string' && dataToSend[key].trim() === '') {
                // Delete the key. Mongoose will then use the 'default: null' rule 
                // and skip enum validation, resolving the errors.
                delete dataToSend[key]; 
            }
        });

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend), // dataToSend now has null/missing values for optional fields
            });

            const result = await res.json();
            
            if (res.ok && result.success) {
                const action = productId ? 'updated' : 'added';
                setSuccessMessage(`Product ${action} successfully!`);
                
                if (!productId) {
                    setFormData(initialFormData);
                }
            } else {
                setError(result.msg || `Failed to ${method === 'PUT' ? 'update' : 'add'} product.`);
            }
        } catch (err) {
            setError('An error occurred. Please check network and server status.');
        } finally {
            setLoading(false);
        }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const handleLogout = () => navigate('/dashboard');

    const pageTitle = productId ? 'Update Product' : 'Add New Product';

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 relative overflow-hidden">
                {showShimmer && (
                    <div className="absolute inset-0 z-0 animate-background-shimmer bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 opacity-60"></div>
                )}
                <nav className="bg-black border-2 border-white shadow-lg px-4 sm:px-6 py-3 flex justify-between items-center dark:text-white z-10 relative animate-slide-down rounded-lg">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Mobtick Logo" className="h-10 w-10 rounded-full" />
                        <h1 className="text-2xl font-bold text-white">Mobtick</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleDarkMode} className="text-xs text-gray-300 hover:underline transition">
                            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        <button onClick={handleLogout} className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition">
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Form Section */}
                <div className="flex justify-center mt-10 px-4">
                    <div className="w-full max-w-5xl bg-[#0b1320] text-white border-2 rounded-xl shadow-xl p-8 animate-fade-in border-white">
                        <h2 className="text-2xl font-semibold text-center mb-6">{pageTitle}</h2>
                        
                        {loading && productId && <p className="text-center text-blue-400 mb-4">Loading product details...</p>}

                        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>

                            {/* Section: Basic Info */}
                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-green-400 mb-2">📌 Basic Info</h3>
                            </div>
                            {[
                                { label: 'Brand Name', type: 'text', name: 'brandName' },
                                { label: 'Description', type: 'text', name: 'description' },
                            ].map((field, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <label htmlFor={field.name} className="mb-1">{field.label}</label>
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                    />
                                </div>
                            ))}

                            {/* Gender & Type of Watch (Gender options corrected to 'Male') */}
                            {[
                                { label: 'Gender', name: 'gender', options: ['Male', 'Female', 'Unisex'] }, // ✅ Corrected options
                                { label: 'Type of Watch', name: 'typeOfWatch', options: ['Select Type', 'Analog', 'Hybrid', 'Luxury', 'Casual', 'Smart', 'Couple'] },
                            ].map((field, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <label>{field.label}</label>
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                    >
                                        {field.options.map((opt, i) => (
                                            <option key={i} value={opt} disabled={opt === 'Select Type' && formData[field.name] === 'Select Type'}>{opt || 'Select'}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            {/* Section: Specifications */}
                            <div className="col-span-full mt-4">
                                <h3 className="text-lg font-semibold text-blue-400 mb-2">⚙️ Specifications</h3>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="dialColor" className="mb-1">Dial Color</label>
                                <input
                                    id="dialColor"
                                    type="text"
                                    name="dialColor"
                                    placeholder="e.g. Black, Blue"
                                    value={formData.dialColor}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Dial Shape</label>
                                <select
                                    name="dialShape"
                                    value={formData.dialShape}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['', 'Round', 'Square', 'Rectangular'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt || 'Select'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="strapColor" className="mb-1">Strap Color</label>
                                <input
                                    id="strapColor"
                                    type="text"
                                    name="strapColor"
                                    placeholder="e.g. Black, Brown"
                                    value={formData.strapColor}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Strap Material</label>
                                <select
                                    name="strapMaterial"
                                    value={formData.strapMaterial}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['', 'Leather', 'Metal', 'Resin', 'Nylon'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt || 'Select'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label>Special Edition</label>
                                <select
                                    name="specialEdition"
                                    value={formData.specialEdition}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['', 'Limited Edition', 'Signature Series', 'Vintage Collection'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt || 'Select'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label>Case Size</label>
                                <select
                                    name="caseSize"
                                    value={formData.caseSize}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['', '38mm', '40mm', '42mm', '44mm'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt || 'Select'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label>Case Material</label>
                                <select
                                    name="caseMaterial"
                                    value={formData.caseMaterial}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['', 'Stainless Steel', 'Titanium', 'Gold-Plated', 'Ceramic', 'Plastic/Resin'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt || 'Select'}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Section: Pricing & Availability */}
                            <div className="col-span-full mt-4">
                                <h3 className="text-lg font-semibold text-yellow-400 mb-2">💰 Pricing & Availability</h3>
                            </div>
                            <div className="flex flex-col">
                                <label>Availability</label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['In Stock', 'Out of Stock'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="discount" className="mb-1">Discount (%)</label>
                                <input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Discount Range</label>
                                <select
                                    name="discountRange"
                                    value={formData.discountRange}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                >
                                    {['', '10-20%', '20-30%', '30-40%', '40%+'].map((opt, i) => (
                                        <option key={i} value={opt}>{opt || 'Select'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price" className="mb-1">Price</label>
                                <input
                                    id="price"
                                    type="number"
                                    min="0"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                />
                            </div>

                            {/* Section: Dates & Media */}
                            <div className="col-span-full mt-4">
                                <h3 className="text-lg font-semibold text-purple-400 mb-2">📅 Dates & Media</h3>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 col-span-2">
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="startDate" className="block mb-1">Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2" />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="endDate" className="block mb-1">End Date</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-black text-white border border-gray-600 rounded-md p-2" />
                                </div>
                            </div>
                            <div className="flex flex-col col-span-full">
                                <label htmlFor="imageUrl" className="mb-1">Image URL</label>
                                <input
                                    id="imageUrl"
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                                />
                            </div>

                            {/* Section: Deals */}
                            <div className="col-span-full mt-4">
                                <h3 className="text-lg font-semibold text-pink-400 mb-2">🔥 Deals</h3>
                            </div>
                            <div className="flex items-center gap-2 col-span-full">
                                <input
                                    type="checkbox"
                                    id="topDeals"
                                    name="topDeals"
                                    checked={formData.topDeals}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-green-600"
                                />
                                <label htmlFor="topDeals">Top Deals</label>
                            </div>

                            {/* Submit Button */}
                            <div className="col-span-full flex flex-col items-center mt-4">
                                {loading && <p className="text-blue-400 mb-2">{productId ? 'Saving changes...' : 'Uploading product...'}</p>}
                                {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
                                {successMessage && <p className="text-green-500 mb-2 text-center">{successMessage}</p>}
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 w-60 rounded transition text-lg font-semibold disabled:opacity-50"
                                >
                                    {productId ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Uploading...' : 'Upload')}
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