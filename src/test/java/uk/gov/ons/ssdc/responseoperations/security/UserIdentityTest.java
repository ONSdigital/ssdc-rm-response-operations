package uk.gov.ons.ssdc.responseoperations.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.Survey;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.common.model.entity.UserGroupPermission;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserIdentityTest {
  @Mock private UserRepository userRepository;

  private UserIdentity underTest;

  @BeforeEach
  public void setUp() {
    boolean dummyUserIdentityAllowed = false;
    underTest =
        new UserIdentity(
            userRepository,
            "testIapAudience",
            "testDummyUserIdentity",
            dummyUserIdentityAllowed,
            "testDummySuperUserIdentity");
  }

  @Test
  public void testSingleGlobalPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());

    User user = getUser(UserGroupAuthorisedActivityType.CREATE_SURVEY, null);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First check the allowed permission
    underTest.checkGlobalUserPermission(
        "test@test.com", UserGroupAuthorisedActivityType.CREATE_SURVEY);

    // Second, check all the non-allowed permissions are forbidden
    for (UserGroupAuthorisedActivityType activityType : UserGroupAuthorisedActivityType.values()) {
      if (activityType != UserGroupAuthorisedActivityType.CREATE_SURVEY) {
        ResponseStatusException thrown =
            assertThrows(
                ResponseStatusException.class,
                () -> underTest.checkGlobalUserPermission("test@test.com", activityType));

        assertThat(thrown.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
      }
    }
  }

  @Test
  public void testGlobalSuperUserPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());

    User user = getUser(UserGroupAuthorisedActivityType.SUPER_USER, null);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    for (UserGroupAuthorisedActivityType activityType : UserGroupAuthorisedActivityType.values()) {
      underTest.checkGlobalUserPermission("test@test.com", activityType);
    }
  }

  @Test
  public void testSingleSurveyPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    User user = getUser(UserGroupAuthorisedActivityType.CREATE_COLLECTION_EXERCISE, survey);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First, check that user has permission on the specific survey
    underTest.checkUserPermission(
        "test@test.com", survey, UserGroupAuthorisedActivityType.CREATE_COLLECTION_EXERCISE);

    // Second, check that user has NO permission on a DIFFERENT survey
    for (UserGroupAuthorisedActivityType activityType : UserGroupAuthorisedActivityType.values()) {
      ResponseStatusException thrown =
          assertThrows(
              ResponseStatusException.class,
              () -> underTest.checkUserPermission("test@test.com", new Survey(), activityType));

      assertThat(thrown.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
    }
  }

  @Test
  public void testSurveySuperUserPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    User user = getUser(UserGroupAuthorisedActivityType.SUPER_USER, survey);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First, check that the user has all permissions on the specific survey
    for (UserGroupAuthorisedActivityType activityType : UserGroupAuthorisedActivityType.values()) {
      underTest.checkUserPermission("test@test.com", survey, activityType);
    }

    // Second, check that the user has NO permissions on a DIFFERENT survey
    for (UserGroupAuthorisedActivityType activityType : UserGroupAuthorisedActivityType.values()) {
      ResponseStatusException thrown =
          assertThrows(
              ResponseStatusException.class,
              () -> underTest.checkUserPermission("test@test.com", new Survey(), activityType));

      assertThat(thrown.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
    }
  }

  @Test
  public void testUnknownUserIsForbidden() {
    ResponseStatusException thrown =
        assertThrows(
            ResponseStatusException.class,
            () ->
                underTest.checkUserPermission(
                    "test@test.com", new Survey(), UserGroupAuthorisedActivityType.CREATE_SURVEY));

    assertThat(thrown.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
  }

  @Test
  public void testUnknownUserIsForbiddenGlobal() {
    ResponseStatusException thrown =
        assertThrows(
            ResponseStatusException.class,
            () ->
                underTest.checkGlobalUserPermission(
                    "test@test.com", UserGroupAuthorisedActivityType.CREATE_SURVEY));

    assertThat(thrown.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
  }

  private User getUser(UserGroupAuthorisedActivityType authorisedActivity, Survey survey) {
    UserGroupPermission permission = new UserGroupPermission();
    permission.setAuthorisedActivity(authorisedActivity);
    permission.setSurvey(survey);

    UserGroup group = new UserGroup();
    group.setId(UUID.randomUUID());
    group.setPermissions(List.of(permission));

    UserGroupMember groupMember = new UserGroupMember();
    groupMember.setGroup(group);

    User user = new User();
    user.setMemberOf(List.of(groupMember));

    return user;
  }
}
