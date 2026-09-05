package com.tripsathi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.NumberFormat;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static class ActivityTemplate {
        final String morning;
        final String afternoon;
        final String evening;
        final String stay;

        ActivityTemplate(String morning, String afternoon, String evening, String stay) {
            this.morning = morning;
            this.afternoon = afternoon;
            this.evening = evening;
            this.stay = stay;
        }
    }

    private final List<ActivityTemplate> activitiesPool = Arrays.asList(
            new ActivityTemplate(
                    "Sunrise viewpoint hike & breakfast at popular local cafe",
                    "Guided heritage tour & museum visit",
                    "Sunset boat ride & night market shopping",
                    "Boutique Heritage Resort"
            ),
            new ActivityTemplate(
                    "Scenic waterfall trek & zip-lining adventure",
                    "Authentic local food tasting & cooking workshop",
                    "Acoustic bonfire night with live local music",
                    "Mountain View Cabin"
            ),
            new ActivityTemplate(
                    "Visit ancient temples & architectural monuments",
                    "Traditional handicraft shopping & photo walks",
                    "Rooftop lounge dinner & cultural dance show",
                    "Luxury Eco Lodge"
            ),
            new ActivityTemplate(
                    "Wildlife safari drive or lake kayaking session",
                    "Leisure stroll through old town cobblestone streets",
                    "Fine dining dinner with panoramic city views",
                    "5-Star Riverside Suites"
            ),
            new ActivityTemplate(
                    "Hot air balloon ride or scenic cable car trip",
                    "Spa relaxation & traditional wellness session",
                    "Farewell candle-light dinner by the lake",
                    "Grand Deluxe Hotel"
            )
    );

    @PostMapping("/generate-itinerary")
    public ResponseEntity<?> generateItinerary(@RequestBody Map<String, Object> body) {
        try {
            String destination = (String) body.get("destination");
            Object daysObj = body.get("days");

            if (destination == null || destination.isBlank() || daysObj == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Destination and days are required."));
            }

            int totalDays = Integer.parseInt(daysObj.toString());
            if (totalDays <= 0) totalDays = 3;

            String style = (String) body.getOrDefault("travelStyle", "Adventure & Exploration");
            String budgetLevel = (String) body.getOrDefault("budget", "Standard");

            List<Map<String, Object>> itinerary = new ArrayList<>();

            for (int i = 1; i <= totalDays; i++) {
                ActivityTemplate template = activitiesPool.get((i - 1) % activitiesPool.size());

                String estimatedCost;
                if ("Budget".equalsIgnoreCase(budgetLevel)) {
                    estimatedCost = "₹2,500 - ₹3,500 per person";
                } else if ("Luxury".equalsIgnoreCase(budgetLevel)) {
                    estimatedCost = "₹8,500 - ₹15,000 per person";
                } else {
                    estimatedCost = "₹4,500 - ₹6,500 per person";
                }

                Map<String, Object> dayPlan = new HashMap<>();
                dayPlan.put("day", i);
                dayPlan.put("title", String.format("Day %d: %s %s Highlights", i, destination, style));
                dayPlan.put("morning", template.morning);
                dayPlan.put("afternoon", template.afternoon);
                dayPlan.put("evening", template.evening);
                dayPlan.put("recommendedStay", template.stay);
                dayPlan.put("estimatedCost", estimatedCost);

                itinerary.add(dayPlan);
            }

            long totalRate = "Budget".equalsIgnoreCase(budgetLevel) ? 3000L : "Luxury".equalsIgnoreCase(budgetLevel) ? 11000L : 5500L;
            long estimatedTotal = totalDays * totalRate;

            NumberFormat indianCurrencyFormat = NumberFormat.getInstance(new Locale("en", "IN"));

            Map<String, Object> data = new HashMap<>();
            data.put("destination", destination);
            data.put("days", totalDays);
            data.put("budget", budgetLevel);
            data.put("travelStyle", style);
            data.put("estimatedTotal", "₹" + indianCurrencyFormat.format(estimatedTotal));
            data.put("highlights", Arrays.asList(
                    "Verified local guides included",
                    "Best seasons: Oct to April",
                    "24/7 Sathi Emergency Assistance"
            ));
            data.put("itinerary", itinerary);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", data);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
