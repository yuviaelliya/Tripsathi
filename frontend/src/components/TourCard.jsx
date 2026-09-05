import React from "react";
import { Star, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TourCard = ({ tour }) => {
  const tourId = tour._id || tour.id;
  const { title, photo, price, city, rating, avgRating, agencyName, duration } = tour;
  const navigate = useNavigate();

  const handleCardClick = () => {
    scrollTo(0, 0);
    navigate(`/tours/${tourId}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col justify-between transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -6 }}
    >
      <div>
        <div className="relative overflow-hidden h-52">
          <img
            src={photo}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-400" /> {city}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="bg-blue-50 text-blue-700 font-extrabold px-2.5 py-0.5 rounded text-[11px]">
              {agencyName || "TripSathi"}
            </span>
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1 text-amber-400" />
              {rating || avgRating || 4.8}
            </span>
          </div>

          <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition">
            {title}
          </h3>

          <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> {duration || "3 Days / 2 Nights"}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex justify-between items-center border-t border-gray-100 mt-2">
        <div>
          <span className="text-[10px] uppercase text-gray-400 font-bold block">Starting from</span>
          <span className="text-xl font-black text-emerald-600">₹{price?.toLocaleString()}</span>
          <span className="text-[11px] text-gray-500"> /person</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:from-sky-600 hover:to-blue-700 hover:shadow-lg transition"
        >
          View Package
        </button>
      </div>
    </motion.div>
  );
};

export default TourCard;
