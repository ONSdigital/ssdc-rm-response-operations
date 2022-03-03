package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.gov.ons.ssdc.responseoperations.test_utils.JsonHelper.asJsonString;

import java.util.ArrayList;
import java.util.Collections;
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
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAdmin;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupMemberDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class UserGroupMemberEndpointTest {
  @Mock private UserGroupRepository userGroupRepository;

  @Mock private UserGroupMemberRepository userGroupMemberRepository;

  @Mock private UserIdentity userIdentity;

  @Mock private UserRepository userRepository;

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
  public void testGroupNotFoundInGetUsers() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@ons.gov.uk");
    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setUser(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("test group");
    userGroup.setAdmins(Collections.emptyList());

    when(userGroupRepository.findById(any(UUID.class))).thenReturn(Optional.of(userGroup));

    String expectedErrorMsg = "403 FORBIDDEN \"User test@ons.gov.uk not an admin of test group\"";

    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", userGroup.getId())
                .requestAttr("userEmail", "test@ons.gov.uk")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException))
        .andExpect(
            result ->
                assertThat(result.getResolvedException().getMessage()).isEqualTo(expectedErrorMsg))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"));
  }

  @Test
  public void testUserNotAdminInGetUsers() throws Exception {
    when(userGroupRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

    UUID groupId = UUID.randomUUID();
    String expectedErrorMsg = "400 BAD_REQUEST \"Group " + groupId + " not found\"";

    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", groupId)
                .requestAttr("userEmail", "test@ons.gov.uk")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException))
        .andExpect(
            result ->
                assertThat(result.getResolvedException().getMessage()).isEqualTo(expectedErrorMsg))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"));
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
  public void testRemoveUserFromGroupMemberIdMissing() throws Exception {
    when(userGroupMemberRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

    UUID userGroupMemberId = UUID.randomUUID();
    String expectedErrorMsg =
        "400 BAD_REQUEST \"Did not find groupMemberId " + userGroupMemberId + "\"";

    mockMvc
        .perform(
            delete("/api/userGroupMembers/{groupMemberId}", userGroupMemberId)
                .requestAttr("userEmail", "test@test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(
            result -> assertTrue(result.getResolvedException() instanceof ResponseStatusException))
        .andExpect(
            result ->
                assertThat(result.getResolvedException().getMessage()).isEqualTo(expectedErrorMsg))
        .andExpect(status().is4xxClientError())
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
    userGroup.setName("Test Group");
    userGroup.setAdmins(List.of(admin));

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(userGroup);

    when(userGroupMemberRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(userGroupMember));

    String expectedErrorMsg =
        String.format("403 FORBIDDEN \"User notadmin@member.com not an admin of Test Group\"");

    mockMvc
        .perform(
            delete("/api/userGroupMembers/{groupMemberId}", UUID.randomUUID())
                .requestAttr("userEmail", "notadmin@member.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(
            result ->
                assertThat(result.getResolvedException().getMessage()).isEqualTo(expectedErrorMsg))
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("removeUserFromGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.FORBIDDEN.value()));
  }

  @Test
  public void testAddUserToGroup() throws Exception {
    // Given
    User adminUser = new User();
    adminUser.setEmail("test@test.com");
    adminUser.setId(UUID.randomUUID());

    UserGroupAdmin userGroupAdmin = new UserGroupAdmin();
    userGroupAdmin.setUser(adminUser);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setAdmins(List.of(userGroupAdmin));

    User userToAdd = new User();
    userToAdd.setEmail("AddMe@ons.co.uk");
    userToAdd.setId(UUID.randomUUID());
    userToAdd.setMemberOf(List.of());

    UserGroupMemberDto userGroupMemberDto = new UserGroupMemberDto();
    userGroupMemberDto.setUserId(userToAdd.getId());
    userGroupMemberDto.setGroupId(userGroup.getId());

    when(userGroupRepository.findById(any())).thenReturn(Optional.of(userGroup));
    when(userRepository.findById(any())).thenReturn(Optional.of(userToAdd));

    mockMvc
        .perform(
            post("/api/userGroupMembers", userGroupMemberDto)
                .requestAttr("userEmail", adminUser.getEmail())
                .content(asJsonString(userGroupMemberDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("addUserToGroup"));

    // Then
    ArgumentCaptor<UserGroupMember> userGroupMemberArgumentCaptor =
        ArgumentCaptor.forClass(UserGroupMember.class);
    verify(userGroupMemberRepository).saveAndFlush(userGroupMemberArgumentCaptor.capture());
    assertThat(userGroupMemberArgumentCaptor.getValue().getGroup().getId())
        .isEqualTo(userGroup.getId());
    assertThat(userGroupMemberArgumentCaptor.getValue().getUser().getId())
        .isEqualTo(userToAdd.getId());
  }

  @Test
  public void testAddUserToGroupGroupNotFound() throws Exception {
    // Given
    User adminUser = new User();
    adminUser.setEmail("test@test.com");
    adminUser.setId(UUID.randomUUID());

    UserGroupAdmin userGroupAdmin = new UserGroupAdmin();
    userGroupAdmin.setUser(adminUser);

    User userToAdd = new User();
    userToAdd.setEmail("AddMe@ons.co.uk");
    userToAdd.setId(UUID.randomUUID());
    userToAdd.setMemberOf(List.of());

    UserGroupMemberDto userGroupMemberDto = new UserGroupMemberDto();
    userGroupMemberDto.setUserId(userToAdd.getId());

    when(userGroupRepository.findById(any())).thenReturn(Optional.empty());

    String expectedErrorMsg = "404 NOT_FOUND \"Group not found for adding user\"";

    mockMvc
        .perform(
            post("/api/userGroupMembers", userGroupMemberDto)
                .requestAttr("userEmail", adminUser.getEmail())
                .content(asJsonString(userGroupMemberDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(
            result ->
                assertThat(result.getResolvedException().getMessage()).isEqualTo(expectedErrorMsg));
  }
}
