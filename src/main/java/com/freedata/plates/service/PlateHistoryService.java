package com.freedata.plates.service;

import com.freedata.plates.domain.PlateHistory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link PlateHistory}.
 */
public interface PlateHistoryService {

    /**
     * Save a plateHistory.
     *
     * @param plateHistory the entity to save.
     * @return the persisted entity.
     */
    PlateHistory save(PlateHistory plateHistory);

    /**
     * Get all the plateHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PlateHistory> findAll(Pageable pageable);


    /**
     * Get the "id" plateHistory.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PlateHistory> findOne(Long id);

    /**
     * Delete the "id" plateHistory.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the plateHistory corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PlateHistory> search(String query, Pageable pageable);
}
