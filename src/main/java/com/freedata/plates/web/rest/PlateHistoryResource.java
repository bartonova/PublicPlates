package com.freedata.plates.web.rest;

import com.freedata.plates.domain.PlateHistory;
import com.freedata.plates.service.PlateHistoryService;
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
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.freedata.plates.domain.PlateHistory}.
 */
@RestController
@RequestMapping("/api")
public class PlateHistoryResource {

    private final Logger log = LoggerFactory.getLogger(PlateHistoryResource.class);

    private static final String ENTITY_NAME = "plateHistory";

    @Value("${freedata.clientApp.name}")
    private String applicationName;

    private final PlateHistoryService plateHistoryService;

    public PlateHistoryResource(PlateHistoryService plateHistoryService) {
        this.plateHistoryService = plateHistoryService;
    }

    /**
     * {@code POST  /plate-histories} : Create a new plateHistory.
     *
     * @param plateHistory the plateHistory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plateHistory, or with status {@code 400 (Bad Request)} if the plateHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plate-histories")
    public ResponseEntity<PlateHistory> createPlateHistory(@RequestBody PlateHistory plateHistory) throws URISyntaxException {
        log.debug("REST request to save PlateHistory : {}", plateHistory);
        if (plateHistory.getId() != null) {
            throw new BadRequestAlertException("A new plateHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PlateHistory result = plateHistoryService.save(plateHistory);
        return ResponseEntity.created(new URI("/api/plate-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plate-histories} : Updates an existing plateHistory.
     *
     * @param plateHistory the plateHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plateHistory,
     * or with status {@code 400 (Bad Request)} if the plateHistory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plateHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plate-histories")
    public ResponseEntity<PlateHistory> updatePlateHistory(@RequestBody PlateHistory plateHistory) throws URISyntaxException {
        log.debug("REST request to update PlateHistory : {}", plateHistory);
        if (plateHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PlateHistory result = plateHistoryService.save(plateHistory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plateHistory.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /plate-histories} : get all the plateHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plateHistories in body.
     */
    @GetMapping("/plate-histories")
    public ResponseEntity<List<PlateHistory>> getAllPlateHistories(Pageable pageable) {
        log.debug("REST request to get a page of PlateHistories");
        Page<PlateHistory> page = plateHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /plate-histories/:id} : get the "id" plateHistory.
     *
     * @param id the id of the plateHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plateHistory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plate-histories/{id}")
    public ResponseEntity<PlateHistory> getPlateHistory(@PathVariable Long id) {
        log.debug("REST request to get PlateHistory : {}", id);
        Optional<PlateHistory> plateHistory = plateHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(plateHistory);
    }

    /**
     * {@code DELETE  /plate-histories/:id} : delete the "id" plateHistory.
     *
     * @param id the id of the plateHistory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plate-histories/{id}")
    public ResponseEntity<Void> deletePlateHistory(@PathVariable Long id) {
        log.debug("REST request to delete PlateHistory : {}", id);
        plateHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/plate-histories?query=:query} : search for the plateHistory corresponding
     * to the query.
     *
     * @param query the query of the plateHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/plate-histories")
    public ResponseEntity<List<PlateHistory>> searchPlateHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of PlateHistories for query {}", query);
        Page<PlateHistory> page = plateHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
}
