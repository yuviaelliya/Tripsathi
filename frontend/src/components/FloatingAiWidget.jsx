import React, { useState } from "react";
import { Sparkles, X, Compass, Users, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FloatingAiWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80 sm:w-96 text-gray-800"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">TripSathi AI Assistant</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">● Live & Ready</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Hi! I'm your TripSathi AI companion. How can I assist your journey today?
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/ai-planner");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-700 font-semibold flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Generate AI Day-by-Day Itinerary
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/find-sathi");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> Find Co-Traveler / Travel Buddy
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/tours");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100 text-amber-700 font-semibold flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" /> Browse Verified Tour Packages
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold rounded-full shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition duration-200 flex items-center gap-2 text-sm border-2 border-white/20"
      >
        <Sparkles className="w-4 h-4" /> TripSathi AI
      </button>
    </div>
  );
};

export default FloatingAiWidget;
