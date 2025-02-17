package com.freedata.plates.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.freedata.plates.web.rest.TestUtil;

public class PlateHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlateHistory.class);
        PlateHistory plateHistory1 = new PlateHistory();
        plateHistory1.setId(1L);
        PlateHistory plateHistory2 = new PlateHistory();
        plateHistory2.setId(plateHistory1.getId());
        assertThat(plateHistory1).isEqualTo(plateHistory2);
        plateHistory2.setId(2L);
        assertThat(plateHistory1).isNotEqualTo(plateHistory2);
        plateHistory1.setId(null);
        assertThat(plateHistory1).isNotEqualTo(plateHistory2);
    }
}
