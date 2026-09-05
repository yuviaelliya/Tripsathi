package com.tripsathi.controller;

import com.tripsathi.model.Buddy;
import com.tripsathi.repository.BuddyRepository;
import com.tripsathi.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buddies")
public class BuddyController {

    @Autowired
    private BuddyRepository buddyRepository;

    @GetMapping
    public ResponseEntity<?> getBuddies(@RequestParam(required = false) String destination) {
        try {
            List<Buddy> buddies;
            if (destination != null && !destination.isBlank()) {
                buddies = buddyRepository.findByStatusAndDestinationContainingIgnoreCaseOrderByCreatedAtDesc("open", destination.trim());
            } else {
                buddies = buddyRepository.findByStatusOrderByCreatedAtDesc("open");
            }
            return ResponseEntity.ok(Map.of("success", true, "buddies", buddies));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createBuddyPost(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Please login to post a buddy request"));
            }

            String destination = (String) body.get("destination");
            String startDate = (String) body.get("startDate");
            String description = (String) body.get("description");

            if (destination == null || destination.isBlank() || startDate == null || startDate.isBlank() || description == null || description.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Destination, date, and description are required"));
            }

            String budget = (String) body.getOrDefault("budget", "Flexible");
            String contactPhone = (String) body.getOrDefault("contactPhone", "");
            Integer lookingForCount = body.get("lookingForCount") != null ? Integer.valueOf(body.get("lookingForCount").toString()) : 1;

            Buddy buddy = new Buddy();
            buddy.setUserId(userDetails.getId());
            buddy.setUserName(userDetails.getUser().getName() != null ? userDetails.getUser().getName() : "Traveler");
            buddy.setUserEmail(userDetails.getUser().getEmail() != null ? userDetails.getUser().getEmail() : "");
            buddy.setDestination(destination);
            buddy.setStartDate(startDate);
            buddy.setBudget(budget != null ? budget : "Flexible");
            buddy.setDescription(description);
            buddy.setLookingForCount(lookingForCount);
            buddy.setContactPhone(contactPhone != null ? contactPhone : "");
            buddy.setStatus("open");

            Buddy savedBuddy = buddyRepository.save(buddy);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Buddy request posted!");
            response.put("buddy", savedBuddy);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
