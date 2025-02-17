package com.freedata.plates.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.freedata.plates.web.rest.TestUtil;

public class PlateTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plate.class);
        Plate plate1 = new Plate();
        plate1.setId(1L);
        Plate plate2 = new Plate();
        plate2.setId(plate1.getId());
        assertThat(plate1).isEqualTo(plate2);
        plate2.setId(2L);
        assertThat(plate1).isNotEqualTo(plate2);
        plate1.setId(null);
        assertThat(plate1).isNotEqualTo(plate2);
    }
}
