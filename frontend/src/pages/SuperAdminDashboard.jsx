import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldCheck, Building2, Compass, BookmarkCheck, IndianRupee, CheckCircle, XCircle, Trash2, RefreshCw, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const SuperAdminDashboard = () => {
  const { backendUrl, token, user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Agency filter states
  const [agencySearch, setAgencySearch] = useState("");
  const [agencyStatusFilter, setAgencyStatusFilter] = useState("all");

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, toursRes, bookingsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/superadmin/stats`, { headers }),
        axios.get(`${backendUrl}/api/superadmin/tours`, { headers }),
        axios.get(`${backendUrl}/api/superadmin/bookings`, { headers }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setAgencies(statsRes.data.agenciesList || []);
      }
      if (toursRes.data.success) {
        setTours(toursRes.data.tours || []);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings || []);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load Super Admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSuperAdminData();
    }
  }, [token]);

  const handleToggleAgencyStatus = async (agencyId, currentStatus) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/superadmin/agency-status`,
        { agencyId, isVerified: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSuperAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update agency status");
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to remove this tour package from the entire platform?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/superadmin/tour/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSuperAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete tour");
    }
  };

  const handleUpdateBooking = async (bookingId, status) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/superadmin/update-booking-status`,
        { bookingId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Booking set to ${status}`);
        fetchSuperAdminData();
      }
    } catch (err) {
      toast.error("Failed to update booking status");
    }
  };

  // Filter Agencies List
  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      (agency.agencyName || "").toLowerCase().includes(agencySearch.toLowerCase()) ||
      (agency.name || "").toLowerCase().includes(agencySearch.toLowerCase()) ||
      (agency.email || "").toLowerCase().includes(agencySearch.toLowerCase()) ||
      (agency.phone || "").includes(agencySearch) ||
      (agency.businessAddress || "").toLowerCase().includes(agencySearch.toLowerCase());

    const matchesStatus =
      agencyStatusFilter === "all"
        ? true
        : agencyStatusFilter === "verified"
        ? agency.isVerified === true
        : agency.isVerified === false;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Platform Control Center
            </span>
            <span className="text-gray-400 text-xs">Owner Account ({user?.email})</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            TripSathi Super Admin Control Panel
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage partner agency approvals, filter agency records, master tour packages, and platform stats.
          </p>
        </div>

        <button
          onClick={fetchSuperAdminData}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Platform Revenue</span>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString("en-IN") : 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Partner Agencies</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalAgencies || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Active Packages</span>
            <Compass className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalTours || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Bookings</span>
            <BookmarkCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalBookings || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Registered Travelers</span>
            <ShieldCheck className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-5 text-sm font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Partner Agencies Management ({agencies.length})
        </button>
        <button
          onClick={() => setActiveTab("tours")}
          className={`py-3 px-5 text-sm font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === "tours"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Master Tour Packages ({tours.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`py-3 px-5 text-sm font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === "bookings"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Master Bookings Overview ({bookings.length})
        </button>
      </div>

      {/* TAB 1: AGENCIES MANAGEMENT WITH SEARCH & FILTER */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Agency Filter Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Partner Agencies List</h3>
              <p className="text-xs text-gray-500">Filter and approve travel agency partner registrations</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={agencySearch}
                  onChange={(e) => setAgencySearch(e.target.value)}
                  placeholder="Search agency, email, phone, location..."
                  className="pl-9 pr-4 py-2 border rounded-xl text-xs bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Status filter dropdown */}
              <select
                value={agencyStatusFilter}
                onChange={(e) => setAgencyStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-xl text-xs bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              >
                <option value="all">All Statuses ({agencies.length})</option>
                <option value="verified">Verified Only ({agencies.filter((a) => a.isVerified).length})</option>
                <option value="pending">Pending Approval ({agencies.filter((a) => !a.isVerified).length})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 font-bold uppercase border-b">
                  <th className="py-3 px-4">Agency / Brand</th>
                  <th className="py-3 px-4">Owner & Contact</th>
                  <th className="py-3 px-4">Location & License</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAgencies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                      No matching agencies found.
                    </td>
                  </tr>
                ) : (
                  filteredAgencies.map((agency) => (
                    <tr key={agency._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-gray-900">
                          {agency.agencyName || agency.name}
                        </div>
                        {agency.description && (
                          <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">{agency.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{agency.name}</div>
                        <div className="text-xs text-gray-500">{agency.email}</div>
                        <div className="text-xs text-gray-500">📞 {agency.phone || "No phone"}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        <div>📍 {agency.businessAddress || "Not specified"}</div>
                        {agency.licenseNumber && (
                          <div className="text-gray-400">Reg: {agency.licenseNumber}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {agency.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified Partner
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Pending Approval
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleAgencyStatus(agency._id, agency.isVerified)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            agency.isVerified
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                          }`}
                        >
                          {agency.isVerified ? "Revoke Verification" : "Approve Agency"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER TOURS */}
      {activeTab === "tours" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Platform Tour Packages</h3>
            <span className="text-xs text-gray-500">Live Master Packages</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tours.map((tour) => (
              <div key={tour._id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <img src={tour.photo} alt={tour.title} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded">
                        {tour.agencyName || "Official Agency"}
                      </span>
                      <span className="text-emerald-600 font-bold text-sm">₹{tour.price}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base line-clamp-1">{tour.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tour.desc}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>📍 {tour.city}</span>
                      <span>⏱️ {tour.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-500">Rating: ⭐ {tour.rating}</span>
                  <button
                    onClick={() => handleDeleteTour(tour._id)}
                    className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MASTER BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">All System Customer Bookings</h3>
            <span className="text-xs text-gray-500">Master Record</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 font-bold uppercase border-b">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Tour Package</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-xs font-mono text-gray-500">
                      {booking._id.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{booking.name}</div>
                      <div className="text-xs text-gray-500">{booking.email} | {booking.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 line-clamp-1 max-w-[200px]">
                      {booking.tourTitle}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {booking.agencyName || "TripSathi Official"}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      ₹{booking.totalPrice}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        booking.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                        booking.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {booking.status !== "confirmed" && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, "confirmed")}
                          className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, "cancelled")}
                          className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
