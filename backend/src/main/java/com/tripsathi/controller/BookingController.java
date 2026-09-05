package com.tripsathi.controller;

import com.tripsathi.model.Booking;
import com.tripsathi.model.Coupon;
import com.tripsathi.model.Tour;
import com.tripsathi.repository.BookingRepository;
import com.tripsathi.repository.CouponRepository;
import com.tripsathi.repository.TourRepository;
import com.tripsathi.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private CouponRepository couponRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Please login to complete booking!"));
            }

            String name = (String) body.get("name");
            String email = (String) body.get("email");
            String phone = (String) body.get("phone");
            String tourId = body.get("tourId") != null ? body.get("tourId").toString() : null;
            String tourTitle = (String) body.get("tourTitle");
            Object totalPriceObj = body.get("totalPrice");

            if (name == null || email == null || phone == null || tourId == null || tourTitle == null || totalPriceObj == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Missing required fields for booking"));
            }

            Double totalPrice = Double.valueOf(totalPriceObj.toString());
            Double discountAmount = body.get("discountAmount") != null ? Double.valueOf(body.get("discountAmount").toString()) : 0.0;
            Double basePrice = totalPrice + discountAmount;
            Integer travelers = body.get("travelers") != null ? Integer.valueOf(body.get("travelers").toString()) : 1;
            String specialRequests = (String) body.getOrDefault("specialRequests", "");
            String couponCode = (String) body.getOrDefault("couponCode", "");

            String agencyName = (String) body.getOrDefault("agencyName", "TripSathi Official");
            Long agencyId = null;

            if (body.get("agencyId") != null) {
                try {
                    agencyId = Long.valueOf(body.get("agencyId").toString());
                } catch (NumberFormatException ignored) {}
            }

            // Resolve agency name from tour if possible
            try {
                Long numericTourId = Long.parseLong(tourId);
                Optional<Tour> tourOpt = tourRepository.findById(numericTourId);
                if (tourOpt.isPresent()) {
                    Tour t = tourOpt.get();
                    if (t.getAgencyName() != null && !t.getAgencyName().isBlank()) {
                        agencyName = t.getAgencyName();
                    }
                    if (t.getAgencyId() != null) {
                        agencyId = t.getAgencyId();
                    }
                }
            } catch (NumberFormatException ignored) {}

            Booking booking = new Booking();
            booking.setUserId(userDetails.getId());
            booking.setAgencyId(agencyId);
            booking.setAgencyName(agencyName);
            booking.setName(name);
            booking.setEmail(email);
            booking.setPhone(phone);
            booking.setTravelers(travelers);
            booking.setSpecialRequests(specialRequests);
            booking.setTourId(tourId);
            booking.setTourTitle(tourTitle);
            booking.setBasePrice(basePrice);
            booking.setTotalPrice(totalPrice);
            booking.setDiscountAmount(discountAmount);
            booking.setCouponCode(couponCode != null ? couponCode : "");
            booking.setStatus("confirmed");
            booking.setPaymentStatus("paid");

            Booking savedBooking = bookingRepository.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("booking", savedBooking);
            response.put("message", "Booking created successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getBookings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Unauthorized"));
            }

            List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
            return ResponseEntity.ok(Map.of("success", true, "bookings", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Unauthorized"));
            }

            Object bookingIdObj = body.get("bookingId");
            if (bookingIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Booking ID is required"));
            }

            Long bookingId = Long.valueOf(bookingIdObj.toString());
            Optional<Booking> bookingOpt = bookingRepository.findByIdAndUserId(bookingId, userDetails.getId());

            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Booking not found"));
            }

            Booking booking = bookingOpt.get();
            booking.setStatus("cancelled");
            booking.setPaymentStatus("refunded");
            Booking updatedBooking = bookingRepository.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking cancelled successfully");
            response.put("booking", updatedBooking);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/coupon")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> body) {
        try {
            String code = (String) body.get("code");
            Object amountObj = body.get("amount");

            if (code == null || code.isBlank()) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Please enter a valid coupon code"));
            }

            String cleanCode = code.trim().toUpperCase();
            double amount = amountObj != null ? Double.parseDouble(amountObj.toString()) : 0.0;
            double discount = 0.0;

            if ("FIRSTTRIP10".equals(cleanCode) || "TRIPSATHI10".equals(cleanCode)) {
                discount = Math.round(amount * 0.1);
            } else if ("SATHISPECIAL".equals(cleanCode) || "WELCOME500".equals(cleanCode)) {
                discount = 500.0;
            } else if ("EARLYBIRD".equals(cleanCode)) {
                discount = Math.round(amount * 0.15);
            } else {
                Optional<Coupon> dbCouponOpt = couponRepository.findByCodeAndIsActiveTrue(cleanCode);
                if (dbCouponOpt.isPresent()) {
                    Coupon dbCoupon = dbCouponOpt.get();
                    if (amount < dbCoupon.getMinBookingAmount()) {
                        return ResponseEntity.ok(Map.of(
                                "success", false,
                                "message", "Coupon requires a minimum booking amount of ₹" + dbCoupon.getMinBookingAmount()
                        ));
                    }
                    discount = dbCoupon.getDiscountAmount();
                } else {
                    return ResponseEntity.ok(Map.of("success", false, "message", "Invalid or expired coupon code"));
                }
            }

            double finalAmount = Math.max(0.0, amount - discount);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Coupon '" + cleanCode + "' applied successfully! Saved ₹" + (long) discount);
            response.put("discount", discount);
            response.put("finalAmount", finalAmount);
            response.put("code", cleanCode);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
