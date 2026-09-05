package com.tripsathi.repository;

import com.tripsathi.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Booking> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT b FROM Booking b WHERE b.agencyId = :agencyId OR b.agencyName = :agencyName ORDER BY b.createdAt DESC")
    List<Booking> findByAgencyIdOrAgencyNameOrderByCreatedAtDesc(
            @Param("agencyId") Long agencyId,
            @Param("agencyName") String agencyName
    );

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b WHERE b.status <> 'cancelled'")
    Double calculateTotalPlatformRevenue();

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b WHERE (b.agencyId = :agencyId OR b.agencyName = :agencyName) AND b.status <> 'cancelled'")
    Double calculateAgencyRevenue(
            @Param("agencyId") Long agencyId,
            @Param("agencyName") String agencyName
    );
}
