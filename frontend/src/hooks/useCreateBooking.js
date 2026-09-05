import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const useBooking = (tour) => {
  const { user, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const { title = "", price = 0, agencyName } = tour || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
    specialRequests: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const rawSubtotal = price * parseInt(formData.travelers || 1, 10);
  const totalPrice = Math.max(0, rawSubtotal - discount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/bookings/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: couponCode, amount: rawSubtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        setCouponApplied(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Invalid coupon");
      }
    } catch (err) {
      toast.error("Coupon validation error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      toast.error("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to complete booking!");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tourId: tour._id || tour.id || "tour-custom",
          tourTitle: tour.title,
          totalPrice,
          couponCode: couponApplied ? couponCode : "",
          discountAmount: discount,
          agencyName: agencyName || "TripSathi Official",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Booking confirmed!");
        navigate("/invoice", { state: { booking: data.booking } });
      } else {
        toast.error(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    rawSubtotal,
    totalPrice,
    discount,
    couponCode,
    setCouponCode,
    couponApplied,
    applyCoupon,
    isSubmitting,
    title,
    handleChange,
    handleSubmit,
  };
};

export default useBooking;
