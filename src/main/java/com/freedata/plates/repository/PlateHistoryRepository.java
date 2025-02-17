package com.freedata.plates.repository;

import com.freedata.plates.domain.PlateHistory;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PlateHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlateHistoryRepository extends JpaRepository<PlateHistory, Long> {
}
