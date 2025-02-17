package com.freedata.plates.repository.search;

import com.freedata.plates.domain.Plate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Plate} entity.
 */
public interface PlateSearchRepository extends ElasticsearchRepository<Plate, Long> {
}
