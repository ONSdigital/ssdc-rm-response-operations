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
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PrintSuppliersEndpointIT {

  @Autowired
  private UserPermissionHelper userPermissionHelper;

  @LocalServerPort
  private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userPermissionHelper.clearDown();
  }

  @Test
  public void getPrintSuppliers() {
    userPermissionHelper.setUpTestUserPermission(
        UserGroupAuthorisedActivityType.CREATE_PRINT_TEMPLATE);

    String[] expectedSuppliers = {"SUPPLIER_A", "SUPPLIER_B"};

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/printsuppliers";
    ResponseEntity<String[]> printSuppliersResponse =
        restTemplate.getForEntity(url, String[].class);

    String[] actualPrintSuppliers = printSuppliersResponse.getBody();
    assertThat(actualPrintSuppliers).containsExactlyInAnyOrder(expectedSuppliers);
  }

  @Test
  public void getPrintSuppliersForbidden() {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/printsuppliers";
    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () -> restTemplate.getForEntity(url, String[].class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }
}