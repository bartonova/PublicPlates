package com.freedata.plates.web.rest;

import com.freedata.plates.domain.Plate;
import com.freedata.plates.repository.PlateRepository;
import com.freedata.plates.repository.search.PlateSearchRepository;
import com.freedata.plates.web.rest.errors.BadRequestAlertException;

import io.github.freedata.web.util.HeaderUtil;
import io.github.freedata.web.util.PaginationUtil;
import io.github.freedata.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.freedata.plates.domain.Plate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlateResource {

    private final Logger log = LoggerFactory.getLogger(PlateResource.class);

    private static final String ENTITY_NAME = "plate";

    @Value("${freedata.clientApp.name}")
    private String applicationName;

    private final PlateRepository plateRepository;

    private final PlateSearchRepository plateSearchRepository;

    public PlateResource(PlateRepository plateRepository, PlateSearchRepository plateSearchRepository) {
        this.plateRepository = plateRepository;
        this.plateSearchRepository = plateSearchRepository;
    }

    /**
     * {@code POST  /plates} : Create a new plate.
     *
     * @param plate the plate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plate, or with status {@code 400 (Bad Request)} if the plate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plates")
    public ResponseEntity<Plate> createPlate(@RequestBody Plate plate) throws URISyntaxException {
        log.debug("REST request to save Plate : {}", plate);
        if (plate.getId() != null) {
            throw new BadRequestAlertException("A new plate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plate result = plateRepository.save(plate);
        plateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/plates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plates} : Updates an existing plate.
     *
     * @param plate the plate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plate,
     * or with status {@code 400 (Bad Request)} if the plate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plates")
    public ResponseEntity<Plate> updatePlate(@RequestBody Plate plate) throws URISyntaxException {
        log.debug("REST request to update Plate : {}", plate);
        if (plate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Plate result = plateRepository.save(plate);
        plateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plate.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /plates} : get all the plates.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plates in body.
     */
    @GetMapping("/plates")
    public ResponseEntity<List<Plate>> getAllPlates(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of Plates");
        Page<Plate> page;
        if (eagerload) {
            page = plateRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = plateRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /plates/:id} : get the "id" plate.
     *
     * @param id the id of the plate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plates/{id}")
    public ResponseEntity<Plate> getPlate(@PathVariable Long id) {
        log.debug("REST request to get Plate : {}", id);
        Optional<Plate> plate = plateRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(plate);
    }

    /**
     * {@code DELETE  /plates/:id} : delete the "id" plate.
     *
     * @param id the id of the plate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plates/{id}")
    public ResponseEntity<Void> deletePlate(@PathVariable Long id) {
        log.debug("REST request to delete Plate : {}", id);
        plateRepository.deleteById(id);
        plateSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/plates?query=:query} : search for the plate corresponding
     * to the query.
     *
     * @param query the query of the plate search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/plates")
    public ResponseEntity<List<Plate>> searchPlates(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Plates for query {}", query);
        Page<Plate> page = plateSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
}
