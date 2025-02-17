package com.freedata.plates.repository.search;

import com.freedata.plates.domain.PlateHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link PlateHistory} entity.
 */
public interface PlateHistorySearchRepository extends ElasticsearchRepository<PlateHistory, Long> {
}
