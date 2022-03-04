package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class UserEndpointTest {
  @Mock private UserIdentity userIdentity;
  @Mock private UserGroupMemberRepository userGroupMemberRepository;
  @Mock private UserRepository userRepository;
  @Mock private UserGroupRepository userGroupRepository;

  @InjectMocks private UserEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetAllUsers() throws Exception {
    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("Test Group");

    User user = new User();
    user.setId(UUID.randomUUID());
    when(userRepository.findAll()).thenReturn(List.of(user));
    when(userGroupRepository.findById(any())).thenReturn(Optional.of(userGroup));

    List<UserGroupMember> usersInGroup = new ArrayList<>();
    when(userGroupMemberRepository.findByGroup(any())).thenReturn(usersInGroup);

    mockMvc
        .perform(
            get(String.format("/api/users?groupId=%s", userGroup.getId()))
                .requestAttr("userEmail", "nice@email.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id", is(user.getId().toString())));
  }

  @Test
  public void testGetAllUsersExcludingThoseAlreadyThere() throws Exception {
    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("Test Group");

    User user = new User();
    user.setId(UUID.randomUUID());
    User user2 = new User();
    user2.setId(UUID.randomUUID());

    when(userRepository.findAll()).thenReturn(List.of(user, user2));
    when(userGroupRepository.findById(any())).thenReturn(Optional.of(userGroup));

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setGroup(userGroup);
    userGroupMember.setUser(user);
    when(userGroupMemberRepository.findByGroup(any())).thenReturn(List.of(userGroupMember));

    mockMvc
        .perform(
            get(String.format("/api/users?groupId=%s", userGroup.getId()))
                .requestAttr("userEmail", "nice@email.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id", is(user2.getId().toString())));
  }

  @Test
  public void testGetAllUsersException() throws Exception {
    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("Test Group");

    User user = new User();
    user.setId(UUID.randomUUID());
    User user2 = new User();
    user2.setId(UUID.randomUUID());

    when(userRepository.findAll()).thenReturn(List.of(user, user2));
    when(userGroupRepository.findById(any())).thenReturn(Optional.empty());

    String expectedExceptionMessage =
        String.format("400 BAD_REQUEST \"Group Id not matched: %s\"", userGroup.getId());

    mockMvc
        .perform(
            get(String.format("/api/users?groupId=%s", userGroup.getId()))
                .requestAttr("userEmail", "nice@email.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(
            result ->
                assertThat(result.getResolvedException().getMessage())
                    .isEqualTo(expectedExceptionMessage));
  }
}
