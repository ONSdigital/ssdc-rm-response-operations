package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupMemberDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;

@RestController
@RequestMapping(value = "/api/userGroupMembers")
public class UserGroupMemberEndpoint {
  private final UserGroupMemberRepository userGroupMemberRepository;
  private final UserGroupRepository userGroupRepository;

  public UserGroupMemberEndpoint(
      UserGroupMemberRepository userGroupMemberRepository,
      UserGroupRepository userGroupRepository) {
    this.userGroupMemberRepository = userGroupMemberRepository;
    this.userGroupRepository = userGroupRepository;
  }

  @GetMapping("/findByGroup/{groupId}")
  public List<UserGroupMemberDto> findByGroup(
      @PathVariable(value = "groupId") UUID groupId,
      @RequestAttribute("userEmail") String userEmail) {
    UserGroup group =
        userGroupRepository
            .findById(groupId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group not found"));

    if (group.getAdmins().stream()
        .noneMatch(groupAdmin -> groupAdmin.getUser().getEmail().equals(userEmail))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not an admin");
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
                        HttpStatus.BAD_REQUEST, "Group membership not found"));

    if (userGroupMember.getGroup().getAdmins().stream()
        .noneMatch(groupAdmin -> groupAdmin.getUser().getEmail().equals(userEmail))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not an admin");
    }

    userGroupMemberRepository.delete(userGroupMember);
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
