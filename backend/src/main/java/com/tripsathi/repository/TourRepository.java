package com.tripsathi.repository;

import com.tripsathi.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    List<Tour> findAllByOrderByCreatedAtDesc();

    List<Tour> findByAgencyIdOrderByCreatedAtDesc(Long agencyId);

    @Query("SELECT t FROM Tour t WHERE " +
           "(:city IS NULL OR LOWER(t.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(t.title) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(t.desc) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:category IS NULL OR :category = 'All' OR t.category = :category) AND " +
           "(:maxPrice IS NULL OR t.price <= :maxPrice) AND " +
           "(:rating IS NULL OR t.rating >= :rating)")
    List<Tour> filterTours(
            @Param("city") String city,
            @Param("category") String category,
            @Param("maxPrice") Double maxPrice,
            @Param("rating") Double rating
    );
}
