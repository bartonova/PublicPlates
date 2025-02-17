package com.freedata.plates.repository.search;

import com.freedata.plates.domain.Note;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Note} entity.
 */
public interface NoteSearchRepository extends ElasticsearchRepository<Note, Long> {
}
