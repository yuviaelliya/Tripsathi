import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useBooking from "../hooks/useCreateBooking";
import { Tag, Check } from "lucide-react";

const Booking = () => {
  const location = useLocation();
  const tour = location.state?.tour;

  if (!tour) return null;

  const { title = "" } = tour;

  const {
    formData,
    rawSubtotal,
    totalPrice,
    discount,
    couponCode,
    setCouponCode,
    couponApplied,
    applyCoupon,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useBooking(tour);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600">
            Package: <span className="font-bold text-blue-600">{title}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Traveler Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Rahul Verma"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="rahul@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Number of Travelers</label>
                <input
                  type="number"
                  name="travelers"
                  min="1"
                  max="20"
                  value={formData.travelers || 1}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Dietary requests, room preferences..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg"
                }`}
              >
                {isSubmitting ? "Processing..." : "Complete Booking & Generate Invoice"}
              </button>
            </form>
          </div>

          {/* Pricing Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>Price Breakdown</span>
                <span className="text-xs text-blue-600 font-semibold">{tour.agencyName || "TripSathi"}</span>
              </h3>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Price per person</span>
                  <span className="font-semibold text-gray-900">₹{tour.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers</span>
                  <span className="font-semibold text-gray-900">{formData.travelers}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{rawSubtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Code ({couponCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 text-xl">₹{totalPrice}</span>
                </div>
              </div>

              {/* Promo Coupon Box */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-600" /> Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FIRSTTRIP10"
                    disabled={couponApplied}
                    className="w-full px-3 py-2 border rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied}
                    className={`px-3 py-2 text-xs font-bold rounded-xl text-white transition ${
                      couponApplied ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {couponApplied ? <Check className="w-4 h-4" /> : "Apply"}
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 mt-1.5 block">
                  Available coupons: <code className="text-blue-600 font-semibold">FIRSTTRIP10</code>, <code className="text-blue-600 font-semibold">SATHISPECIAL</code>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
