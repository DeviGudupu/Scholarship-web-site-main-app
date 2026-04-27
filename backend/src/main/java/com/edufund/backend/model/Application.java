package com.edufund.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Application {
    @Id
    private String id;
    
    private String scholarshipId;
    private String studentId;
    
    // Form Details
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String gpa;
    private String major;
    private String year;
    
    @Column(columnDefinition = "TEXT")
    private String statement;
    
    // Status can be: 'submitted', 'pending', 'approved', 'rejected'
    private String status;
    
    private String submittedDate;
    
    @ElementCollection
    private List<String> documents;

    public Application() {}

    public Application(String id, String scholarshipId, String studentId, String status, String submittedDate, List<String> documents) {
        this.id = id;
        this.scholarshipId = scholarshipId;
        this.studentId = studentId;
        this.status = status;
        this.submittedDate = submittedDate;
        this.documents = documents;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(String scholarshipId) { this.scholarshipId = scholarshipId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(String submittedDate) { this.submittedDate = submittedDate; }
    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGpa() { return gpa; }
    public void setGpa(String gpa) { this.gpa = gpa; }
    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getStatement() { return statement; }
    public void setStatement(String statement) { this.statement = statement; }
}
