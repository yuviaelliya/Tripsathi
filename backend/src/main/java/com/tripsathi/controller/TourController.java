package com.tripsathi.controller;

import com.tripsathi.model.Review;
import com.tripsathi.model.Tour;
import com.tripsathi.repository.ReviewRepository;
import com.tripsathi.repository.TourRepository;
import com.tripsathi.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<?> getAllTours(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String sort
    ) {
        try {
            List<Tour> tours = tourRepository.findAll();

            // Filter in memory for maximum safety & flexible matching
            if (city != null && !city.isBlank()) {
                String search = city.trim().toLowerCase();
                tours = tours.stream()
                        .filter(t -> (t.getCity() != null && t.getCity().toLowerCase().contains(search))
                                || (t.getTitle() != null && t.getTitle().toLowerCase().contains(search))
                                || (t.getDesc() != null && t.getDesc().toLowerCase().contains(search)))
                        .collect(Collectors.toList());
            }

            if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
                tours = tours.stream()
                        .filter(t -> category.equalsIgnoreCase(t.getCategory()))
                        .collect(Collectors.toList());
            }

            if (maxPrice != null) {
                tours = tours.stream()
                        .filter(t -> t.getPrice() != null && t.getPrice() <= maxPrice)
                        .collect(Collectors.toList());
            }

            if (rating != null) {
                tours = tours.stream()
                        .filter(t -> t.getRating() != null && t.getRating() >= rating)
                        .collect(Collectors.toList());
            }

            // Sorting
            if ("price-low".equalsIgnoreCase(sort)) {
                tours.sort(Comparator.comparing(Tour::getPrice, Comparator.nullsLast(Comparator.naturalOrder())));
            } else if ("price-high".equalsIgnoreCase(sort)) {
                tours.sort(Comparator.comparing(Tour::getPrice, Comparator.nullsLast(Comparator.reverseOrder())));
            } else if ("rating".equalsIgnoreCase(sort)) {
                tours.sort(Comparator.comparing(Tour::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
            } else {
                tours.sort(Comparator.comparing(Tour::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tours", tours);
            response.put("count", tours.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSingleTour(@PathVariable String id) {
        try {
            Long tourId;
            try {
                tourId = Long.parseLong(id);
            } catch (NumberFormatException e) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Tour package not found in DB", "reviews", Collections.emptyList()));
            }

            Optional<Tour> tourOpt = tourRepository.findById(tourId);
            List<Review> reviews = reviewRepository.findByTourIdOrderByCreatedAtDesc(id);

            if (tourOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Tour package not found in DB", "reviews", reviews));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tour", tourOpt.get());
            response.put("reviews", reviews);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", e.getMessage(), "reviews", Collections.emptyList()));
        }
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addTourReview(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Please login to leave a review"));
            }

            String reviewText = (String) body.get("reviewText");
            Object ratingObj = body.get("rating");

            if (reviewText == null || reviewText.isBlank() || ratingObj == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Review text and rating are required"));
            }

            Double rating = Double.valueOf(ratingObj.toString());

            Review review = new Review();
            review.setTourId(id);
            review.setUserId(userDetails.getId());
            review.setUsername(userDetails.getUser().getName() != null ? userDetails.getUser().getName() : "Traveler");
            review.setReviewText(reviewText);
            review.setRating(rating);

            Review savedReview = reviewRepository.save(review);

            // Recalculate average rating
            List<Review> allReviews = reviewRepository.findByTourIdOrderByCreatedAtDesc(id);
            if (!allReviews.isEmpty()) {
                double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(rating);
                double roundedAvg = Math.round(avg * 10.0) / 10.0;
                try {
                    Long tourId = Long.parseLong(id);
                    tourRepository.findById(tourId).ifPresent(t -> {
                        t.setRating(roundedAvg);
                        tourRepository.save(t);
                    });
                } catch (NumberFormatException ignored) {}
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Review submitted successfully!");
            response.put("review", savedReview);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
