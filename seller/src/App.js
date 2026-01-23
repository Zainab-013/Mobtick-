import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';


import Preloader from "./components/Preloader";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

// make sure this path is correct
import ManageProduct from "./pages/ManageProduct"; // ✅ Corrected name and path
import ViewCustomer from "./pages/ViewCustomer";
import ViewProduct from "./pages/ViewProduct";
import Statistics from './pages/Statistics';
import RevenueOverview from "./pages/RevenueOverview";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      {loading ? (
        <Preloader onFinish={() => setLoading(false)} />
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/seller/login" replace />} />
          <Route path="/seller/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
<Route path="/manageproduct" element={<ManageProduct />} /> 
          {/* This one is for UPDATING an existing product */}
          <Route path="/manageproduct/:id" element={<ManageProduct />} /> 
          <Route path="/seller/login" element={<Login />} />
          <Route path="/seller/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ManageProduct" element={<ManageProduct />} />
          <Route path="/ViewCustomer" element={<ViewCustomer />} />
          <Route path="/ViewProduct" element={<ViewProduct />} />
          <Route path="/RevenueOverview" element={<RevenueOverview />} />


        </Routes>

      )}
    </BrowserRouter>
  );
}

export default App;