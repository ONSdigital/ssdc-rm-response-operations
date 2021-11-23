package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAdmin;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupMemberDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupAdminRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserGroupMemberEndpointIT {
  @Autowired private UserGroupMemberRepository userGroupMemberRepository;
  @Autowired private UserGroupRepository userGroupRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private UserGroupAdminRepository userGroupAdminRepository;

  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userGroupAdminRepository.deleteAllInBatch();
    userGroupMemberRepository.deleteAllInBatch();
    userGroupRepository.deleteAllInBatch();
    userRepository.deleteAllInBatch();
  }

  @Test
  public void getUsersAdminGroups() {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@test.com");
    userRepository.saveAndFlush(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("test group");
    userGroupRepository.saveAndFlush(userGroup);

    UserGroupAdmin admin = new UserGroupAdmin();
    admin.setId(UUID.randomUUID());
    admin.setUser(user);
    admin.setGroup(userGroup);
    userGroupAdminRepository.saveAndFlush(admin);

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(userGroup);
    userGroupMemberRepository.saveAndFlush(userGroupMember);

    RestTemplate restTemplate = new RestTemplate();
    String url =
        "http://localhost:"
            + port
            + String.format("/api/userGroupMembers/findByGroup/%s", userGroup.getId());
    ResponseEntity<UserGroupMemberDto[]> usersInGroupResponse =
        restTemplate.getForEntity(url, UserGroupMemberDto[].class);

    UserGroupMemberDto[] userGroupMemberDtos = usersInGroupResponse.getBody();
    assertThat(userGroupMemberDtos.length).isEqualTo(1);
  }
}
