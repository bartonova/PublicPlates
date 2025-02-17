package com.freedata.plates.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link PlateHistorySearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class PlateHistorySearchRepositoryMockConfiguration {

    @MockBean
    private PlateHistorySearchRepository mockPlateHistorySearchRepository;

}
