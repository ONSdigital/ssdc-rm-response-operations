package uk.gov.ons.ssdc.responseoperations.endpoint;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAdmin;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.UserGroupDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupAdminRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/userGroups")
public class UserGroupEndpoint {
  private final UserGroupAdminRepository userGroupAdminRepository;

  public UserGroupEndpoint(
      UserGroupAdminRepository userGroupAdminRepository) {
    this.userGroupAdminRepository = userGroupAdminRepository;
  }

  @GetMapping("/thisUserAdminGroups")
  public List<UserGroupDto> getUserAdminGroups(
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    return userGroupAdminRepository.findByUserEmail(userEmail).stream()
            .map(UserGroupAdmin::getGroup)
            .map(this::mapDto)
            .collect(Collectors.toList());
  }

  private UserGroupDto mapDto(UserGroup group) {
    UserGroupDto userGroupDto = new UserGroupDto();
    userGroupDto.setId(group.getId());
    userGroupDto.setName(group.getName());
    return userGroupDto;
  }
}
