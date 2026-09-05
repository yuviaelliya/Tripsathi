package com.tripsathi.controller;

import com.tripsathi.model.User;
import com.tripsathi.repository.UserRepository;
import com.tripsathi.security.CustomUserDetails;
import com.tripsathi.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final String SUPER_ADMIN_EMAIL = "kishanaelliya@gmail.com";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            String email = (String) body.get("email");
            String password = (String) body.get("password");

            if (name == null || email == null || password == null || name.isBlank() || email.isBlank() || password.isBlank()) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Name, email, and password are required"));
            }

            String cleanEmail = email.trim().toLowerCase();

            if (userRepository.existsByEmail(cleanEmail)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Account with this email already exists"));
            }

            String role = (String) body.getOrDefault("role", "user");
            boolean isVerified = "user".equalsIgnoreCase(role);

            if (cleanEmail.equalsIgnoreCase(SUPER_ADMIN_EMAIL)) {
                role = "superadmin";
                isVerified = true;
            }

            User user = new User();
            user.setName(name);
            user.setEmail(cleanEmail);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role != null ? role : "user");
            user.setAgencyName((String) body.getOrDefault("agencyName", ""));
            user.setPhone((String) body.getOrDefault("phone", ""));
            user.setBusinessAddress((String) body.getOrDefault("businessAddress", ""));
            user.setLicenseNumber((String) body.getOrDefault("licenseNumber", ""));
            user.setDescription((String) body.getOrDefault("description", ""));
            user.setIsVerified(isVerified);

            User savedUser = userRepository.save(user);
            String token = jwtUtils.generateToken(savedUser.getId());

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", savedUser.getId());
            userData.put("_id", savedUser.getId().toString());
            userData.put("name", savedUser.getName());
            userData.put("email", savedUser.getEmail());
            userData.put("role", savedUser.getRole());
            userData.put("agencyName", savedUser.getAgencyName());
            userData.put("phone", savedUser.getPhone());
            userData.put("isVerified", savedUser.getIsVerified());

            String message = "agency".equalsIgnoreCase(role)
                    ? "Agency registration submitted successfully! Awaiting Super Admin verification."
                    : "Registered successfully!";

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("user", userData);
            response.put("message", message);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, Object> body) {
        try {
            String email = (String) body.get("email");
            String password = (String) body.get("password");

            if (email == null || password == null || email.isBlank() || password.isBlank()) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Email and password are required"));
            }

            String cleanEmail = email.trim().toLowerCase();
            Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

            // Auto seed Super Admin account if logging in for the first time
            if (userOpt.isEmpty() && cleanEmail.equalsIgnoreCase(SUPER_ADMIN_EMAIL)) {
                User superAdmin = new User();
                superAdmin.setName("Super Admin (Kishan Aelliya)");
                superAdmin.setEmail(cleanEmail);
                superAdmin.setPassword(passwordEncoder.encode("Yuvii@9708"));
                superAdmin.setRole("superadmin");
                superAdmin.setIsVerified(true);
                superAdmin.setPhone("9104847916");
                superAdmin.setBusinessAddress("Banaskantha, Gujarat");
                userOpt = Optional.of(userRepository.save(superAdmin));
            }

            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of("success", false, "message", "User account not found"));
            }

            User user = userOpt.get();

            // Auto promote Super Admin email if needed
            if (cleanEmail.equalsIgnoreCase(SUPER_ADMIN_EMAIL) && (!"superadmin".equals(user.getRole()) || !user.getIsVerified())) {
                user.setRole("superadmin");
                user.setIsVerified(true);
                user = userRepository.save(user);
            }

            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtils.generateToken(user.getId());

                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("_id", user.getId().toString());
                userData.put("name", user.getName());
                userData.put("email", user.getEmail());
                userData.put("role", user.getRole());
                userData.put("agencyName", user.getAgencyName());
                userData.put("phone", user.getPhone());
                userData.put("isVerified", user.getIsVerified());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", token);
                response.put("user", userData);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok(Map.of("success", false, "message", "Invalid password or credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
            }
            User user = userRepository.findById(userDetails.getId()).orElse(null);
            if (user == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "User not found"));
            }

            // Exclude password in response
            user.setPassword(null);
            return ResponseEntity.ok(Map.of("success", true, "user", user));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
