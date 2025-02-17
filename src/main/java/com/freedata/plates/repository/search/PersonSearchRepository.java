package com.freedata.plates.repository.search;

import com.freedata.plates.domain.Person;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Person} entity.
 */
public interface PersonSearchRepository extends ElasticsearchRepository<Person, Long> {
}
