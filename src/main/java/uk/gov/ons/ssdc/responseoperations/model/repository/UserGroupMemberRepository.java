package uk.gov.ons.ssdc.responseoperations.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.ons.ssdc.common.model.entity.User;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;

import java.util.List;
import java.util.UUID;

public interface UserGroupMemberRepository extends JpaRepository<UserGroupMember, UUID> {
  List<UserGroupMember> findByUser(User user);
  List<UserGroupMember> findByGroup(UserGroup group);
}
