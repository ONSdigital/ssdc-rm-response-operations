package uk.gov.ons.ssdc.responseoperations.model.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ActiveProfiles;
import uk.gov.ons.ssdc.common.model.entity.UserGroupMember;

@Component
@ActiveProfiles("test")
public interface UserGroupMemberRepository extends JpaRepository<UserGroupMember, UUID> {}
