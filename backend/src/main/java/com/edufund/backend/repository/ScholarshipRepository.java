package com.edufund.backend.repository;

import com.edufund.backend.model.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScholarshipRepository extends JpaRepository<Scholarship, String> {
}
