package com.edufund.backend.repository;

import com.edufund.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByStudentId(String studentId);
    void deleteByScholarshipId(String scholarshipId);
}
