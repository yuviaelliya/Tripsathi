package com.tripsathi.controller;

import com.tripsathi.model.Booking;
import com.tripsathi.model.Coupon;
import com.tripsathi.model.Tour;
import com.tripsathi.model.User;
import com.tripsathi.repository.BookingRepository;
import com.tripsathi.repository.CouponRepository;
import com.tripsathi.repository.TourRepository;
import com.tripsathi.repository.UserRepository;
import com.tripsathi.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/agency")
public class AgencyController {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isAgencyOrAdmin(CustomUserDetails userDetails) {
        if (userDetails == null) return false;
        String role = userDetails.getRole();
        return "agency".equalsIgnoreCase(role) || "superadmin".equalsIgnoreCase(role)
                || "kishanaelliya@gmail.com".equalsIgnoreCase(userDetails.getUsername());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getAgencyDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (!isAgencyOrAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied. Agency or Admin privileges required."));
            }

            Long agencyId = userDetails.getId();
            boolean isSuperAdmin = "superadmin".equalsIgnoreCase(userDetails.getRole())
                    || "kishanaelliya@gmail.com".equalsIgnoreCase(userDetails.getUsername());

            User currentUser = userRepository.findById(agencyId).orElse(userDetails.getUser());
            boolean isVerified = isSuperAdmin || Boolean.TRUE.equals(currentUser.getIsVerified());

            List<Tour> tours;
            List<Booking> bookings;
            List<Coupon> coupons;

            if (isSuperAdmin) {
                tours = tourRepository.findAllByOrderByCreatedAtDesc();
                bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
                coupons = couponRepository.findAllByOrderByCreatedAtDesc();
            } else {
                tours = tourRepository.findByAgencyIdOrderByCreatedAtDesc(agencyId);
                bookings = bookingRepository.findByAgencyIdOrAgencyNameOrderByCreatedAtDesc(agencyId, currentUser.getAgencyName());
                coupons = couponRepository.findByAgencyIdOrderByCreatedAtDesc(agencyId);
            }

            double totalRevenue = bookings.stream()
                    .filter(b -> !"cancelled".equalsIgnoreCase(b.getStatus()))
                    .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0.0)
                    .sum();

            currentUser.setPassword(null);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isVerified", isVerified);
            response.put("agencyDetails", currentUser);
            response.put("tours", tours);
            response.put("bookings", bookings);
            response.put("coupons", coupons);
            response.put("totalTours", tours.size());
            response.put("totalBookings", bookings.size());
            response.put("totalRevenue", totalRevenue);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/create-tour")
    public ResponseEntity<?> createTourPackage(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isAgencyOrAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied. Agency or Admin privileges required."));
            }

            User currentUser = userRepository.findById(userDetails.getId()).orElse(userDetails.getUser());
            boolean isSuperAdmin = "superadmin".equalsIgnoreCase(userDetails.getRole());

            if (!isSuperAdmin && !Boolean.TRUE.equals(currentUser.getIsVerified())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Your agency account is pending approval by Super Admin."));
            }

            String title = (String) body.get("title");
            String city = (String) body.get("city");
            String photo = (String) body.get("photo");
            String desc = (String) body.get("desc");
            Object priceObj = body.get("price");

            if (title == null || city == null || photo == null || desc == null || priceObj == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing essential tour fields"));
            }

            Double price = Double.valueOf(priceObj.toString());
            String address = (String) body.getOrDefault("address", city);
            Double distance = body.get("distance") != null ? Double.valueOf(body.get("distance").toString()) : 150.0;
            Integer maxGroupSize = body.get("maxGroupSize") != null ? Integer.valueOf(body.get("maxGroupSize").toString()) : 12;
            String category = (String) body.getOrDefault("category", "Adventure");
            String duration = (String) body.getOrDefault("duration", "3 Days / 2 Nights");
            String roomType = (String) body.getOrDefault("roomType", "3-Star Deluxe Hotel & Resort");
            Double rating = body.get("rating") != null ? Double.valueOf(body.get("rating").toString()) : 4.8;

            List<String> inclusions = parseStringList(body.get("inclusions"), Arrays.asList("Hotel Stay", "Daily Breakfast", "Sightseeing Transfer"));
            List<String> exclusions = parseStringList(body.get("exclusions"), Arrays.asList("Personal Souvenirs", "Flight / Train Tickets"));
            List<String> availableDates = parseStringList(body.get("availableDates"), Arrays.asList("2026-09-01", "2026-09-15", "2026-10-01"));

            String agencyName = currentUser.getAgencyName();
            if (agencyName == null || agencyName.isBlank()) {
                agencyName = currentUser.getName() != null ? currentUser.getName() : "TripSathi Agency";
            }

            Tour tour = new Tour();
            tour.setTitle(title);
            tour.setAgencyId(userDetails.getId());
            tour.setAgencyName(agencyName);
            tour.setCity(city);
            tour.setAddress(address);
            tour.setDistance(distance);
            tour.setPhoto(photo);
            tour.setDesc(desc);
            tour.setPrice(price);
            tour.setMaxGroupSize(maxGroupSize);
            tour.setCategory(category);
            tour.setDuration(duration);
            tour.setRoomType(roomType);
            tour.setRating(rating);
            tour.setInclusions(inclusions);
            tour.setExclusions(exclusions);
            tour.setAvailableDates(availableDates);
            tour.setFeatured(false);

