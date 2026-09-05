import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Tour from "./pages/Tour";
import TourDetails from "./pages/TourDetails";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Booking from "./pages/Booking";
import Invoice from "./pages/Invoice";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import MyBooking from "./pages/MyBooking";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AgencyDashboard from "./pages/AgencyDashboard";
import FindSathi from "./pages/FindSathi";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer theme="dark" position="bottom-right" autoClose={1500} />
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tour />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/my-booking" element={<MyBooking />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/agency-dashboard" element={<AgencyDashboard />} />
          <Route path="/find-sathi" element={<FindSathi />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
