package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserAutoSuggestDTO;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupAdminRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

@RestController
@RequestMapping(value = "/api/users")
public class UserEndpoint {
  private final UserRepository userRepository;
  //    private final UserIdentity userIdentity;
  private final UserGroupAdminRepository userGroupAdminRepository;

  public UserEndpoint(
      UserRepository userRepository,
      //            UserIdentity userIdentity,
      UserGroupAdminRepository userGroupAdminRepository) {
    this.userRepository = userRepository;
    //        this.userIdentity = userIdentity;
    this.userGroupAdminRepository = userGroupAdminRepository;
  }

  @GetMapping
  public List<UserAutoSuggestDTO> getUsers(
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    //        if (!userGroupAdminRepository.existsByUserEmail(userEmail)) {
    //            // If you're not admin of a group, you have to be super user
    //            userIdentity.checkGlobalUserPermission(userEmail,
    // UserGroupAuthorisedActivityType.SUPER_USER);
    //        }

    return userRepository.findAll().stream().map(this::mapDto).collect(Collectors.toList());
  }

  private UserAutoSuggestDTO mapDto(User user) {
    UserAutoSuggestDTO userDto = new UserAutoSuggestDTO();
    userDto.setId(user.getId());
    userDto.setEn(user.getEmail());
    return userDto;
  }
}
