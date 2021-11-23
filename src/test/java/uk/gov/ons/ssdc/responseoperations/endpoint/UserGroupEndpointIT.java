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
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupAdminRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserGroupEndpointIT {
  @Autowired private UserGroupAdminRepository userGroupAdminRepository;
  @Autowired private UserGroupRepository userGroupRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private UserGroupMemberRepository userGroupMemberRepository;
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
    // Given
    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("Test Group");
    userGroupRepository.saveAndFlush(userGroup);

    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@test.com");
    userRepository.saveAndFlush(user);

    UserGroupAdmin userGroupAdmin = new UserGroupAdmin();
    userGroupAdmin.setId(UUID.randomUUID());
    userGroupAdmin.setGroup(userGroup);
    userGroupAdmin.setUser(user);
    userGroupAdminRepository.saveAndFlush(userGroupAdmin);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/userGroups/thisUserAdminGroups/";
    ResponseEntity<UserGroupDto[]> userGroupResponse =
        restTemplate.getForEntity(url, UserGroupDto[].class);

    UserGroupDto[] actualUserGroups = userGroupResponse.getBody();
    assertThat(actualUserGroups.length).isEqualTo(1);
    assertThat(actualUserGroups[0].getName()).isEqualTo("Test Group");
  }
}
