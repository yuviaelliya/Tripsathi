import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck, ArrowRight, X } from "lucide-react";

const LoginPage = () => {
  const { backendUrl, loginState } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Agency Registration Modal State
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    businessAddress: "",
    licenseNumber: "",
    description: "",
  });

  const navigate = useNavigate();

  // Standard Login / Register Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password || (!isLogin && !name)) {
        toast.error("All required fields must be filled!");
        return;
      }

      let response;
      if (isLogin) {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          role: "user",
        });
      }

      if (response.data.success) {
        const { token, user } = response.data;
        loginState(token, user);

        toast.success(
          isLogin ? `Welcome back, ${user.name}!` : "Traveler account created successfully!"
        );

        if (user.role === "superadmin") {
          navigate("/super-admin");
        } else if (user.role === "agency") {
          navigate("/agency-dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.data.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Detailed Agency Registration Handler
  const handleAgencyRegister = async (e) => {
    e.preventDefault();
    const { agencyName, name, email, password, phone } = agencyForm;

    if (!agencyName || !name || !email || !password || !phone) {
      toast.error("Please fill in all essential agency details!");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        ...agencyForm,
        role: "agency",
      });

      if (response.data.success) {
        const { token, user } = response.data;
        loginState(token, user);
        toast.info("Agency registered! Account is pending Super Admin verification.");
        setShowAgencyModal(false);
        navigate("/agency-dashboard");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting agency registration");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center mb-3">
        Welcome to{" "}
        <span className="text-blue-600 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
          TripSathi
        </span>
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-8 text-sm">
        Your Verified Travel Partner & Community Network
      </p>

      {/* Main Login / Signup Card */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 relative">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? "Sign In to Your Account" : "Create Traveler Account"}
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Log in with your email & password
        </p>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="e.g. Aditya Sharma"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition"
          >
            {isLogin ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 border-b border-gray-100 pb-6">
          {isLogin ? (
            <p>
              New to TripSathi?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                Sign In Here
              </button>
            </p>
          )}
        </div>

        {/* Dedicated Agency Registration Link / Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAgencyModal(true)}
            className="w-full py-3 px-4 bg-sky-50 hover:bg-sky-100 text-blue-700 font-bold rounded-2xl border border-sky-200 transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            Are you a Travel Agency Partner? Register your agency here <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DETAILED AGENCY REGISTRATION MODAL */}
      {showAgencyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100">
            <button
              onClick={() => setShowAgencyModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Agency Verification Portal
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Partner Agency Registration
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Fill in your complete business details. Agency accounts require Super Admin approval before publishing packages.
            </p>

            <form onSubmit={handleAgencyRegister} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Agency / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={agencyForm.agencyName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="e.g. Royal Gujarat Treks"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Owner / Representative Name *</label>
                  <input
                    type="text"
                    required
                    value={agencyForm.name}
                    onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="e.g. Kishan Aelliya"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={agencyForm.email}
                    onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="agency@example.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={agencyForm.phone}
                    onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="e.g. 9104847916"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={agencyForm.password}
                  onChange={(e) => setAgencyForm({ ...agencyForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Office Location / Address</label>
                  <input
                    type="text"
                    value={agencyForm.businessAddress}
                    onChange={(e) => setAgencyForm({ ...agencyForm, businessAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="e.g. Banaskantha, Gujarat"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">GST / Govt Reg No. (Optional)</label>
                  <input
                    type="text"
                    value={agencyForm.licenseNumber}
                    onChange={(e) => setAgencyForm({ ...agencyForm, licenseNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="e.g. GSTIN24AAAAA0000A1Z5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Agency Overview / Tour Specialization</label>
                <textarea
                  rows={3}
                  value={agencyForm.description}
                  onChange={(e) => setAgencyForm({ ...agencyForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Describe your tour packages, mountain treks, beach resorts..."
                ></textarea>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAgencyModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md text-xs"
                >
                  Submit Agency Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
