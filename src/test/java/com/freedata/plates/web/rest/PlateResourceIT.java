package com.freedata.plates.web.rest;

import com.freedata.plates.PlatesApp;
import com.freedata.plates.domain.Plate;
import com.freedata.plates.repository.PlateRepository;
import com.freedata.plates.repository.search.PlateSearchRepository;

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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PlateResource} REST controller.
 */
@SpringBootTest(classes = PlatesApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PlateResourceIT {

    private static final String DEFAULT_PLATE_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_PLATE_TITLE = "BBBBBBBBBB";

    @Autowired
    private PlateRepository plateRepository;

    @Mock
    private PlateRepository plateRepositoryMock;

    /**
     * This repository is mocked in the com.freedata.plates.repository.search test package.
     *
     * @see com.freedata.plates.repository.search.PlateSearchRepositoryMockConfiguration
     */
    @Autowired
    private PlateSearchRepository mockPlateSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlateMockMvc;

    private Plate plate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plate createEntity(EntityManager em) {
        Plate plate = new Plate()
            .plateTitle(DEFAULT_PLATE_TITLE);
        return plate;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plate createUpdatedEntity(EntityManager em) {
        Plate plate = new Plate()
            .plateTitle(UPDATED_PLATE_TITLE);
        return plate;
    }

    @BeforeEach
    public void initTest() {
        plate = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlate() throws Exception {
        int databaseSizeBeforeCreate = plateRepository.findAll().size();
        // Create the Plate
        restPlateMockMvc.perform(post("/api/plates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(plate)))
            .andExpect(status().isCreated());

        // Validate the Plate in the database
        List<Plate> plateList = plateRepository.findAll();
        assertThat(plateList).hasSize(databaseSizeBeforeCreate + 1);
        Plate testPlate = plateList.get(plateList.size() - 1);
        assertThat(testPlate.getPlateTitle()).isEqualTo(DEFAULT_PLATE_TITLE);

        // Validate the Plate in Elasticsearch
        verify(mockPlateSearchRepository, times(1)).save(testPlate);
    }

    @Test
    @Transactional
    public void createPlateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = plateRepository.findAll().size();

        // Create the Plate with an existing ID
        plate.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlateMockMvc.perform(post("/api/plates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(plate)))
            .andExpect(status().isBadRequest());

        // Validate the Plate in the database
        List<Plate> plateList = plateRepository.findAll();
        assertThat(plateList).hasSize(databaseSizeBeforeCreate);

        // Validate the Plate in Elasticsearch
        verify(mockPlateSearchRepository, times(0)).save(plate);
    }


    @Test
    @Transactional
    public void getAllPlates() throws Exception {
        // Initialize the database
        plateRepository.saveAndFlush(plate);

        // Get all the plateList
        restPlateMockMvc.perform(get("/api/plates?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plate.getId().intValue())))
            .andExpect(jsonPath("$.[*].plateTitle").value(hasItem(DEFAULT_PLATE_TITLE)));
    }

    @SuppressWarnings({"unchecked"})
    public void getAllPlatesWithEagerRelationshipsIsEnabled() throws Exception {
        when(plateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlateMockMvc.perform(get("/api/plates?eagerload=true"))
            .andExpect(status().isOk());

        verify(plateRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllPlatesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(plateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlateMockMvc.perform(get("/api/plates?eagerload=true"))
            .andExpect(status().isOk());

        verify(plateRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getPlate() throws Exception {
        // Initialize the database
        plateRepository.saveAndFlush(plate);

        // Get the plate
        restPlateMockMvc.perform(get("/api/plates/{id}", plate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plate.getId().intValue()))
            .andExpect(jsonPath("$.plateTitle").value(DEFAULT_PLATE_TITLE));
    }
    @Test
    @Transactional
    public void getNonExistingPlate() throws Exception {
        // Get the plate
        restPlateMockMvc.perform(get("/api/plates/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlate() throws Exception {
        // Initialize the database
        plateRepository.saveAndFlush(plate);

        int databaseSizeBeforeUpdate = plateRepository.findAll().size();

        // Update the plate
        Plate updatedPlate = plateRepository.findById(plate.getId()).get();
        // Disconnect from session so that the updates on updatedPlate are not directly saved in db
        em.detach(updatedPlate);
        updatedPlate
            .plateTitle(UPDATED_PLATE_TITLE);

        restPlateMockMvc.perform(put("/api/plates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlate)))
            .andExpect(status().isOk());

        // Validate the Plate in the database
        List<Plate> plateList = plateRepository.findAll();
        assertThat(plateList).hasSize(databaseSizeBeforeUpdate);
        Plate testPlate = plateList.get(plateList.size() - 1);
        assertThat(testPlate.getPlateTitle()).isEqualTo(UPDATED_PLATE_TITLE);

        // Validate the Plate in Elasticsearch
        verify(mockPlateSearchRepository, times(1)).save(testPlate);
    }

    @Test
    @Transactional
    public void updateNonExistingPlate() throws Exception {
        int databaseSizeBeforeUpdate = plateRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlateMockMvc.perform(put("/api/plates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(plate)))
            .andExpect(status().isBadRequest());

        // Validate the Plate in the database
        List<Plate> plateList = plateRepository.findAll();
        assertThat(plateList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Plate in Elasticsearch
        verify(mockPlateSearchRepository, times(0)).save(plate);
    }

    @Test
    @Transactional
    public void deletePlate() throws Exception {
        // Initialize the database
        plateRepository.saveAndFlush(plate);

        int databaseSizeBeforeDelete = plateRepository.findAll().size();

        // Delete the plate
        restPlateMockMvc.perform(delete("/api/plates/{id}", plate.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plate> plateList = plateRepository.findAll();
        assertThat(plateList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Plate in Elasticsearch
        verify(mockPlateSearchRepository, times(1)).deleteById(plate.getId());
    }

    @Test
    @Transactional
    public void searchPlate() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        plateRepository.saveAndFlush(plate);
        when(mockPlateSearchRepository.search(queryStringQuery("id:" + plate.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(plate), PageRequest.of(0, 1), 1));

        // Search the plate
        restPlateMockMvc.perform(get("/api/_search/plates?query=id:" + plate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plate.getId().intValue())))
            .andExpect(jsonPath("$.[*].plateTitle").value(hasItem(DEFAULT_PLATE_TITLE)));
    }
}
