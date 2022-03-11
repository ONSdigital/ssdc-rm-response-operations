package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.handler;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.ons.ssdc.responseoperations.test_utils.JsonHelper.asJsonString;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.common.model.entity.Survey;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.validation.ColumnValidator;
import uk.gov.ons.ssdc.responseoperations.client.SampleDefinitionClient;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyType;
import uk.gov.ons.ssdc.responseoperations.model.repository.SurveyRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class SurveyEndpointTest {

  @Mock private SurveyRepository surveyRepository;

  @Mock private UserIdentity userIdentity;

  @Mock private SampleDefinitionClient sampleDefinitionClient;

  @InjectMocks private SurveyEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetAllSurveys() throws Exception {

    // Given
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    survey.setName("Test survey");
    when(surveyRepository.findAll()).thenReturn(List.of(survey));

    // When
    mockMvc
        .perform(
            get("/api/surveys")
                .requestAttr("userEmail", "test@test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("getSurveys"))
        .andExpect(jsonPath("$[0].id", is(survey.getId().toString())))
        .andExpect(jsonPath("$[0].name", is("Test survey")));

    // Then
    verify(userIdentity)
        .checkGlobalUserPermission(
            eq("test@test.com"), eq(UserGroupAuthorisedActivityType.LIST_SURVEYS));
  }

  @Test
  public void testGetSurvey() throws Exception {
    // Given
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    survey.setName("Test survey");
    when(surveyRepository.findById(any(UUID.class))).thenReturn(Optional.of(survey));

    // When
    // Then
    mockMvc
        .perform(
            get(String.format("/api/surveys/%s", survey.getId().toString()))
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("getSurvey"))
        .andExpect(jsonPath("id", is(survey.getId().toString())))
        .andExpect(jsonPath("name", is("Test survey")));
  }

  @Test
  public void testGetSurveyException() throws Exception {
    // Given
    when(surveyRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

    // When,then
    mockMvc
        .perform(
            get(String.format("/api/surveys/%s", UUID.randomUUID()))
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("getSurvey"));
  }

  @Test
  public void testCreateSurvey() throws Exception {
    // Given
    SurveyDto survey = new SurveyDto();
    survey.setName("Test survey");
    survey.setSurveyType(SurveyType.SOCIAL);

    when(sampleDefinitionClient.getSampleDefinitionUrlForSurveyType(SurveyType.SOCIAL))
        .thenReturn("test_url");
    when(sampleDefinitionClient.getColumnValidatorsForSurveyType(SurveyType.SOCIAL))
        .thenReturn(new ColumnValidator[0]);

    // When
    mockMvc
        .perform(
            post("/api/surveys", survey)
                .requestAttr("userEmail", "test@test.com")
                .content(asJsonString(survey))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("createSurvey"));

    // Then
    ArgumentCaptor<Survey> surveyArgumentCaptor = ArgumentCaptor.forClass(Survey.class);
    verify(surveyRepository).saveAndFlush(surveyArgumentCaptor.capture());
    assertThat(surveyArgumentCaptor.getValue().getName()).isEqualTo("Test survey");

    verify(userIdentity)
        .checkGlobalUserPermission(
            eq("test@test.com"), eq(UserGroupAuthorisedActivityType.CREATE_SURVEY));
  }

  @Test
  public void testGetSurveyTypes() throws Exception {
    mockMvc
        .perform(get(String.format("/api/surveys/surveyTypes")).accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("getSurveyTypes"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .isEqualTo("[\"SOCIAL\",\"BUSINESS\",\"HEALTH\"]"));
  }
}
