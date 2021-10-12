package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.UUID;
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
import uk.gov.ons.ssdc.common.model.entity.Survey;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.validation.ColumnValidator;
import uk.gov.ons.ssdc.common.validation.MandatoryRule;
import uk.gov.ons.ssdc.common.validation.Rule;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.SurveyRepository;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SurveyEndpointIT {
  @Autowired private SurveyRepository surveyRepository;
  @Autowired private UserPermissionHelper userPermissionHelper;

  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userPermissionHelper.clearDown();
    surveyRepository.deleteAllInBatch();
  }

  @Test
  public void getSurveys() {
    userPermissionHelper.setUpTestUserPermission(UserGroupAuthorisedActivityType.LIST_SURVEYS);

    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    survey.setName("Test survey");
    survey.setSampleSeparator(',');
    survey.setSampleValidationRules(
        new ColumnValidator[] {
          new ColumnValidator("DUMMY_COLUMN", false, new Rule[] {new MandatoryRule()})
        });
    survey.setSampleDefinitionUrl("http://dummy");
    surveyRepository.saveAndFlush(survey);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys";
    ResponseEntity<SurveyDto[]> foundSurveysResponse =
        restTemplate.getForEntity(url, SurveyDto[].class);

    SurveyDto[] actualSurveys = foundSurveysResponse.getBody();
    assertThat(actualSurveys.length).isEqualTo(1);
    assertThat(actualSurveys[0].getName()).isEqualTo("Test survey");
  }

  @Test
  public void getSurveysForbidden() {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys";
    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () -> restTemplate.getForEntity(url, SurveyDto[].class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }

  @Test
  public void getSurvey() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    survey.setName("Test survey");
    survey.setSampleSeparator(',');
    survey.setSampleValidationRules(
        new ColumnValidator[] {
          new ColumnValidator("DUMMY_COLUMN", false, new Rule[] {new MandatoryRule()})
        });
    survey.setSampleDefinitionUrl("http://dummy");
    surveyRepository.saveAndFlush(survey);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys/" + survey.getId();
    ResponseEntity<SurveyDto> foundSurveyResponse = restTemplate.getForEntity(url, SurveyDto.class);

    SurveyDto actualSurvey = foundSurveyResponse.getBody();
    assertThat(actualSurvey.getName()).isEqualTo("Test survey");
  }

  @Test
  public void createSurvey() {
    userPermissionHelper.setUpTestUserPermission(UserGroupAuthorisedActivityType.CREATE_SURVEY);

    SurveyDto survey = new SurveyDto();
    survey.setName("Test survey");

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys";
    ResponseEntity response = restTemplate.postForEntity(url, survey, SurveyDto.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    List<Survey> allSurveys = surveyRepository.findAll();
    assertThat(allSurveys.size()).isEqualTo(1);
    assertThat(allSurveys.get(0).getName()).isEqualTo("Test survey");
  }

  @Test
  public void createSurveyForbidden() {
    SurveyDto survey = new SurveyDto();
    survey.setName("Test survey");

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys";

    HttpClientErrorException thrown =
        assertThrows(
            HttpClientErrorException.class,
            () -> restTemplate.postForEntity(url, survey, SurveyDto.class));

    assertThat(thrown.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }
}
