package com.tripsathi.repository;

import com.tripsathi.model.Buddy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuddyRepository extends JpaRepository<Buddy, Long> {

    List<Buddy> findByStatusOrderByCreatedAtDesc(String status);

    List<Buddy> findByStatusAndDestinationContainingIgnoreCaseOrderByCreatedAtDesc(String status, String destination);
}
