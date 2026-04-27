package com.edufund.backend.controller;

import com.edufund.backend.dto.LoginRequest;
import com.edufund.backend.dto.RegisterRequest;
import com.edufund.backend.model.User;
import com.edufund.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

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
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailAndRole(email, request.getRole())) {
            return ResponseEntity.badRequest().body("An account already exists for this role with the email: " + email);
        }
        
        String userId = request.getRole().name() + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(userId, email, request.getPassword(), request.getName(), request.getRole());
        userRepository.save(user);
        
        return ResponseEntity.ok(user);
    }
}
