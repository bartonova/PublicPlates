package com.freedata.plates.service;

import com.freedata.plates.domain.Country;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Country}.
 */
public interface CountryService {

    /**
     * Save a country.
     *
     * @param country the entity to save.
     * @return the persisted entity.
     */
    Country save(Country country);

    /**
     * Get all the countries.
     *
     * @return the list of entities.
     */
    List<Country> findAll();


    /**
     * Get the "id" country.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Country> findOne(Long id);

    /**
     * Delete the "id" country.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the country corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @return the list of entities.
     */
    List<Country> search(String query);
}
