package com.freedata.plates.service.impl;

import com.freedata.plates.service.PlateHistoryService;
import com.freedata.plates.domain.PlateHistory;
import com.freedata.plates.repository.PlateHistoryRepository;
import com.freedata.plates.repository.search.PlateHistorySearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link PlateHistory}.
 */
@Service
@Transactional
public class PlateHistoryServiceImpl implements PlateHistoryService {

    private final Logger log = LoggerFactory.getLogger(PlateHistoryServiceImpl.class);

    private final PlateHistoryRepository plateHistoryRepository;

    private final PlateHistorySearchRepository plateHistorySearchRepository;

    public PlateHistoryServiceImpl(PlateHistoryRepository plateHistoryRepository, PlateHistorySearchRepository plateHistorySearchRepository) {
        this.plateHistoryRepository = plateHistoryRepository;
        this.plateHistorySearchRepository = plateHistorySearchRepository;
    }

    @Override
    public PlateHistory save(PlateHistory plateHistory) {
        log.debug("Request to save PlateHistory : {}", plateHistory);
        PlateHistory result = plateHistoryRepository.save(plateHistory);
        plateHistorySearchRepository.save(result);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlateHistory> findAll(Pageable pageable) {
        log.debug("Request to get all PlateHistories");
        return plateHistoryRepository.findAll(pageable);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<PlateHistory> findOne(Long id) {
        log.debug("Request to get PlateHistory : {}", id);
        return plateHistoryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PlateHistory : {}", id);
        plateHistoryRepository.deleteById(id);
        plateHistorySearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlateHistory> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of PlateHistories for query {}", query);
        return plateHistorySearchRepository.search(queryStringQuery(query), pageable);    }
}
