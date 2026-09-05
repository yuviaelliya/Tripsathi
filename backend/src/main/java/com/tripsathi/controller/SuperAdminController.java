package com.tripsathi.controller;

import com.tripsathi.model.Booking;
import com.tripsathi.model.Tour;
import com.tripsathi.model.User;
import com.tripsathi.repository.BookingRepository;
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
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private boolean isSuperAdmin(CustomUserDetails userDetails) {
        if (userDetails == null) return false;
        return "superadmin".equalsIgnoreCase(userDetails.getRole())
                || "kishanaelliya@gmail.com".equalsIgnoreCase(userDetails.getUsername())
                || "admin@tripsathi.com".equalsIgnoreCase(userDetails.getUsername());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getMasterStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied. Super Admin privileges required."));
            }

            long totalUsers = userRepository.countByRole("user");
            long totalAgencies = userRepository.countByRole("agency");
            long totalTours = tourRepository.count();
            long totalBookings = bookingRepository.count();
            Double totalRevenue = bookingRepository.calculateTotalPlatformRevenue();
            if (totalRevenue == null) totalRevenue = 0.0;

            List<Booking> recentBookings = bookingRepository.findTop5ByOrderByCreatedAtDesc();
            List<User> agenciesList = userRepository.findByRoleOrderByCreatedAtDesc("agency");
            agenciesList.forEach(u -> u.setPassword(null));

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalAgencies", totalAgencies);
            stats.put("totalTours", totalTours);
            stats.put("totalBookings", totalBookings);
            stats.put("totalRevenue", totalRevenue);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            response.put("recentBookings", recentBookings);
            response.put("agenciesList", agenciesList);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/agencies")
    public ResponseEntity<?> getAllAgencies(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            List<User> agencies = userRepository.findByRoleOrderByCreatedAtDesc("agency");
            agencies.forEach(u -> u.setPassword(null));

            return ResponseEntity.ok(Map.of("success", true, "agencies", agencies));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/agency-status")
    public ResponseEntity<?> toggleAgencyVerification(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            Object agencyIdObj = body.get("agencyId");
            Object isVerifiedObj = body.get("isVerified");

            if (agencyIdObj == null || isVerifiedObj == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Agency ID and status required"));
            }

            Long agencyId = Long.valueOf(agencyIdObj.toString());
            boolean isVerified = Boolean.parseBoolean(isVerifiedObj.toString());

            Optional<User> agencyOpt = userRepository.findById(agencyId);
            if (agencyOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Agency not found"));
            }

            User agency = agencyOpt.get();
            agency.setIsVerified(isVerified);
            User savedAgency = userRepository.save(agency);
            savedAgency.setPassword(null);

            String agencyName = agency.getAgencyName() != null && !agency.getAgencyName().isBlank()
                    ? agency.getAgencyName() : agency.getName();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Agency " + agencyName + " " + (isVerified ? "verified" : "unverified") + " successfully!");
            response.put("agency", savedAgency);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/tours")
    public ResponseEntity<?> getAllMasterTours(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            List<Tour> tours = tourRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(Map.of("success", true, "tours", tours));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/tour/{id}")
    public ResponseEntity<?> deleteMasterTour(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            tourRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Tour package removed from platform."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getAllMasterBookings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            List<Booking> bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(Map.of("success", true, "bookings", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/update-booking-status")
    public ResponseEntity<?> updateMasterBookingStatus(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (!isSuperAdmin(userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied."));
            }

            Object bookingIdObj = body.get("bookingId");
            if (bookingIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Booking ID is required"));
            }

            Long bookingId = Long.valueOf(bookingIdObj.toString());
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);

            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Booking not found"));
            }

            Booking booking = bookingOpt.get();
            if (body.containsKey("status") && body.get("status") != null) {
                booking.setStatus(body.get("status").toString());
            }
            if (body.containsKey("paymentStatus") && body.get("paymentStatus") != null) {
                booking.setPaymentStatus(body.get("paymentStatus").toString());
            }

            Booking updatedBooking = bookingRepository.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking status updated");
            response.put("booking", updatedBooking);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
