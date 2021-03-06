package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@RestController
@RequestMapping(value = "/api/users")
public class UserEndpoint {
  private final UserRepository userRepository;
  private final UserIdentity userIdentity;
  private final UserGroupMemberRepository userGroupMemberRepository;
  private final UserGroupRepository userGroupRepository;

  public UserEndpoint(
      UserRepository userRepository,
      UserIdentity userIdentity,
      UserGroupMemberRepository userGroupMemberRepository,
      UserGroupRepository userGroupRepository) {
    this.userRepository = userRepository;
    this.userIdentity = userIdentity;
    this.userGroupMemberRepository = userGroupMemberRepository;
    this.userGroupRepository = userGroupRepository;
  }

  @GetMapping
  public List<UserDto> getUsers(
      @RequestParam UUID groupId, @RequestAttribute("userEmail") String userEmail) {

    userIdentity.checkGlobalUserPermission(userEmail, UserGroupAuthorisedActivityType.LIST_USERS);

    List<UserDto> allUsers =
        userRepository.findAll().stream().map(this::mapDto).collect(Collectors.toList());

    UserGroup userGroup =
        userGroupRepository
            .findById(groupId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Group Id not matched: " + groupId));

    List<UUID> userIdsAlreadyInGroup =
        userGroupMemberRepository.findByGroup(userGroup).stream().map(this::mapUserId).toList();

    return allUsers.stream().filter(user -> !userIdsAlreadyInGroup.contains(user.getId())).toList();
  }

  private UUID mapUserId(UserGroupMember userGroupMember) {
    return userGroupMember.getUser().getId();
  }

  private UserDto mapDto(User user) {
    UserDto userDto = new UserDto();
    userDto.setId(user.getId());
    userDto.setEmail(user.getEmail());
    return userDto;
  }
}
