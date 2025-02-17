package com.freedata.plates.repository;

import com.freedata.plates.domain.Plate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Plate entity.
 */
@Repository
public interface PlateRepository extends JpaRepository<Plate, Long> {

    @Query(value = "select distinct plate from Plate plate left join fetch plate.notes",
        countQuery = "select count(distinct plate) from Plate plate")
    Page<Plate> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct plate from Plate plate left join fetch plate.notes")
    List<Plate> findAllWithEagerRelationships();

    @Query("select plate from Plate plate left join fetch plate.notes where plate.id =:id")
    Optional<Plate> findOneWithEagerRelationships(@Param("id") Long id);
}
