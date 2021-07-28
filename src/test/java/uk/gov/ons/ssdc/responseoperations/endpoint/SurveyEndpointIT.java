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
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.entity.Survey;
import uk.gov.ons.ssdc.responseoperations.model.entity.User;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroup;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupPermission;
import uk.gov.ons.ssdc.responseoperations.model.repository.SurveyRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupPermissionRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SurveyEndpointIT {
  @Autowired private SurveyRepository surveyRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private UserGroupRepository userGroupRepository;
  @Autowired private UserGroupMemberRepository userGroupMemberRepository;
  @Autowired private UserGroupPermissionRepository userGroupPermissionRepository;

  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userGroupPermissionRepository.deleteAllInBatch();
    userGroupMemberRepository.deleteAllInBatch();
    userGroupRepository.deleteAllInBatch();
    userRepository.deleteAllInBatch();
    surveyRepository.deleteAllInBatch();
  }

  @Test
  public void getSurveys() {
    setUpTestUserPermission(UserGroupAuthorisedActivityType.LIST_SURVEYS, null);

    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    survey.setName("Test survey");
    survey.setSampleSeparator(',');
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
    surveyRepository.saveAndFlush(survey);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/surveys/" + survey.getId();
    ResponseEntity<SurveyDto> foundSurveyResponse = restTemplate.getForEntity(url, SurveyDto.class);

    SurveyDto actualSurvey = foundSurveyResponse.getBody();
    assertThat(actualSurvey.getName()).isEqualTo("Test survey");
  }

  @Test
  public void createSurvey() {
    setUpTestUserPermission(UserGroupAuthorisedActivityType.CREATE_SURVEY, null);

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

  private void setUpTestUserPermission(
      UserGroupAuthorisedActivityType authorisedActivity, Survey survey) {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@test.com");
    userRepository.saveAndFlush(user);

    UserGroup group = new UserGroup();
    group.setId(UUID.randomUUID());
    group.setName("Test group");
    userGroupRepository.saveAndFlush(group);

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(group);
    userGroupMemberRepository.saveAndFlush(userGroupMember);

    UserGroupPermission permission = new UserGroupPermission();
    permission.setId(UUID.randomUUID());
    permission.setAuthorisedActivity(authorisedActivity);
    permission.setSurvey(survey);
    permission.setGroup(group);
    userGroupPermissionRepository.saveAndFlush(permission);
  }
}
