package uk.gov.ons.ssdc.responseoperations.endpoint;

import com.godaddy.logging.Logger;
import com.godaddy.logging.LoggerFactory;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.AuditLogging;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupMemberDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@RestController
@RequestMapping(value = "/api/userGroupMembers")
public class UserGroupMemberEndpoint {
  private static final Logger log = LoggerFactory.getLogger(UserGroupMemberEndpoint.class);
  private final UserGroupMemberRepository userGroupMemberRepository;
  private final UserGroupRepository userGroupRepository;
  private final UserIdentity userIdentity;
  private final UserRepository userRepository;

  public UserGroupMemberEndpoint(
      UserGroupMemberRepository userGroupMemberRepository,
      UserGroupRepository userGroupRepository,
      UserIdentity userIdentity,
      UserRepository userRepository) {
    this.userGroupMemberRepository = userGroupMemberRepository;
    this.userGroupRepository = userGroupRepository;
    this.userIdentity = userIdentity;
    this.userRepository = userRepository;
  }

  @GetMapping("/findByGroup/{groupId}")
  public List<UserGroupMemberDto> findByGroup(
      @PathVariable(value = "groupId") UUID groupId,
      @RequestAttribute("userEmail") String userEmail) {
    UserGroup group =
        userGroupRepository
            .findById(groupId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, String.format("Group %s not found", groupId)));

    if (group.getAdmins().stream()
        .noneMatch(groupAdmin -> groupAdmin.getUser().getEmail().equals(userEmail))) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          String.format("User %s not an admin of %s", userEmail, group.getName()));
    }

    return userGroupMemberRepository.findByGroup(group).stream()
        .map(this::mapGroupMember)
        .collect(Collectors.toList());
  }

  @DeleteMapping("/{groupMemberId}")
  public void removeUserFromGroup(
      @PathVariable(value = "groupMemberId") UUID groupMemberId,
      @RequestAttribute("userEmail") String userEmail) {
    UserGroupMember userGroupMember =
        userGroupMemberRepository
            .findById(groupMemberId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                            String.format("Did not find groupMemberId %s", groupMemberId)));

    if (userGroupMember.getGroup().getAdmins().stream()
        .noneMatch(groupAdmin -> groupAdmin.getUser().getEmail().equals(userEmail))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
              String.format("User %s not an admin of %s", userEmail, userGroupMember.getGroup().getName()));
    }

    userGroupMemberRepository.delete(userGroupMember);

    log.with(
            new AuditLogging(
                true,
                userEmail,
                "REMOVED USER FROM GROUP",
                String.format(
                    "User %s was removed from group %s",
                    userGroupMember.getUser().getEmail(), userGroupMember.getGroup().getName())))
        .info(
            String.format(
                "User %s was removed from group %s by %s",
                userGroupMember.getUser().getEmail(),
                userGroupMember.getGroup().getName(),
                userEmail));
  }

  @PostMapping
  public ResponseEntity<Void> addUserToGroup(
      @RequestBody UserGroupMemberDto userGroupMemberDto,
      @RequestAttribute("userEmail") String userEmail) {
    UserGroup group =
        userGroupRepository
            .findById(userGroupMemberDto.getGroupId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("Group not found for adding user")));

    if (group.getAdmins().stream()
        .noneMatch(groupAdmin -> groupAdmin.getUser().getEmail().equals(userEmail))) {
      // If you're not admin of this group, you have to be super user
      userIdentity.checkGlobalUserPermission(userEmail, UserGroupAuthorisedActivityType.SUPER_USER);
    }

    User user =
        userRepository
            .findById(userGroupMemberDto.getUserId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

    if (user.getMemberOf().stream()
        .anyMatch(userGroupMember -> userGroupMember.getGroup() == group)) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "User is already a member of this group");
    }

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(group);

    userGroupMemberRepository.saveAndFlush(userGroupMember);

    log.with(
            new AuditLogging(
                true,
                userEmail,
                "USER ADDED TO GROUP",
                String.format(
                    "User %s was added to group %s",
                    userGroupMember.getUser().getEmail(), userGroupMember.getGroup().getName())))
        .info(
            String.format(
                "User %s was added to group %s by %s",
                userGroupMember.getUser().getEmail(),
                userGroupMember.getGroup().getName(),
                userEmail));

    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  private UserGroupMemberDto mapGroupMember(UserGroupMember member) {
    UserGroupMemberDto userGroupMemberDto = new UserGroupMemberDto();
    userGroupMemberDto.setId(member.getId());
    userGroupMemberDto.setGroupId(member.getGroup().getId());
    userGroupMemberDto.setUserId(member.getUser().getId());
    userGroupMemberDto.setUserEmail(member.getUser().getEmail());
    userGroupMemberDto.setGroupName(member.getGroup().getName());
    return userGroupMemberDto;
  }
}
