package com.edufund.backend.controller;

import com.edufund.backend.dto.LoginRequest;
import com.edufund.backend.dto.RegisterRequest;
import com.edufund.backend.model.User;
import com.edufund.backend.repository.UserRepository;
import com.edufund.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Temporary storage for OTPs (Email -> OTP)
    private static final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email").trim().toLowerCase();
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        otpStorage.put(email, otp);
        
        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                if (user.getRole().equals(request.getRole())) {
                    return ResponseEntity.ok(user);
                } else {
                    return ResponseEntity.status(401).body("Incorrect role selected for this account");
                }
            } else {
                return ResponseEntity.status(401).body("Invalid password");
            }
        }
        
        return ResponseEntity.status(401).body("No account found with this email");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        System.out.println("DEBUG: Registration attempt for email: " + request.getEmail());
        String email = request.getEmail().trim().toLowerCase();
        
        if (userRepository.existsByEmailAndRole(email, request.getRole())) {
            return ResponseEntity.badRequest().body("An account already exists with this email.");
        }
        
        String userId = request.getRole().name() + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(userId, email, passwordEncoder.encode(request.getPassword()), request.getName(), request.getRole());
        userRepository.save(user);
        
        System.out.println("DEBUG: User registered successfully in database!");
        return ResponseEntity.ok(user);
    }
}
