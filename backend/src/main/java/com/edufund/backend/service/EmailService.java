package com.edufund.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        System.out.println("DEBUG: Attempting to send OTP email to: " + to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("EduFund - Your OTP for Registration");
        message.setText("Welcome to EduFund!\n\nYour One-Time Password for registration is: " + otp + 
                        "\n\nPlease enter this code to verify your email address.\n\nThank you!");
        try {
            mailSender.send(message);
            System.out.println("DEBUG: OTP email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("DEBUG: FAILED to send OTP email to: " + to + ". Error: " + e.getMessage());
            throw e; // Rethrow to inform the controller
        }
    }
}
