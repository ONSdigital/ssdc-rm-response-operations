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
import uk.gov.ons.ssdc.common.model.entity.ExportFileTemplate;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.ExportFileTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.ExportFileTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ExportFileTemplateEndpointIT {
  @Autowired private ExportFileTemplateRepository exportFileTemplateRepository;
  @Autowired private UserPermissionHelper userPermissionHelper;

  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userPermissionHelper.clearDown();
    exportFileTemplateRepository.deleteAllInBatch();
  }

  @Test
  public void getExportFileTemplates() {
    userPermissionHelper.setUpTestUserPermission(
        UserGroupAuthorisedActivityType.LIST_EXPORT_FILE_TEMPLATES);

    ExportFileTemplate exportFileTemplate = new ExportFileTemplate();
    exportFileTemplate.setPackCode("packCode1");
    exportFileTemplate.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplate.setExportFileDestination("printyMcPrinter");

    exportFileTemplateRepository.saveAndFlush(exportFileTemplate);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/exportfiletemplates";
    ResponseEntity<ExportFileTemplateDto[]> foundexportFileTemplatesResponse =
        restTemplate.getForEntity(url, ExportFileTemplateDto[].class);

    ExportFileTemplateDto[] actualexportFileTemplates = foundexportFileTemplatesResponse.getBody();
    assertThat(actualexportFileTemplates.length).isEqualTo(1);
    assertThat(actualexportFileTemplates[0].getPackCode()).isEqualTo("packCode1");
  }

  @Test
  public void getExportFileTemplatesForbidden() {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/exportfiletemplates";
    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () -> restTemplate.getForEntity(url, ExportFileTemplateDto[].class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }

  @Test
  public void createExportFileTemplate() {
    userPermissionHelper.setUpTestUserPermission(
        UserGroupAuthorisedActivityType.CREATE_EXPORT_FILE_TEMPLATE);

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("packCode2");
    exportFileTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/exportfiletemplates";
    ResponseEntity response =
        restTemplate.postForEntity(url, exportFileTemplateDto, ExportFileTemplateDto.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    List<ExportFileTemplate> allexportFileTemplates = exportFileTemplateRepository.findAll();
    assertThat(allexportFileTemplates.size()).isEqualTo(1);
    assertThat(allexportFileTemplates.get(0).getPackCode()).isEqualTo("packCode2");
  }

  @Test
  public void createExportFileTemplateForbidden() {
    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("packCode2");
    exportFileTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys";

    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () ->
                restTemplate.postForEntity(
                    url, exportFileTemplateDto, ExportFileTemplateDto.class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }
}
