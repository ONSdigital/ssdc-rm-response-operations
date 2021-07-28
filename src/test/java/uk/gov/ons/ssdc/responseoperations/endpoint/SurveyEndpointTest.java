package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.handler;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.entity.Survey;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.repository.SurveyRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class SurveyEndpointTest {

  @Mock private SurveyRepository surveyRepository;

  @Mock private UserIdentity userIdentity;

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
        .perform(get("/api/surveys").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("getSurveys"))
        .andExpect(jsonPath("$[0].id", is(survey.getId().toString())))
        .andExpect(jsonPath("$[0].name", is("Test survey")));

    // Then
    verify(userIdentity)
        .checkGlobalUserPermission(anyString(), eq(UserGroupAuthorisedActivityType.LIST_SURVEYS));
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
  public void testCreateSurvey() throws Exception {
    // Given
    SurveyDto survey = new SurveyDto();
    survey.setName("Test survey");

    // When
    mockMvc
        .perform(
            post("/api/surveys", survey)
                .content(asJsonString(survey))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(handler().handlerType(SurveyEndpoint.class))
        .andExpect(handler().methodName("createSurvey"));

    // Then
    ArgumentCaptor<Survey> surveyArgumentCaptor = ArgumentCaptor.forClass(Survey.class);
    verify(surveyRepository).saveAndFlush(surveyArgumentCaptor.capture());
    assertThat(surveyArgumentCaptor.getValue().getName()).isEqualTo("Test survey");
  }

  public static String asJsonString(final Object obj) {
    try {
      final ObjectMapper mapper = new ObjectMapper();
      final String jsonContent = mapper.writeValueAsString(obj);
      return jsonContent;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
