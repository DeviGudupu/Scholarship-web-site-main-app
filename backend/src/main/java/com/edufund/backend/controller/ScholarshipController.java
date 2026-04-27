package com.edufund.backend.controller;

import com.edufund.backend.model.Scholarship;
import com.edufund.backend.repository.ScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @GetMapping
    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

    @PostMapping
    public Scholarship createScholarship(@RequestBody Scholarship scholarship) {
        if (scholarship.getId() == null) {
            scholarship.setId("s" + UUID.randomUUID().toString().substring(0, 8));
        }
        return scholarshipRepository.save(scholarship);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scholarship> updateScholarship(@PathVariable String id, @RequestBody Scholarship updates) {
        return scholarshipRepository.findById(id)
                .map(existing -> {
                    if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
                    if (updates.getAmount() != null) existing.setAmount(updates.getAmount());
                    if (updates.getDeadline() != null) existing.setDeadline(updates.getDeadline());
                    if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
                    if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
                    if (updates.getEligibility() != null) existing.setEligibility(updates.getEligibility());
                    if (updates.getRequiredDocuments() != null) existing.setRequiredDocuments(updates.getRequiredDocuments());
                    if (updates.getOrganization() != null) existing.setOrganization(updates.getOrganization());
                    return ResponseEntity.ok(scholarshipRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScholarship(@PathVariable String id) {
        if (scholarshipRepository.existsById(id)) {
            scholarshipRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
