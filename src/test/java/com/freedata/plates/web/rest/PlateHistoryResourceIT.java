package com.freedata.plates.web.rest;

import com.freedata.plates.PlatesApp;
import com.freedata.plates.domain.PlateHistory;
import com.freedata.plates.repository.PlateHistoryRepository;
import com.freedata.plates.repository.search.PlateHistorySearchRepository;
import com.freedata.plates.service.PlateHistoryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PlateHistoryResource} REST controller.
 */
@SpringBootTest(classes = PlatesApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PlateHistoryResourceIT {

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private PlateHistoryRepository plateHistoryRepository;

    @Autowired
    private PlateHistoryService plateHistoryService;

    /**
     * This repository is mocked in the com.freedata.plates.repository.search test package.
     *
     * @see com.freedata.plates.repository.search.PlateHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private PlateHistorySearchRepository mockPlateHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlateHistoryMockMvc;

    private PlateHistory plateHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlateHistory createEntity(EntityManager em) {
        PlateHistory plateHistory = new PlateHistory()
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
        return plateHistory;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlateHistory createUpdatedEntity(EntityManager em) {
        PlateHistory plateHistory = new PlateHistory()
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
        return plateHistory;
    }

    @BeforeEach
    public void initTest() {
        plateHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlateHistory() throws Exception {
        int databaseSizeBeforeCreate = plateHistoryRepository.findAll().size();
        // Create the PlateHistory
        restPlateHistoryMockMvc.perform(post("/api/plate-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(plateHistory)))
            .andExpect(status().isCreated());

        // Validate the PlateHistory in the database
        List<PlateHistory> plateHistoryList = plateHistoryRepository.findAll();
        assertThat(plateHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        PlateHistory testPlateHistory = plateHistoryList.get(plateHistoryList.size() - 1);
        assertThat(testPlateHistory.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testPlateHistory.getEndDate()).isEqualTo(DEFAULT_END_DATE);

        // Validate the PlateHistory in Elasticsearch
        verify(mockPlateHistorySearchRepository, times(1)).save(testPlateHistory);
    }

    @Test
    @Transactional
    public void createPlateHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = plateHistoryRepository.findAll().size();

        // Create the PlateHistory with an existing ID
        plateHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlateHistoryMockMvc.perform(post("/api/plate-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(plateHistory)))
            .andExpect(status().isBadRequest());

        // Validate the PlateHistory in the database
        List<PlateHistory> plateHistoryList = plateHistoryRepository.findAll();
        assertThat(plateHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the PlateHistory in Elasticsearch
        verify(mockPlateHistorySearchRepository, times(0)).save(plateHistory);
    }


    @Test
    @Transactional
    public void getAllPlateHistories() throws Exception {
        // Initialize the database
        plateHistoryRepository.saveAndFlush(plateHistory);

        // Get all the plateHistoryList
        restPlateHistoryMockMvc.perform(get("/api/plate-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plateHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    public void getPlateHistory() throws Exception {
        // Initialize the database
        plateHistoryRepository.saveAndFlush(plateHistory);

        // Get the plateHistory
        restPlateHistoryMockMvc.perform(get("/api/plate-histories/{id}", plateHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plateHistory.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingPlateHistory() throws Exception {
        // Get the plateHistory
        restPlateHistoryMockMvc.perform(get("/api/plate-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlateHistory() throws Exception {
        // Initialize the database
        plateHistoryService.save(plateHistory);

        int databaseSizeBeforeUpdate = plateHistoryRepository.findAll().size();

        // Update the plateHistory
        PlateHistory updatedPlateHistory = plateHistoryRepository.findById(plateHistory.getId()).get();
        // Disconnect from session so that the updates on updatedPlateHistory are not directly saved in db
        em.detach(updatedPlateHistory);
        updatedPlateHistory
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restPlateHistoryMockMvc.perform(put("/api/plate-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlateHistory)))
            .andExpect(status().isOk());

        // Validate the PlateHistory in the database
        List<PlateHistory> plateHistoryList = plateHistoryRepository.findAll();
        assertThat(plateHistoryList).hasSize(databaseSizeBeforeUpdate);
        PlateHistory testPlateHistory = plateHistoryList.get(plateHistoryList.size() - 1);
        assertThat(testPlateHistory.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPlateHistory.getEndDate()).isEqualTo(UPDATED_END_DATE);

        // Validate the PlateHistory in Elasticsearch
        verify(mockPlateHistorySearchRepository, times(2)).save(testPlateHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingPlateHistory() throws Exception {
        int databaseSizeBeforeUpdate = plateHistoryRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlateHistoryMockMvc.perform(put("/api/plate-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(plateHistory)))
            .andExpect(status().isBadRequest());

        // Validate the PlateHistory in the database
        List<PlateHistory> plateHistoryList = plateHistoryRepository.findAll();
        assertThat(plateHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PlateHistory in Elasticsearch
        verify(mockPlateHistorySearchRepository, times(0)).save(plateHistory);
    }

    @Test
    @Transactional
    public void deletePlateHistory() throws Exception {
        // Initialize the database
        plateHistoryService.save(plateHistory);

        int databaseSizeBeforeDelete = plateHistoryRepository.findAll().size();

        // Delete the plateHistory
        restPlateHistoryMockMvc.perform(delete("/api/plate-histories/{id}", plateHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PlateHistory> plateHistoryList = plateHistoryRepository.findAll();
        assertThat(plateHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the PlateHistory in Elasticsearch
        verify(mockPlateHistorySearchRepository, times(1)).deleteById(plateHistory.getId());
    }

    @Test
    @Transactional
    public void searchPlateHistory() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        plateHistoryService.save(plateHistory);
        when(mockPlateHistorySearchRepository.search(queryStringQuery("id:" + plateHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(plateHistory), PageRequest.of(0, 1), 1));

        // Search the plateHistory
        restPlateHistoryMockMvc.perform(get("/api/_search/plate-histories?query=id:" + plateHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plateHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }
}
