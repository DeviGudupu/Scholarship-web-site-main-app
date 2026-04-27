package com.edufund.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
public class Scholarship {
    @Id
    private String id;
    
    private String title;
    private Double amount;
    private String deadline;
    private String category;
    
    @Column(length = 2000)
    private String description;
    
    @ElementCollection
    private List<String> eligibility;
    
    @ElementCollection
    private List<String> requiredDocuments;
    
    private String organization;

    public Scholarship() {}

    public Scholarship(String id, String title, Double amount, String deadline, String category, String description, List<String> eligibility, List<String> requiredDocuments, String organization) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.deadline = deadline;
        this.category = category;
        this.description = description;
        this.eligibility = eligibility;
        this.requiredDocuments = requiredDocuments;
        this.organization = organization;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getEligibility() { return eligibility; }
    public void setEligibility(List<String> eligibility) { this.eligibility = eligibility; }
    public List<String> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<String> requiredDocuments) { this.requiredDocuments = requiredDocuments; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
}
