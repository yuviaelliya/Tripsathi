import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Building2, PlusCircle, Compass, BookmarkCheck, IndianRupee, Clock, CheckCircle, Edit, Trash2, Tag, X } from "lucide-react";

const AgencyDashboard = () => {
  const { backendUrl, token, user } = useContext(AppContext);
  const [data, setData] = useState({ tours: [], bookings: [], coupons: [], totalRevenue: 0 });
  const [isVerified, setIsVerified] = useState(false);
  const [agencyDetails, setAgencyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tours");

  // Add/Edit Tour Modal state
  const [showTourModal, setShowTourModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);

  const [tourForm, setTourForm] = useState({
    title: "",
    city: "",
    photo: "",
    desc: "",
    price: "",
    maxGroupSize: "10",
    category: "Adventure",
    duration: "4 Days / 3 Nights",
    roomType: "3-Star Resort & Spa",
    rating: "4.8",
    inclusions: "Hotel Stay, Breakfast, Sightseeing Transfer, Guide",
    exclusions: "Flight Tickets, Personal Souvenirs",
  });

  // Create Coupon Modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountAmount: "",
    minBookingAmount: "1000",
  });

  const fetchAgencyData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/agency/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setIsVerified(res.data.isVerified);
        setAgencyDetails(res.data.agencyDetails);
        setData({
          tours: res.data.tours || [],
          bookings: res.data.bookings || [],
          coupons: res.data.coupons || [],
          totalRevenue: res.data.totalRevenue || 0,
        });
      }
    } catch (err) {
      toast.error("Failed to load agency dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAgencyData();
    }
  }, [token]);

  const openCreateTourModal = () => {
    setIsEditing(false);
    setEditingTourId(null);
    setTourForm({
      title: "",
      city: "",
      photo: "",
      desc: "",
      price: "",
      maxGroupSize: "10",
      category: "Adventure",
      duration: "4 Days / 3 Nights",
      roomType: "3-Star Resort & Spa",
      rating: "4.8",
      inclusions: "Hotel Stay, Breakfast, Sightseeing Transfer, Guide",
      exclusions: "Flight Tickets, Personal Souvenirs",
    });
    setShowTourModal(true);
  };

  const openEditTourModal = (tour) => {
    setIsEditing(true);
    setEditingTourId(tour._id);
    setTourForm({
      title: tour.title || "",
      city: tour.city || "",
      photo: tour.photo || "",
      desc: tour.desc || "",
      price: tour.price || "",
      maxGroupSize: tour.maxGroupSize || "10",
      category: tour.category || "Adventure",
      duration: tour.duration || "4 Days / 3 Nights",
      roomType: tour.roomType || "3-Star Resort & Spa",
      rating: tour.rating || "4.8",
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(", ") : tour.inclusions || "",
      exclusions: Array.isArray(tour.exclusions) ? tour.exclusions.join(", ") : tour.exclusions || "",
    });
    setShowTourModal(true);
  };

  const handleSaveTour = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isEditing && editingTourId) {
        res = await axios.post(`${backendUrl}/api/agency/update-tour/${editingTourId}`, tourForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.post(`${backendUrl}/api/agency/create-tour`, tourForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setShowTourModal(false);
        fetchAgencyData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving package");
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to remove this package?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/agency/delete-tour/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAgencyData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting tour");
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/agency/coupon`, couponForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowCouponModal(false);
        setCouponForm({ code: "", discountAmount: "", minBookingAmount: "1000" });
        fetchAgencyData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating coupon");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/agency/update-booking`,
        { bookingId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Booking status updated to ${status}`);
        fetchAgencyData();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // PENDING VERIFICATION SCREEN FOR UNVERIFIED AGENCIES
  if (!isVerified && user?.role !== "superadmin") {
    return (
      <div className="min-h-screen bg-gray-50/50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8" />
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pending Super Admin Approval
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Agency Account Awaiting Verification
          </h2>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            Welcome <strong>{user?.agencyName || user?.name}</strong>! Your partner agency registration has been received by TripSathi.
          </p>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-xs text-amber-900 mt-5 text-left space-y-1">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {agencyDetails?.phone || user?.phone || "Submitted"}</p>
            <p><strong>Status:</strong> Waiting for Super Admin approval</p>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Once approved by the Super Admin, your agency dashboard will unlock full package publishing and booking controls.
          </p>
          <button
            onClick={fetchAgencyData}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow hover:bg-blue-700 transition"
          >
            Check Verification Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center w-max gap-1">
            <CheckCircle className="w-4 h-4" /> Verified Partner Agency Portal
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            {user?.agencyName || user?.name || "Agency"} Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Publish and edit tour packages, manage promo coupons, and handle customer bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowCouponModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-800 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition text-sm"
          >
            <Tag className="w-4 h-4 mr-2 text-blue-600" /> Create Promo Coupon
          </button>
          <button
            onClick={openCreateTourModal}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition text-sm"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add New Tour Package
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase">Agency Earnings</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{data.totalRevenue.toLocaleString("en-IN")}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase">Published Packages</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.tours.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase">Customer Bookings</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.bookings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase">Active Agency Coupons</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.coupons.length}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-3 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("tours")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "tours" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Tour Packages ({data.tours.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "bookings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Customer Bookings ({data.bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "coupons" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Promo Coupons ({data.coupons.length})
        </button>
      </div>

      {/* TAB 1: TOURS LIST WITH EDIT & DELETE */}
      {activeTab === "tours" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Your Tour Packages</h3>
            <button onClick={openCreateTourModal} className="text-xs font-bold text-blue-600 hover:underline">
              + Publish Package
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {data.tours.map((tour) => (
              <div key={tour._id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <img src={tour.photo} alt={tour.title} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded">
                        📍 {tour.city}
                      </span>
                      <span className="text-emerald-600 font-bold text-sm">₹{tour.price}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base line-clamp-1">{tour.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tour.desc}</p>
                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                      <div>🏨 <strong>Stay:</strong> {tour.roomType || "3-Star Deluxe"}</div>
                      <div>⏱️ <strong>Duration:</strong> {tour.duration}</div>
                      <div>⭐ <strong>Rating:</strong> {tour.rating || 4.8} Stars</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs">
                  <button
                    onClick={() => openEditTourModal(tour)}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit Package
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour._id)}
                    className="font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Customer Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 font-bold uppercase border-b">
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Tour Package</th>
                  <th className="py-3 px-4">Travelers</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{booking.name}</div>
                      <div className="text-xs text-gray-500">{booking.email} | {booking.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{booking.tourTitle}</td>
                    <td className="py-3 px-4 text-xs">{booking.travelers} Persons</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">₹{booking.totalPrice}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        booking.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                        booking.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, "confirmed")}
                        className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, "cancelled")}
                        className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROMO COUPONS */}
      {activeTab === "coupons" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Your Agency Discount Coupons</h3>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700"
            >
              + Create New Code
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.coupons.map((coupon) => (
              <div key={coupon._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-extrabold text-blue-700 text-base tracking-wider uppercase">{coupon.code}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="text-2xl font-black text-gray-900">₹{coupon.discountAmount} OFF</div>
                <div className="text-xs text-gray-500 mt-1">Min booking amount: ₹{coupon.minBookingAmount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT TOUR MODAL */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTourModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isEditing ? "Edit Tour Package Details" : "Publish New Tour Package"}
            </h3>

            <form onSubmit={handleSaveTour} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tour Title *</label>
                  <input
                    type="text"
                    required
                    value={tourForm.title}
                    onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Banaskantha Heritage Trek"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={tourForm.city}
                    onChange={(e) => setTourForm({ ...tourForm, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Banaskantha, Gujarat"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price per Person (₹) *</label>
                  <input
                    type="number"
                    required
                    value={tourForm.price}
                    onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={tourForm.duration}
                    onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5 Days / 4 Nights"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={tourForm.rating}
                    onChange={(e) => setTourForm({ ...tourForm, rating: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4.8"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo Image URL *</label>
                <input
                  type="url"
                  required
                  value={tourForm.photo}
                  onChange={(e) => setTourForm({ ...tourForm, photo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Room / Accommodation Style</label>
                <input
                  type="text"
                  value={tourForm.roomType}
                  onChange={(e) => setTourForm({ ...tourForm, roomType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 3-Star Deluxe Hotel & Heritage Resort"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tour Description & Overview *</label>
                <textarea
                  required
                  rows={3}
                  value={tourForm.desc}
                  onChange={(e) => setTourForm({ ...tourForm, desc: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detail highlights, day-by-day activities..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Included (Comma Separated)</label>
                  <textarea
                    rows={2}
                    value={tourForm.inclusions}
                    onChange={(e) => setTourForm({ ...tourForm, inclusions: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hotel Stay, Breakfast, Sightseeing Transfer"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Excluded (Comma Separated)</label>
                  <textarea
                    rows={2}
                    value={tourForm.exclusions}
                    onChange={(e) => setTourForm({ ...tourForm, exclusions: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Flight Tickets, Personal Expenses"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowTourModal(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow"
                >
                  {isEditing ? "Save Tour Updates" : "Publish Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Agency Promo Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-xl outline-none uppercase font-bold text-blue-600"
                  placeholder="e.g. GUJARAT500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Discount Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={couponForm.discountAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, discountAmount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none"
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Min Booking Amount (₹)</label>
                <input
                  type="number"
                  value={couponForm.minBookingAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, minBookingAmount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none"
                  placeholder="1000"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyDashboard;
