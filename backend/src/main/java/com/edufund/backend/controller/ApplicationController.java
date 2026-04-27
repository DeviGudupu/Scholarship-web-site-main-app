package com.edufund.backend.controller;

import com.edufund.backend.model.Application;
import com.edufund.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Application> getApplicationsByStudent(@PathVariable String studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    @PostMapping
    public Application addApplication(@RequestBody Application application) {
        if (application.getId() == null) {
            application.setId("app" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (application.getSubmittedDate() == null) {
            application.setSubmittedDate(LocalDate.now().toString());
        }
        if (application.getStatus() == null) {
            application.setStatus("submitted");
        }
        return applicationRepository.save(application);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable String id, @RequestBody String status) {
        // Remove quotes if present from request body
        final String cleanStatus = status.replace("\"", "");
        return applicationRepository.findById(id)
                .map(app -> {
                    app.setStatus(cleanStatus);
                    return ResponseEntity.ok(applicationRepository.save(app));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable String id) {
        if (applicationRepository.existsById(id)) {
            applicationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
