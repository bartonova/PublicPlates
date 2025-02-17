package com.freedata.plates.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link NoteSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class NoteSearchRepositoryMockConfiguration {

    @MockBean
    private NoteSearchRepository mockNoteSearchRepository;

}
