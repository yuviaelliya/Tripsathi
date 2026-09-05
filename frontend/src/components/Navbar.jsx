import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ShieldCheck, Building2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import logo from "../assets/logo.png";

const assets = {
  user: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234F46E5'/%3E%3Cpath d='M20 22c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm0 2c-4.418 0-14 2.209-14 7v3h28v-3c0-4.791-9.582-7-14-7z' fill='white'/%3E%3C/svg%3E",
};

const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".menu-button")
      ) {
        setMenuOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  // Role-based navigation links (Clean without emoji overuse)
  let navLinks = [];

  if (user && user.role === "agency") {
    navLinks = [
      { to: "/agency-dashboard", label: "Agency Dashboard" },
    ];
  } else if (user && user.role === "superadmin") {
    // Super admin sees Master Panel, Agency View, Explore Tours, About Us (No Find a Sathi)
    navLinks = [
      { to: "/super-admin", label: "Super Admin Panel" },
      { to: "/agency-dashboard", label: "Agency View" },
      { to: "/tours", label: "Explore Tours" },
      { to: "/about", label: "About Us" },
    ];
  } else {
    // Travelers / Logged Out Users
    navLinks = [
      { to: "/", label: "Home" },
      { to: "/tours", label: "Explore Tours" },
      { to: "/find-sathi", label: "Find a Sathi" },
      { to: "/about", label: "About Us" },
      ...(user ? [{ to: "/my-booking", label: "My Bookings" }] : []),
    ];
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link
              to={user && user.role === "agency" ? "/agency-dashboard" : user && user.role === "superadmin" ? "/super-admin" : "/"}
              className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-2">
                  <img src={logo} alt="Logo" />
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  TripSathi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Profile */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                      <img
                        src={assets.user}
                        alt="Profile"
                        className="w-8 h-8 rounded-full ring-2 ring-blue-100"
                      />
                      <div className="text-left">
                        <div className="text-xs font-extrabold text-gray-800">
                          {user.agencyName || user.name}
                        </div>
                        {/* Only show role for Agency & Super Admin (Hide for regular user) */}
                        {user.role !== "user" && (
                          <div className="text-[10px] uppercase font-bold text-blue-600">
                            {user.role === "agency" ? (user.isVerified ? "Verified Agency" : "Pending Verification") : "Super Admin"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                        Signed in as <strong>{user.email}</strong>
                      </div>
                      {user.role === "superadmin" && (
                        <Link
                          to="/super-admin"
                          className="flex items-center px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-lg"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" /> Super Admin Panel
                        </Link>
                      )}
                      {(user.role === "agency" || user.role === "superadmin") && (
                        <Link
                          to="/agency-dashboard"
                          className="flex items-center px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Building2 className="w-4 h-4 mr-2" /> Agency Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition duration-200 text-sm">
                    Login / Register
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Button */}
            <div className="lg:hidden flex items-center space-x-3 mobile-menu-container">
              {user && (
                <img
                  src={assets.user}
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-blue-100"
                />
              )}
              <button
                onClick={toggleMenu}
                className="menu-button p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm">
          <div className="fixed top-16 sm:top-20 left-0 right-0 bg-white shadow-xl border-t border-gray-100 mobile-menu-container">
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                      isActive(link.to)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      Signed in as <strong>{user.agencyName || user.name}</strong>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
                    >
                      <LogOut className="w-5 h-5 mr-3" /> Sign out
                    </button>
                  </div>
                ) : (
                  <Link to="/login">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold shadow-md text-center"
                    >
                      Login / Register
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;
