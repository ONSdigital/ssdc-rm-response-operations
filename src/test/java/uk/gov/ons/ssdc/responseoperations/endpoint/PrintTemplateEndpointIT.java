package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
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
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.PrintTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.entity.PrintTemplate;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.repository.PrintTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PrintTemplateEndpointIT {
  @Autowired private PrintTemplateRepository printTemplateRepository;
  @Autowired private UserPermissionHelper userPermissionHelper;

  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userPermissionHelper.clearDown();
    printTemplateRepository.deleteAllInBatch();
  }

  @Test
  public void getPrintTemplates() {
    userPermissionHelper.setUpTestUserPermission(
        UserGroupAuthorisedActivityType.LIST_PRINT_TEMPLATES);

    PrintTemplate printTemplate = new PrintTemplate();
    printTemplate.setPackCode("packCode1");
    printTemplate.setTemplate(new String[] {"a", "b", "c"});
    printTemplate.setPrintSupplier("printyMcPrinter");

    printTemplateRepository.saveAndFlush(printTemplate);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/printtemplates";
    ResponseEntity<PrintTemplateDto[]> foundPrintTemplatesResponse =
        restTemplate.getForEntity(url, PrintTemplateDto[].class);

    PrintTemplateDto[] actualPrintTemplates = foundPrintTemplatesResponse.getBody();
    assertThat(actualPrintTemplates.length).isEqualTo(1);
    assertThat(actualPrintTemplates[0].getPackCode()).isEqualTo("packCode1");
  }

  @Test
  public void getPrintTemplatesForbidden() {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/printtemplates";
    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () -> restTemplate.getForEntity(url, PrintTemplateDto[].class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }

  @Test
  public void createPrintTemplate() {
    userPermissionHelper.setUpTestUserPermission(
        UserGroupAuthorisedActivityType.CREATE_PRINT_TEMPLATE);

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("packCode2");
    printTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/printtemplates";
    ResponseEntity response =
        restTemplate.postForEntity(url, printTemplateDto, PrintTemplateDto.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    List<PrintTemplate> allPrintTemplates = printTemplateRepository.findAll();
    assertThat(allPrintTemplates.size()).isEqualTo(1);
    assertThat(allPrintTemplates.get(0).getPackCode()).isEqualTo("packCode2");
  }

  @Test
  public void createPrintTemplateForbidden() {
    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("packCode2");
    printTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys";

    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () -> restTemplate.postForEntity(url, printTemplateDto, PrintTemplateDto.class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }
}
