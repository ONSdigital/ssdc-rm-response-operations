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
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;
import uk.gov.ons.ssdc.responseoperations.test_utils.UserPermissionHelper;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserEndpointIT {
  @Autowired private UserGroupRepository userGroupRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private UserPermissionHelper userPermissionHelper;
  @LocalServerPort private int port;

  @BeforeEach
  @Transactional
  public void setUp() {
    userRepository.deleteAllInBatch();
    userGroupRepository.deleteAllInBatch()
    userPermissionHelper.clearDown();
  }

  @Test
  public void getAllUsers() {
    // Given
    userPermissionHelper.setUpTestUserPermission(UserGroupAuthorisedActivityType.LIST_USERS);

    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@testy.com");
    userRepository.saveAndFlush(user);

    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("Test Group");
    userGroupRepository.saveAndFlush(userGroup);

    RestTemplate restTemplate = new RestTemplate();
    String url = "http://localhost:" + port + "/api/users?groupId=" + userGroup.getId();
    ResponseEntity<UserDto[]> userResponse = restTemplate.getForEntity(url, UserDto[].class);

    UserDto[] users = userResponse.getBody();

    // Setting up the userPermissionHelper makes 2 users
    assertThat(users.length).isEqualTo(2);
    assertThat(users[1].getId()).isEqualTo(user.getId());
    assertThat(users[1].getEmail()).isEqualTo(user.getEmail());
  }
}
