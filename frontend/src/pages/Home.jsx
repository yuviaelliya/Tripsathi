import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Services from "../components/Services";
import AllTours from "../components/AllTours";
import Experience from "../components/Experience";
import NewsLetterBox from "../components/NewsLetterBox";
import { Compass, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Header />

      {/* Feature Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Explore Tours Shortcut */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
                <Compass className="w-4 h-4 text-sky-200" /> Tour Packages
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-3">Explore Handpicked Destinations</h3>
              <p className="text-blue-100 text-sm mt-2">
                Discover trending mountain treks, beach resorts, and heritage packages curated by verified partner travel agencies.
              </p>
            </div>
            <Link
              to="/tours"
              className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 font-extrabold px-5 py-3 rounded-2xl w-max text-xs sm:text-sm shadow hover:bg-blue-50 transition"
            >
              Browse All Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Banner 2: Find a Sathi */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
                <Users className="w-4 h-4 text-purple-200" /> Co-Traveler Hub
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-3">Find Your Travel Buddy</h3>
              <p className="text-purple-100 text-sm mt-2">
                Traveling solo? Connect with verified co-travelers heading to your destination to share cab fares and stay costs.
              </p>
            </div>
            <Link
              to="/find-sathi"
              className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-700 font-extrabold px-5 py-3 rounded-2xl w-max text-xs sm:text-sm shadow hover:bg-indigo-50 transition"
            >
              Find Co-Travelers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <SearchBar />
      <Services />
      <AllTours />
      <Experience />
      <NewsLetterBox />
    </div>
  );
};

export default Home;
