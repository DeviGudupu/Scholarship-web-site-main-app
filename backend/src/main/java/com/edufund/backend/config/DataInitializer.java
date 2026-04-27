package com.edufund.backend.config;

import com.edufund.backend.model.Role;
import com.edufund.backend.model.Scholarship;
import com.edufund.backend.model.User;
import com.edufund.backend.repository.ScholarshipRepository;
import com.edufund.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, ScholarshipRepository scholarshipRepository) {
        return args -> {
            // Initial Users
            if (userRepository.count() == 0) {
                userRepository.save(new User("student1", "student@edufund.com", "student123", "Demo Student", Role.student));
                userRepository.save(new User("admin1", "admin@edufund.com", "admin123", "Demo Admin", Role.admin));
            }

            // Initial Scholarships
            if (scholarshipRepository.count() == 0) {
                scholarshipRepository.save(new Scholarship(
                    "1", "Merit-Based Academic Scholarship", 5000.0, "2026-05-15", "Academic",
                    "Awarded to students with outstanding academic achievements...",
                    Arrays.asList("GPA of 3.5 or higher", "Full-time student"),
                    Arrays.asList("Transcript", "Personal Statement"), "National Education Foundation"
                ));
                scholarshipRepository.save(new Scholarship(
                    "2", "STEM Excellence Award", 7500.0, "2026-04-20", "STEM",
                    "Supporting students in Science, Tech, Engineering, and Math...",
                    Arrays.asList("STEM major", "Minimum GPA 3.0"),
                    Arrays.asList("Transcript", "Project Portfolio"), "Tech Innovation Fund"
                ));
                scholarshipRepository.save(new Scholarship(
                    "3", "Global Leaders Program", 10000.0, "2026-06-01", "International",
                    "For students demonstrating exceptional leadership in community service...",
                    Arrays.asList("Community service record", "International student status"),
                    Arrays.asList("Resume", "Recommendation Letter"), "Global Visionaries"
                ));
                scholarshipRepository.save(new Scholarship(
                    "4", "Future Educators Grant", 3000.0, "2026-08-30", "Education",
                    "Supporting the next generation of passionate teachers...",
                    Arrays.asList("Education major", "Undergraduate level"),
                    Arrays.asList("Transcript", "Teaching Philosophy Essay"), "Teachers of Tomorrow"
                ));
                scholarshipRepository.save(new Scholarship(
                    "5", "Women in Technology Scholarship", 6000.0, "2026-05-30", "STEM",
                    "Empowering women to pursue careers in computing and IT...",
                    Arrays.asList("Identifies as female", "Computer Science major"),
                    Arrays.asList("Portfolio", "Essay"), "Women Who Code"
                ));
                scholarshipRepository.save(new Scholarship(
                    "6", "Arts & Humanity Fellowship", 4500.0, "2026-07-15", "Arts",
                    "Recognition for creative excellence in visual or performing arts...",
                    Arrays.asList("Arts major", "Portfolio submission"),
                    Arrays.asList("Work Portfolio", "Artist Statement"), "Creative Arts Council"
                ));
                scholarshipRepository.save(new Scholarship(
                    "7", "Rural Healthcare Initiative", 8000.0, "2026-09-10", "Medical",
                    "For medical students committed to serving in rural communities...",
                    Arrays.asList("Medical student", "Commitment to rural service"),
                    Arrays.asList("Medical License/Proof", "Service Plan"), "Rural Health Org"
                ));
                scholarshipRepository.save(new Scholarship(
                    "8", "First-Gen College Fund", 2500.0, "2026-05-01", "Merit",
                    "Supporting first-generation college students in their journey...",
                    Arrays.asList("First-generation student", "Minimum GPA 2.5"),
                    Arrays.asList("Family background proof", "Essay"), "Step-Up Foundation"
                ));
                scholarshipRepository.save(new Scholarship(
                    "9", "Sustainability Innovation Grant", 5500.0, "2026-10-20", "Science",
                    "Awarded to students working on innovative environmental solutions...",
                    Arrays.asList("Environmental Science or Engineering", "Research project"),
                    Arrays.asList("Project Proposal", "Transcript"), "Green Future Corp"
                ));
                scholarshipRepository.save(new Scholarship(
                    "10", "Diversity in Law Scholarship", 7000.0, "2026-04-30", "Law",
                    "Increasing representation of minority groups in the legal field...",
                    Arrays.asList("Law student", "Minority group member"),
                    Arrays.asList("LSAT scores", "Diversity Statement"), "Legal Access Alliance"
                ));
                scholarshipRepository.save(new Scholarship(
                    "11", "Entrepreneurial Spirit Award", 4000.0, "2026-11-05", "Business",
                    "For students with a proven track record of starting ventures...",
                    Arrays.asList("Business owner or startup founder", "Business major"),
                    Arrays.asList("Pitch Deck", "Financial Report"), "Startup Incubator"
                ));
                scholarshipRepository.save(new Scholarship(
                    "12", "Veteran Appreciation Grant", 3500.0, "2026-12-01", "General",
                    "A thank you to those who served and are now pursuing education...",
                    Arrays.asList("Military veteran status", "Full-time student"),
                    Arrays.asList("Military ID", "Proof of Enrollment"), "Veterans Affairs"
                ));
            }
        };
    }
}
