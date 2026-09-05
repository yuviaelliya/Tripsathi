import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, PlusCircle, Calendar, MapPin, IndianRupee, Phone, Mail, Search } from "lucide-react";
import { motion } from "framer-motion";

const FindSathi = () => {
  const { backendUrl, token, user } = useContext(AppContext);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDest, setSearchDest] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newPost, setNewPost] = useState({
    destination: "",
    startDate: "",
    budget: "Flexible",
    description: "",
    lookingForCount: "1",
    contactPhone: "",
  });

  const fetchBuddies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/buddies?destination=${searchDest}`);
      if (res.data.success) {
        setBuddies(res.data.buddies || []);
      }
    } catch (err) {
      toast.error("Failed to load travel buddies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuddies();
  }, [searchDest]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to post a buddy request!");
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/api/buddies`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Buddy request posted successfully!");
        setShowModal(false);
        setNewPost({
          destination: "",
          startDate: "",
          budget: "Flexible",
          description: "",
          lookingForCount: "1",
          contactPhone: "",
        });
        fetchBuddies();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post request");
    }
  };

  const isSelfPost = (buddy) => {
    if (!user) return false;
    return (
      (user.id && buddy.userId === user.id) ||
      (user._id && buddy.userId === user._id) ||
      (user.email && buddy.userEmail === user.email)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Co-Traveler Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">Find Your Travel Sathi</h1>
          <p className="text-blue-100 mt-2 max-w-xl text-sm sm:text-base">
            Connect with solo travelers heading to your destination, share cab expenses, split stays, and explore together.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              toast.info("Please login to post a request");
            }
            setShowModal(true);
          }}
          className="px-6 py-3.5 bg-white text-blue-700 font-extrabold rounded-2xl shadow-lg hover:bg-blue-50 transition flex items-center gap-2 shrink-0 text-sm"
        >
          <PlusCircle className="w-5 h-5" /> Post Buddy Request
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 relative">
        <input
          type="text"
          value={searchDest}
          onChange={(e) => setSearchDest(e.target.value)}
          placeholder="Search destination (e.g. Manali, Goa, Ladakh)..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Buddy Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : buddies.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Travel Buddy Posts Found</h3>
          <p className="text-gray-500 text-xs mt-1">Be the first to post a trip buddy request for this destination!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buddies.map((buddy) => (
            <motion.div
              key={buddy._id}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {buddy.destination}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Looking for {buddy.lookingForCount} Sathi(s)
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-900 text-lg">{buddy.userName}</h3>
                <p className="text-xs text-gray-500 mb-3">Posted trip buddy request</p>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  "{buddy.description}"
                </p>

                <div className="space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" /> Start Date: <strong>{buddy.startDate}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-500" /> Est. Budget: <strong>{buddy.budget}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-500" /> Phone: <strong>{buddy.contactPhone || "Email Only"}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-gray-400">Verified Member</span>

                {/* Self-Contact Check */}
                {isSelfPost(buddy) ? (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-bold">
                    Your Post
                  </span>
                ) : buddy.contactPhone ? (
                  <a
                    href={`tel:${buddy.contactPhone}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-bold hover:bg-emerald-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call / WhatsApp
                  </a>
                ) : (
                  <a
                    href={`mailto:${buddy.userEmail}`}
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Buddy
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Buddy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Post a Travel Buddy Request</h3>
            <form onSubmit={handleCreatePost} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Destination *</label>
                <input
                  type="text"
                  required
                  value={newPost.destination}
                  onChange={(e) => setNewPost({ ...newPost, destination: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Manali or Goa"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newPost.startDate}
                    onChange={(e) => setNewPost({ ...newPost, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">No. of Travel Buddies</label>
                  <input
                    type="number"
                    min="1"
                    value={newPost.lookingForCount}
                    onChange={(e) => setNewPost({ ...newPost, lookingForCount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Budget Style</label>
                <input
                  type="text"
                  value={newPost.budget}
                  onChange={(e) => setNewPost({ ...newPost, budget: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. ₹5,000 per person / Splitting Cabs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newPost.contactPhone}
                  onChange={(e) => setNewPost({ ...newPost, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. +91 9104847916"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trip Plan & Details *</label>
                <textarea
                  required
                  rows={3}
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share details like cab sharing, resort stay plans..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow text-xs"
                >
                  Publish Buddy Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindSathi;
