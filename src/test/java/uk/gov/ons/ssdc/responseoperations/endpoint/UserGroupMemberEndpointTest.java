package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.common.model.entity.Survey;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAdmin;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.common.validation.ColumnValidator;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyType;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupMemberDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;

@ExtendWith(MockitoExtension.class)
class UserGroupMemberEndpointTest {
  @Mock private UserGroupRepository userGroupRepository;

  @Mock private UserGroupMemberRepository userGroupMemberRepository;

  @InjectMocks private UserGroupMemberEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetUsersInGroup() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@ons.gov.uk");
    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setUser(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("test group");
    userGroup.setAdmins(List.of(admin));

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(userGroup);
    List<UserGroupMember> userList = List.of(userGroupMember);

    when(userGroupRepository.findById(any(UUID.class))).thenReturn(Optional.of(userGroup));
    when(userGroupMemberRepository.findByGroup(any(UserGroup.class))).thenReturn(userList);

    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", userGroup.getId())
                .requestAttr("userEmail", "test@ons.gov.uk")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"))
        .andExpect(jsonPath("$[0].id", is(userGroupMember.getId().toString())))
        .andExpect(jsonPath("$[0].groupId", is(userGroup.getId().toString())))
        .andExpect(jsonPath("$[0].groupName", is(userGroup.getName())))
        .andExpect(jsonPath("$[0].userId", is(user.getId().toString())))
        .andExpect(jsonPath("$[0].userEmail", is(user.getEmail())));

    verify(userGroupRepository).findById(userGroup.getId());
  }

  @Test
  public void testGetUsersInGroupBadUser() throws Exception {
    UUID groupId = UUID.randomUUID();
    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", groupId)
                .requestAttr("userEmail", "made@up.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));

    verify(userGroupRepository).findById(groupId);
  }

  @Test
  public void testGetUsersInGroupNotAdmin() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("admin@email.gov.uk");
    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setUser(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setAdmins(List.of(admin));

    when(userGroupRepository.findById(any(UUID.class))).thenReturn(Optional.of(userGroup));

    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", userGroup.getId())
                .requestAttr("userEmail", "notadmin@test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.FORBIDDEN.value()));

    verify(userGroupRepository).findById(userGroup.getId());
  }

  @Test
  public void testRemoveUserFromGroup() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@test.com");
    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setUser(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setAdmins(List.of(admin));

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(userGroup);

    when(userGroupMemberRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(userGroupMember));

    mockMvc
        .perform(
            delete("/api/userGroupMembers/{groupMemberId}", userGroupMember.getId())
                .requestAttr("userEmail", "test@test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("removeUserFromGroup"));
  }

  @Test
  public void testNotAdminForDelete() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("admin@admin.com");
    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setUser(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setAdmins(List.of(admin));

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(userGroup);

    when(userGroupMemberRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(userGroupMember));

    mockMvc
        .perform(
            delete("/api/userGroupMembers/{groupMemberId}", UUID.randomUUID())
                .requestAttr("userEmail", "notadmin@member.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("removeUserFromGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.FORBIDDEN.value()));
  }

  @Test
  public void testGroupMemberNotFoundForDelete() throws Exception {
    mockMvc
        .perform(
            delete("/api/userGroupMembers/{groupMemberId}", UUID.randomUUID())
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("removeUserFromGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }


  @Test
  public void testAddUserToGroup() throws Exception {
    // Given
    UserGroupMemberDto userGroupMemberDto 



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
}
