package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.responseoperations.model.entity.Survey;
import uk.gov.ons.ssdc.responseoperations.model.entity.User;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroup;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupPermission;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class AuthorisationEndpointTest {

  @Mock private UserRepository userRepository;

  @InjectMocks private AuthorisationEndpoint underTest;

  @Test
  public void testSingleGlobalPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());

    User user = getUser(UserGroupAuthorisedActivityType.CREATE_SURVEY, null);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First, check that user has permission when no survey is specified
    Set<UserGroupAuthorisedActivityType> authorisedActivities =
        underTest.getAuthorisedActivities(Optional.empty(), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(1);
    assertThat(authorisedActivities.contains(UserGroupAuthorisedActivityType.CREATE_SURVEY))
        .isTrue();

    // Second, check that user still has permission when a particular survey is specified
    authorisedActivities =
        underTest.getAuthorisedActivities(Optional.of(survey.getId()), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(1);
    assertThat(authorisedActivities.contains(UserGroupAuthorisedActivityType.CREATE_SURVEY))
        .isTrue();
  }

  @Test
  public void testGlobalSuperUserPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());

    User user = getUser(UserGroupAuthorisedActivityType.SUPER_USER, null);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First, check that user has super user permissions when no survey is specified
    Set<UserGroupAuthorisedActivityType> authorisedActivities =
        underTest.getAuthorisedActivities(Optional.empty(), "test@test.com");

    assertThat(authorisedActivities.size())
        .isEqualTo(UserGroupAuthorisedActivityType.values().length);

    // Second, check that user still has super user permissions when a particular survey's specified
    authorisedActivities =
        underTest.getAuthorisedActivities(Optional.of(survey.getId()), "test@test.com");

    assertThat(authorisedActivities.size())
        .isEqualTo(UserGroupAuthorisedActivityType.values().length);
  }

  @Test
  public void testSingleSurveyPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    User user = getUser(UserGroupAuthorisedActivityType.CREATE_COLLECTION_EXERCISE, survey);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First, check that user has permission on the specific survey
    Set<UserGroupAuthorisedActivityType> authorisedActivities =
        underTest.getAuthorisedActivities(Optional.of(survey.getId()), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(1);
    assertThat(
            authorisedActivities.contains(
                UserGroupAuthorisedActivityType.CREATE_COLLECTION_EXERCISE))
        .isTrue();

    // Second, check that user has NO permission on a DIFFERENT survey
    authorisedActivities =
        underTest.getAuthorisedActivities(Optional.of(UUID.randomUUID()), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(0);

    // Third, check that user has NO permission globally
    authorisedActivities = underTest.getAuthorisedActivities(Optional.empty(), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(0);
  }

  @Test
  public void testSurveySuperUserPermission() {
    Survey survey = new Survey();
    survey.setId(UUID.randomUUID());
    User user = getUser(UserGroupAuthorisedActivityType.SUPER_USER, survey);

    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

    // First, check that the user has all permissions on the specific survey
    Set<UserGroupAuthorisedActivityType> authorisedActivities =
        underTest.getAuthorisedActivities(Optional.of(survey.getId()), "test@test.com");

    assertThat(authorisedActivities.size())
        .isEqualTo(UserGroupAuthorisedActivityType.values().length);

    // Second, check that the user has NO permissions on a DIFFERENT survey
    authorisedActivities =
        underTest.getAuthorisedActivities(Optional.of(UUID.randomUUID()), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(0);

    // Third, check that the user has NO permissions GLOBALLY
    authorisedActivities = underTest.getAuthorisedActivities(Optional.empty(), "test@test.com");

    assertThat(authorisedActivities.size()).isEqualTo(0);
  }

  @Test
  public void testUnknownUserIsForbidden() {
    ResponseStatusException thrown =
        assertThrows(
            ResponseStatusException.class,
            () -> underTest.getAuthorisedActivities(Optional.empty(), "test@test.com"));

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
