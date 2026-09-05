import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, IndianRupee, MapPin, Users, Star, CheckCircle, XCircle, Send } from "lucide-react";
import tourData from "../assets/data/tour.js";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const TourDetails = () => {
  const { user, backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [tour, setTour] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const fetchTour = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/tours/${id}`);
      if (res.data.success && res.data.tour) {
        setTour(res.data.tour);
        setReviewsList(res.data.reviews || []);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Fallback to static array
    }

    const staticTour = tourData.find((t) => t.id === id || t._id === id);
    if (staticTour) {
      setTour(staticTour);
      setReviewsList(staticTour.reviews || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTour();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a review!");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/api/tours/${id}/reviews`,
        { reviewText, rating: reviewRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Review posted successfully!");
        setReviewText("");
        if (res.data.review) {
          setReviewsList((prev) => [res.data.review, ...prev]);
        }
        fetchTour();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Tour Package Not Found</h2>
          <button
            onClick={() => navigate("/tours")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const {
    photo,
    title,
    desc,
    price,
    city,
    distance = 250,
    maxGroupSize = 15,
    availableDates = ["2026-09-10", "2026-09-25"],
    rating = 4.8,
    avgRating = 4.8,
    agencyName,
    inclusions = ["Hotel Stay", "Breakfast & Dinner", "Sightseeing Transfer"],
    exclusions = ["Flight Tickets", "Personal Souvenirs"],
  } = tour;

  const currentRating = rating || avgRating;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Hero Banner Image */}
      <div className="relative h-80 sm:h-96 md:h-[450px] overflow-hidden rounded-3xl shadow-xl">
        <img src={photo} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            {agencyName || "TripSathi Verified Agency"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 leading-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200 mt-2">
            <span className="flex items-center gap-1">📍 {city}</span>
            <span className="flex items-center gap-1">⏱️ {tour.duration || "4 Days"}</span>
            <span className="flex items-center gap-1">👥 Max {maxGroupSize} People</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">⭐ {currentRating} Stars</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Overview & Highlights</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{desc}</p>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-base mb-3 text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> What's Included
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-base mb-3 text-rose-700 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" /> What's Excluded
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* User Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Traveler Reviews ({reviewsList.length})</h3>

            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Write a Review</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-lg ${star <= reviewRating ? "text-amber-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your travel experience with TripSathi community..."
                className="w-full p-2.5 border rounded-lg text-xs outline-none bg-white focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Submit Review
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">{rev.username || rev.name || "Verified Traveler"}</span>
                    <span className="text-amber-500 font-bold">⭐ {rev.rating}</span>
                  </div>
                  <p className="text-gray-700 text-xs mt-1">{rev.reviewText || rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24 space-y-5">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs uppercase text-gray-400 font-bold block">Starting From</span>
                <span className="text-3xl font-black text-emerald-600">₹{price?.toLocaleString()}</span>
                <span className="text-xs text-gray-500"> / person</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded">
                Instant Confirmation
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Location</span>
                <strong className="text-gray-900">{city}</strong>
              </div>
              <div className="flex justify-between">
                <span>Distance</span>
                <strong className="text-gray-900">{distance} KM</strong>
              </div>
              <div className="flex justify-between">
                <span>Group Limit</span>
                <strong className="text-gray-900">{maxGroupSize} People max</strong>
              </div>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  toast.info("Please login to proceed with booking");
                  navigate("/login");
                } else {
                  navigate("/booking", { state: { tour } });
                }
              }}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:from-sky-600 hover:to-blue-700 transition"
            >
              🎉 Book Package Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
