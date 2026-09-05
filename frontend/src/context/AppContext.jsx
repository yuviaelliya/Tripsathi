import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const fetchTours = async (query = {}) => {
    setLoadingTours(true);
    try {
      const queryParams = new URLSearchParams(query).toString();
      const res = await axios.get(`${backendUrl}/api/tours?${queryParams}`);
      if (res.data.success) {
        setTours(res.data.tours);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
    } finally {
      setLoadingTours(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const loginState = (userToken, userData) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const value = {
    user,
    setUser,
    token,
    setToken,
    backendUrl,
    tours,
    setTours,
    loadingTours,
    fetchTours,
    loginState,
    logout,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
