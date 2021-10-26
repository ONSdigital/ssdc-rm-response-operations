package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ExportFileDestinationEndpointIT {

  @Autowired private UserPermissionHelper userPermissionHelper;

  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userPermissionHelper.clearDown();
  }

  @Test
  public void getExportFileDestinations() {
    userPermissionHelper.setUpTestUserPermission(
        UserGroupAuthorisedActivityType.LIST_EXPORT_FILE_DESTINATIONS);

    String[] expectedSuppliers = {"SUPPLIER_A", "SUPPLIER_B"};

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/exportfiledestinations";
    ResponseEntity<String[]> exportFileDestinationsResponse =
        restTemplate.getForEntity(url, String[].class);

    String[] actualexportFileDestinations = exportFileDestinationsResponse.getBody();
    assertThat(actualexportFileDestinations).containsExactlyInAnyOrder(expectedSuppliers);
  }

  @Test
  public void getexportFileDestinationsForbidden() {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/exportfiledestinations";
    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class, () -> restTemplate.getForEntity(url, String[].class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }
}
