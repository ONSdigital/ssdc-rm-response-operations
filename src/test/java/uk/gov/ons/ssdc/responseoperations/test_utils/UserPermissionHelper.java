package uk.gov.ons.ssdc.responseoperations.test_utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;
import uk.gov.ons.ssdc.common.model.entity.UserGroupPermission;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupMemberRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupPermissionRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupRepository;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserRepository;

import java.util.UUID;

@Component
public class UserPermissionHelper {

  @Autowired private UserRepository userRepository;
  @Autowired private UserGroupRepository userGroupRepository;
  @Autowired private UserGroupMemberRepository userGroupMemberRepository;
  @Autowired private UserGroupPermissionRepository userGroupPermissionRepository;

  public void clearDown() {
    userGroupPermissionRepository.deleteAllInBatch();
    userGroupMemberRepository.deleteAllInBatch();
    userGroupRepository.deleteAllInBatch();
    userRepository.deleteAllInBatch();
  }

  public void setUpTestUserPermission(UserGroupAuthorisedActivityType authorisedActivity) {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("test@test.com");
    userRepository.saveAndFlush(user);

    UserGroup group = new UserGroup();
    group.setId(UUID.randomUUID());
    group.setName("Test group");
    userGroupRepository.saveAndFlush(group);

    UserGroupMember userGroupMember = new UserGroupMember();
    userGroupMember.setId(UUID.randomUUID());
    userGroupMember.setUser(user);
    userGroupMember.setGroup(group);
    userGroupMemberRepository.saveAndFlush(userGroupMember);

    UserGroupPermission permission = new UserGroupPermission();
    permission.setId(UUID.randomUUID());
    permission.setAuthorisedActivity(authorisedActivity);
    permission.setGroup(group);
    userGroupPermissionRepository.saveAndFlush(permission);
  }
}
