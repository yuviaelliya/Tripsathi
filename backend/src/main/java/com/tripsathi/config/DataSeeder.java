package com.tripsathi.config;

import com.tripsathi.model.Coupon;
import com.tripsathi.model.Tour;
import com.tripsathi.model.User;
import com.tripsathi.repository.CouponRepository;
import com.tripsathi.repository.TourRepository;
import com.tripsathi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private static final String SUPER_ADMIN_EMAIL = "kishanaelliya@gmail.com";

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            seedSuperAdmin();
            seedInitialTours();
            seedInitialCoupons();
        } catch (Exception e) {
            logger.warn("DataSeeder skipped initial seed due to DB schema initialization state: {}", e.getMessage());
        }
    }

    private void seedSuperAdmin() {
        if (!userRepository.existsByEmail(SUPER_ADMIN_EMAIL)) {
            User superAdmin = new User();
            superAdmin.setName("Super Admin (Kishan Aelliya)");
            superAdmin.setEmail(SUPER_ADMIN_EMAIL);
            superAdmin.setPassword(passwordEncoder.encode("Yuvii@9708"));
            superAdmin.setRole("superadmin");
            superAdmin.setIsVerified(true);
            superAdmin.setPhone("9104847916");
            superAdmin.setBusinessAddress("Banaskantha, Gujarat");
            superAdmin.setDescription("TripSathi Platform Master Administrator");
            userRepository.save(superAdmin);
            logger.info("Default Super Admin account initialized: {}", SUPER_ADMIN_EMAIL);
        }
    }

    private void seedInitialTours() {
        if (tourRepository.count() == 0) {
            List<Tour> defaultTours = Arrays.asList(
                    createTour(
                            "Manali Alpine & Solang Valley Adventure",
                            "Manali",
                            "Solang Valley, Himachal Pradesh",
                            540.0,
                            "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
                            "Experience snow peaks, paragliding in Solang, Rohtang Pass, and scenic valley walks in beautiful Manali with top-rated Himalayan guides.",
                            12999.0,
                            15,
                            "Adventure",
                            "5 Days / 4 Nights",
                            "3-Star Deluxe Alpine Resort",
                            true,
                            4.9,
                            Arrays.asList("3-Star Hotel Stay", "Breakfast & Dinner", "Solang Valley Transfer", "Bonfire Night"),
                            Arrays.asList("Personal Gear", "Flight/Train to Delhi"),
                            Arrays.asList("2026-09-10", "2026-09-25", "2026-10-05"),
                            "Himalayan Treks & Tours"
                    ),
                    createTour(
                            "Goa Beachside Sunset & Cruise Luxury",
                            "Goa",
                            "Calangute & Baga Beach, Goa",
                            600.0,
                            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
                            "Relax on golden sand beaches, enjoy water sports, Mandovi river luxury sunset cruises, and vibrant nightlife experience.",
                            15499.0,
                            20,
                            "Beach",
                            "4 Days / 3 Nights",
                            "Beachside Boutique Resort",
                            true,
                            4.8,
                            Arrays.asList("Resort with Pool", "Daily Breakfast", "Sunset Cruise Ticket", "Airport Transfers"),
                            Arrays.asList("Water Sports Charges", "Alcohol & Personal Drinks"),
                            Arrays.asList("2026-09-12", "2026-09-28", "2026-10-10"),
                            "Sun & Sand Escapes"
                    ),
                    createTour(
                            "Kerela Backwaters & Munnar Tea Gardens",
                            "Munnar",
                            "Munnar & Alleppey, Kerala",
                            450.0,
                            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
                            "Lush green tea plantations, soothing Alleppey houseboat stays, spice plantations, and serene coastal backwater cruises.",
                            18999.0,
                            12,
                            "Relaxation",
                            "6 Days / 5 Nights",
                            "Luxury Houseboat & Munnar Resort",
                            true,
                            4.95,
                            Arrays.asList("Houseboat Stay", "Munnar Hill Resort", "Spice Garden Tour", "All Meals on Houseboat"),
                            Arrays.asList("Airfare", "Personal Souvenirs"),
                            Arrays.asList("2026-09-15", "2026-10-01", "2026-10-20"),
                            "God's Own Travel Agency"
                    ),
                    createTour(
                            "Jaipur & Udaipur Royal Heritage Tour",
                            "Jaipur",
                            "Amer Fort, Jaipur & Lake Pichola, Udaipur",
                            380.0,
                            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
                            "Explore majestic forts, royal palaces, Lake Pichola boat rides, traditional Rajasthani cuisine, and cultural folk dances.",
                            14200.0,
                            18,
                            "Cultural",
                            "5 Days / 4 Nights",
                            "Heritage Palace Hotel",
                            false,
                            4.7,
                            Arrays.asList("Heritage Palace Hotel", "Fort Entry Passes", "Folk Cultural Show", "AC Private Coach"),
                            Arrays.asList("Camera Fees", "Tips & Gratuities"),
                            Arrays.asList("2026-09-20", "2026-10-05"),
                            "Royal Rajputana Travels"
                    ),
                    createTour(
                            "Leh Ladakh Pangong Lake Expedition",
                            "Leh",
                            "Khardung La & Pangong Tso, Ladakh",
                            980.0,
                            "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
                            "High mountain passes, crystal clear Pangong Tso lake, Nubra valley camel safari, and ancient Buddhist monasteries.",
                            24999.0,
                            10,
                            "Trekking",
                            "7 Days / 6 Nights",
                            "Deluxe Camps & Mountain Hotel",
                            true,
                            4.9,
                            Arrays.asList("Oxygen Cylinder SUV", "Luxury Tents at Pangong", "Inner Line Permits", "All Meals"),
                            Arrays.asList("Flight to Leh"),
                            Arrays.asList("2026-09-05", "2026-09-18"),
                            "High Altitude Expeditions"
                    ),
                    createTour(
                            "Rishikesh River Rafting & Camping Thrill",
                            "Rishikesh",
                            "Shivpuri, Rishikesh, Uttarakhand",
                            240.0,
                            "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
                            "White water river rafting in Ganga, cliff jumping, riverside camping, acoustic bonfire night, and Ganga Aarti experience.",
                            6999.0,
                            25,
                            "Adventure",
                            "3 Days / 2 Nights",
                            "Riverside Luxury Alpine Camps",
                            false,
                            4.85,
                            Arrays.asList("Riverside Camping", "16KM Rafting Gear", "Bonfire & Music", "All Camp Meals"),
                            Arrays.asList("Bungee Jumping Pass"),
                            Arrays.asList("2026-09-01", "2026-09-08", "2026-09-15"),
                            "Himalayan Treks & Tours"
                    )
            );

            tourRepository.saveAll(defaultTours);
            logger.info("Successfully seeded {} default tour packages.", defaultTours.size());
        }
    }

    private void seedInitialCoupons() {
        if (couponRepository.count() == 0) {
            Coupon c1 = new Coupon();
            c1.setCode("FIRSTTRIP10");
            c1.setAgencyId(1L);
            c1.setAgencyName("TripSathi Official");
            c1.setDiscountAmount(1000.0);
            c1.setMinBookingAmount(5000.0);
            c1.setIsActive(true);

            Coupon c2 = new Coupon();
            c2.setCode("SATHISPECIAL");
            c2.setAgencyId(1L);
            c2.setAgencyName("TripSathi Official");
            c2.setDiscountAmount(500.0);
            c2.setMinBookingAmount(3000.0);
            c2.setIsActive(true);

            couponRepository.saveAll(Arrays.asList(c1, c2));
            logger.info("Default promo coupons seeded.");
        }
    }

    private Tour createTour(
            String title, String city, String address, Double distance, String photo,
            String desc, Double price, Integer maxGroupSize, String category,
            String duration, String roomType, Boolean featured, Double rating,
            List<String> inclusions, List<String> exclusions, List<String> availableDates,
            String agencyName
    ) {
        Tour tour = new Tour();
        tour.setTitle(title);
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
        tour.setFeatured(featured);
        tour.setRating(rating);
        tour.setInclusions(inclusions);
        tour.setExclusions(exclusions);
        tour.setAvailableDates(availableDates);
        tour.setAgencyName(agencyName);
        tour.setAgencyId(1L);
        return tour;
    }
}
