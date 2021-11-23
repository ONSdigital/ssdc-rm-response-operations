package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAdmin;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
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
    // why this, because .requestAttr("userEmail", "test@test.com") not working
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

    // Why not mockMvc? well because we can't map to @Value("#{request.getAttribute('userEmail')}")
    // String userEmail)
    List<UserGroupMemberDto> groupMembers =
        underTest.findByGroup(userGroup.getId(), user.getEmail());

    assertThat(groupMembers.size()).isEqualTo(1);
    UserGroupMemberDto actualGroupMember = groupMembers.get(0);
    assertThat(actualGroupMember.getId()).isEqualTo(userGroupMember.getId());
    assertThat(actualGroupMember.getGroupId()).isEqualTo(userGroup.getId());
    assertThat(actualGroupMember.getGroupName()).isEqualTo(userGroup.getName());
    assertThat(actualGroupMember.getUserEmail()).isEqualTo(user.getEmail());
    assertThat(actualGroupMember.getUserId()).isEqualTo(user.getId());
  }

  @Test
  public void testGetUsersInGroupBadUser() throws Exception {
    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", UUID.randomUUID())
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }

  @Test
  public void testGetUsersInGroupNotAdmin() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("notThisUser@email.gov.uk");
    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setUser(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setAdmins(List.of(admin));

    when(userGroupRepository.findById(any(UUID.class))).thenReturn(Optional.of(userGroup));

    mockMvc
        .perform(
            get("/api/userGroupMembers/findByGroup/{groupid}", UUID.randomUUID())
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(UserGroupMemberEndpoint.class))
        .andExpect(handler().methodName("findByGroup"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.FORBIDDEN.value()));
  }

  @Test
  public void testRemoveUserFromGroup() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@ons.gov.uk");
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

    // Why not mockMvc? well because we can't map to @Value("#{request.getAttribute('userEmail')}")
    // String userEmail)
    underTest.removeUserFromGroup(userGroupMember.getId(), user.getEmail());

    ArgumentCaptor<UserGroupMember> userGroupMemberArgumentCaptor =
        ArgumentCaptor.forClass(UserGroupMember.class);
    verify(userGroupMemberRepository).delete(userGroupMemberArgumentCaptor.capture());

    UserGroupMember actualGroupMemberRemoved = userGroupMemberArgumentCaptor.getValue();
    assertThat(actualGroupMemberRemoved.getId()).isEqualTo(userGroupMember.getId());
  }

  @Test
  public void testNotAdminForDelete() throws Exception {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("not@admin.com");
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
}
