import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Sparkles, Calendar, Compass, DollarSign, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AiItinerary = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [destination, setDestination] = useState("Manali");
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("Standard");
  const [travelStyle, setTravelStyle] = useState("Adventure & Exploration");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!destination) {
      toast.error("Please enter a destination!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/ai/generate-itinerary`, {
        destination,
        days,
        budget,
        travelStyle,
      });

      if (res.data.success) {
        setResult(res.data.data);
        toast.success("AI Itinerary generated!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate AI itinerary");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAiTrip = () => {
    navigate("/booking", {
      state: {
        tour: {
          _id: `ai-custom-${Date.now()}`,
          title: `Custom ${days}-Day ${destination} ${travelStyle} Trip`,
          city: destination,
          price: budget === "Budget" ? days * 3000 : budget === "Luxury" ? days * 11000 : days * 5500,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/60 via-indigo-50/40 to-purple-50/60 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-600" /> TripSathi AI Assistant
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-3 tracking-tight">
          Smart AI Travel Itinerary Planner
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mt-3">
          Enter your trip preferences and watch TripSathi AI construct a personalized day-by-day itinerary tailored to your budget and travel vibe in seconds.
        </p>
      </div>

      {/* Input Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 mb-12"
      >
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" /> Destination
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa, Ladakh, Munnar"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-600" /> Trip Duration (Days)
            </label>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              {[2, 3, 4, 5, 6, 7, 8, 10].map((d) => (
                <option key={d} value={d}>
                  {d} Days / {d - 1} Nights
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-blue-600" /> Budget Tier
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              <option value="Budget">Budget Backpacking</option>
              <option value="Standard">Standard Comfort</option>
              <option value="Luxury">5-Star Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Compass className="w-4 h-4 text-blue-600" /> Travel Vibe
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              <option value="Adventure & Exploration">Adventure & Trekking</option>
              <option value="Relaxation & Spa">Relaxation & Beach</option>
              <option value="Cultural Heritage">Cultural & Foodie</option>
              <option value="Romantic Getaway">Romantic Getaway</option>
              <option value="Family Friendly">Family Fun</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-sky-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating AI Schedule...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Custom AI Itinerary
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Generated Itinerary Output */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-blue-200">
                AI Generated Package Summary
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                {result.days}-Day {result.destination} {result.travelStyle}
              </h2>
              <p className="text-blue-100 text-sm mt-2">
                Estimated Total: <span className="font-bold text-white text-lg">{result.estimatedTotal}</span> ({result.budget} Tier)
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {result.highlights.map((h, i) => (
                  <span key={i} className="bg-white/10 backdrop-blur-sm text-xs px-3 py-1 rounded-full border border-white/20">
                    ✨ {h}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleBookAiTrip}
              className="px-6 py-3.5 bg-white text-blue-600 font-extrabold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center justify-center gap-2 shrink-0"
            >
              Book This AI Trip Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline Days */}
          <div className="space-y-4">
            {result.itinerary.map((dayItem) => (
              <div key={dayItem.day} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
                  <span className="bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                    Day {dayItem.day}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg">{dayItem.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                    <span className="text-xs font-bold text-sky-700 uppercase">🌅 Morning</span>
                    <p className="text-gray-700 mt-1">{dayItem.morning}</p>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                    <span className="text-xs font-bold text-amber-700 uppercase">☀️ Afternoon</span>
                    <p className="text-gray-700 mt-1">{dayItem.afternoon}</p>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <span className="text-xs font-bold text-purple-700 uppercase">🌙 Evening</span>
                    <p className="text-gray-700 mt-1">{dayItem.evening}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-2">
                  <span>🏨 Recommended Stay: <strong className="text-gray-800">{dayItem.recommendedStay}</strong></span>
                  <span>💰 Est. Day Spend: <strong className="text-emerald-600">{dayItem.estimatedCost}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AiItinerary;