            Tour savedTour = tourRepository.save(tour);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tour", savedTour);
            response.put("message", "Tour package published successfully!");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/update-tour/{id}")
    public ResponseEntity<?> updateTourPackage(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isAgencyOrAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied. Agency or Admin privileges required."));
            }

            Optional<Tour> tourOpt = tourRepository.findById(id);
            if (tourOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Tour package not found"));
            }

            Tour tour = tourOpt.get();
            boolean isSuperAdmin = "superadmin".equalsIgnoreCase(userDetails.getRole());

            if (!isSuperAdmin && (tour.getAgencyId() == null || !tour.getAgencyId().equals(userDetails.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Unauthorized to edit this package"));
            }

            if (body.containsKey("title")) tour.setTitle((String) body.get("title"));
            if (body.containsKey("city")) tour.setCity((String) body.get("city"));
            if (body.containsKey("address")) tour.setAddress((String) body.get("address"));
            if (body.containsKey("distance")) tour.setDistance(Double.valueOf(body.get("distance").toString()));
            if (body.containsKey("photo")) tour.setPhoto((String) body.get("photo"));
            if (body.containsKey("desc")) tour.setDesc((String) body.get("desc"));
            if (body.containsKey("price")) tour.setPrice(Double.valueOf(body.get("price").toString()));
            if (body.containsKey("maxGroupSize")) tour.setMaxGroupSize(Integer.valueOf(body.get("maxGroupSize").toString()));
            if (body.containsKey("category")) tour.setCategory((String) body.get("category"));
            if (body.containsKey("duration")) tour.setDuration((String) body.get("duration"));
            if (body.containsKey("roomType")) tour.setRoomType((String) body.get("roomType"));
            if (body.containsKey("rating")) tour.setRating(Double.valueOf(body.get("rating").toString()));

            if (body.containsKey("inclusions")) {
                tour.setInclusions(parseStringList(body.get("inclusions"), tour.getInclusions()));
            }
            if (body.containsKey("exclusions")) {
                tour.setExclusions(parseStringList(body.get("exclusions"), tour.getExclusions()));
            }

            Tour updatedTour = tourRepository.save(tour);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tour package updated successfully!");
            response.put("tour", updatedTour);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/delete-tour/{id}")
    public ResponseEntity<?> deleteAgencyTour(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isAgencyOrAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            Optional<Tour> tourOpt = tourRepository.findById(id);
            if (tourOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Tour package not found"));
            }

            Tour tour = tourOpt.get();
            boolean isSuperAdmin = "superadmin".equalsIgnoreCase(userDetails.getRole());

            if (!isSuperAdmin && (tour.getAgencyId() == null || !tour.getAgencyId().equals(userDetails.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Unauthorized to delete this package"));
            }

            tourRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Package removed successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/update-booking")
    public ResponseEntity<?> updateAgencyBookingStatus(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isAgencyOrAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            Object bookingIdObj = body.get("bookingId");
            String status = (String) body.get("status");

            if (bookingIdObj == null || status == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Booking ID and status are required"));
            }

            Long bookingId = Long.valueOf(bookingIdObj.toString());
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);

            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Booking not found"));
            }

            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            Booking updatedBooking = bookingRepository.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking status updated to " + status);
            response.put("booking", updatedBooking);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/coupon")
    public ResponseEntity<?> createAgencyCoupon(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isAgencyOrAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            String code = (String) body.get("code");
            Object discountAmountObj = body.get("discountAmount");

            if (code == null || discountAmountObj == null || code.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Coupon code and discount amount are required"));
            }

            String cleanCode = code.trim().toUpperCase();
            Double discountAmount = Double.valueOf(discountAmountObj.toString());
            Double minBookingAmount = body.get("minBookingAmount") != null ? Double.valueOf(body.get("minBookingAmount").toString()) : 0.0;

            User currentUser = userRepository.findById(userDetails.getId()).orElse(userDetails.getUser());
            String agencyName = currentUser.getAgencyName();
            if (agencyName == null || agencyName.isBlank()) {
                agencyName = currentUser.getName() != null ? currentUser.getName() : "TripSathi Agency";
            }

            Coupon coupon = new Coupon();
            coupon.setCode(cleanCode);
            coupon.setAgencyId(userDetails.getId());
            coupon.setAgencyName(agencyName);
            coupon.setDiscountAmount(discountAmount);
            coupon.setMinBookingAmount(minBookingAmount);
            coupon.setIsActive(true);

            Coupon savedCoupon = couponRepository.save(coupon);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("coupon", savedCoupon);
            response.put("message", "Coupon '" + cleanCode + "' created!");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseStringList(Object obj, List<String> defaultList) {
        if (obj == null) return defaultList;
        if (obj instanceof List) {
            return ((List<?>) obj).stream().map(Object::toString).filter(s -> !s.isBlank()).toList();
        }
        if (obj instanceof String) {
            return Arrays.stream(((String) obj).split(","))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .toList();
        }
        return defaultList;
    }
}
