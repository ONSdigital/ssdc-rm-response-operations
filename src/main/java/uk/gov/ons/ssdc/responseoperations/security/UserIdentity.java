package uk.gov.ons.ssdc.responseoperations.security;

import com.google.api.client.json.webtoken.JsonWebToken;
import com.google.auth.oauth2.TokenVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.Survey;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.common.model.entity.UserGroupPermission;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

@Component
public class UserIdentity {
  private static final Logger log = LoggerFactory.getLogger(UserIdentity.class);
  private static final String IAP_ISSUER_URL = "https://cloud.google.com/iap";

  private final UserRepository userRepository;
  private final String iapAudience;
  private final String dummyUserIdentity;
  private final boolean dummyUserIdentityAllowed;
  private final String dummySuperUserIdentity;

  private TokenVerifier tokenVerifier = null;

  public UserIdentity(
      UserRepository userRepository,
      @Value("${iapaudience}") String iapAudience,
      @Value("${dummyuseridentity}") String dummyUserIdentity,
      @Value("${dummyuseridentity-allowed}") boolean dummyUserIdentityAllowed,
      @Value("${dummysuperuseridentity}") String dummySuperUserIdentity) {
    this.userRepository = userRepository;
    this.iapAudience = iapAudience;
    this.dummyUserIdentity = dummyUserIdentity;
    this.dummyUserIdentityAllowed = dummyUserIdentityAllowed;
    this.dummySuperUserIdentity = dummySuperUserIdentity;

    if (dummyUserIdentityAllowed) {
      log.atError()
          .setMessage(
              "*** SECURITY ALERT *** IF YOU SEE THIS IN PRODUCTION, SHUT DOWN IMMEDIATELY!!!")
          .log();
    }
  }

  public void checkUserPermission(
      String userEmail, Survey survey, UserGroupAuthorisedActivityType activity) {
    if (dummyUserIdentityAllowed && userEmail.equalsIgnoreCase(dummySuperUserIdentity)) {
      // Dummy test super user is fully authorised, bypassing all security
      // This is **STRICTLY** for ease of dev/testing in non-production environments
      return;
    }

    User user =
        userRepository
            .findByEmailIgnoreCase(userEmail)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.FORBIDDEN, String.format("User %s not known to RM", userEmail)));

    for (UserGroupMember groupMember : user.getMemberOf()) {
      for (UserGroupPermission permission : groupMember.getGroup().getPermissions()) {
        // SUPER USER without a survey = GLOBAL super user (all permissions)
        if ((permission.getAuthorisedActivity() == UserGroupAuthorisedActivityType.SUPER_USER
                && permission.getSurvey() == null)
            // SUPER USER with a survey = super user only on the specified survey
            || (permission.getAuthorisedActivity() == UserGroupAuthorisedActivityType.SUPER_USER
                    && permission.getSurvey() != null
                    && permission.getSurvey().getId().equals(survey.getId())
                // Otherwise, user must have specific activity/survey combo to be authorised
                || (permission.getAuthorisedActivity() == activity
                    && (permission.getSurvey() == null
                        || (permission.getSurvey() != null
                            && permission.getSurvey().getId().equals(survey.getId())))))) {
          return; // User is authorised
        }
      }
    }

    throw new ResponseStatusException(
        HttpStatus.FORBIDDEN,
        String.format("User not authorised for activity %s", activity.name()));
  }

  public void checkGlobalUserPermission(
      String userEmail, UserGroupAuthorisedActivityType activity) {

    if (dummyUserIdentityAllowed && userEmail.equalsIgnoreCase(dummySuperUserIdentity)) {
      // Dummy test super user is fully authorised, bypassing all security
      // This is **STRICTLY** for ease of dev/testing in non-production environments
      return;
    }

    User user =
        userRepository
            .findByEmailIgnoreCase(userEmail)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.FORBIDDEN, String.format("User %s not known to RM", userEmail)));

    for (UserGroupMember groupMember : user.getMemberOf()) {
      for (UserGroupPermission permission : groupMember.getGroup().getPermissions()) {
        // SUPER USER without a survey = GLOBAL super user (all permissions)
        if ((permission.getAuthorisedActivity() == UserGroupAuthorisedActivityType.SUPER_USER
                && permission.getSurvey() == null)
            // Otherwise, user must have specific activity to be authorised
            || (permission.getAuthorisedActivity() == activity)) {
          return; // User is authorised
        }
      }
    }

    throw new ResponseStatusException(
        HttpStatus.FORBIDDEN,
        String.format("User not authorised for activity %s", activity.name()));
  }

  public String getUserEmail(String jwtToken) {
    if (dummyUserIdentityAllowed && !StringUtils.hasText(jwtToken)) {
      // If there's no JWT header and dummy test user is enabled, use it
      // This is **STRICTLY** for ease of dev/testing in non-production environments
      return dummyUserIdentity;
    } else if (!StringUtils.hasText(jwtToken)) {
      // This request must have come from __inside__ the firewall/cluster, and should not be allowed
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, String.format("Requests bypassing IAP are strictly forbidden"));
    } else {
      return verifyJwtAndGetEmail(jwtToken);
    }
  }

  private synchronized TokenVerifier getTokenVerifier() {

    if (tokenVerifier == null) {
      tokenVerifier =
          TokenVerifier.newBuilder().setAudience(iapAudience).setIssuer(IAP_ISSUER_URL).build();
    }

    return tokenVerifier;
  }

  private String verifyJwtAndGetEmail(String jwtToken) {
    try {
      TokenVerifier tokenVerifier = getTokenVerifier();
      JsonWebToken jsonWebToken = tokenVerifier.verify(jwtToken);

      // Verify that the token contain subject and email claims
      JsonWebToken.Payload payload = jsonWebToken.getPayload();
      if (payload.getSubject() != null && payload.get("email") != null) {
        return (String) payload.get("email");
      } else {
        return null;
      }
    } catch (TokenVerifier.VerificationException e) {
      throw new RuntimeException(e);
    }
  }
}
