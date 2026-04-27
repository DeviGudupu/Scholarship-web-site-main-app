package com.edufund.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
public class Application {
    @Id
    private String id;
    
    private String scholarshipId;
    private String studentId;
    
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
}
