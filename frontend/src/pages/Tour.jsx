import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import TourCard from "../components/TourCard";
import { AppContext } from "../context/AppContext";
import { Search, Filter, Compass, SlidersHorizontal } from "lucide-react";

const categories = ["All", "Adventure", "Beach", "Cultural", "Trekking", "Relaxation"];

const Tour = () => {
  const { tours, loadingTours, fetchTours } = useContext(AppContext);
  const [searchCity, setSearchCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    fetchTours({
      city: searchCity,
      category: selectedCategory,
      maxPrice,
      sort: sortOption,
    });
  }, [searchCity, selectedCategory, maxPrice, sortOption]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 text-white py-16 px-6 text-center shadow-lg mb-10">
        <div className="max-w-3xl mx-auto">
          <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            🗺️ Explore Handpicked Packages
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
            Discover Verified Tours & Experiences
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Book top destinations offered by verified partner travel agencies with TripSathi guarantee.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Multi Filter Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search city or package name..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Max Price</span>
                <span className="text-blue-600 font-bold">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="30000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
              >
                <option value="default">Featured / Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchCity("");
                  setSelectedCategory("All");
                  setMaxPrice(30000);
                  setSortOption("default");
                }}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pt-2 border-t border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tour List Grid */}
        {loadingTours ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto my-12">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Tour Packages Match</h3>
            <p className="text-gray-500 text-xs mt-1">Try adjusting your filters or price slider!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour._id || tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tour;
