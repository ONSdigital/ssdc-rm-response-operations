package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.common.model.entity.UserGroup;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAdmin;
import uk.gov.ons.ssdc.responseoperations.model.repository.UserGroupAdminRepository;

@ExtendWith(MockitoExtension.class)
class UserGroupEndpointTest {
  @Mock private UserGroupAdminRepository userGroupAdminRepository;

  @InjectMocks private UserGroupEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetGroupsUserAdminOf() throws Exception {
    // Given
    UserGroup userGroup = new UserGroup();
    userGroup.setId(UUID.randomUUID());
    userGroup.setName("Test Group");
    UserGroupAdmin userGroupAdmin = new UserGroupAdmin();
    userGroupAdmin.setId(UUID.randomUUID());
    userGroupAdmin.setGroup(userGroup);
    List<UserGroupAdmin> userGroupList = List.of(userGroupAdmin);

    when(userGroupAdminRepository.findByUserEmail(anyString())).thenReturn(userGroupList);

    mockMvc
        .perform(
            get(String.format("/api/userGroups/thisUserAdminGroups"))
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(UserGroupEndpoint.class))
        .andExpect(handler().methodName("getUserAdminGroups"))
        .andExpect(jsonPath("$[0].id", is(userGroup.getId().toString())))
        .andExpect(jsonPath("$[0].name", is(userGroup.getName())));
  }
}
