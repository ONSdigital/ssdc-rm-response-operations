package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.handler;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.config.PrintSupplierConfig;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class PrintSuppliersEndpointTest {

  @Mock private UserIdentity userIdentity;

  @Mock private PrintSupplierConfig printSupplierConfig;

  @InjectMocks private PrintSuppliersEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetPrintSuppliers() throws Exception {

    // Given
    when(printSupplierConfig.getPrintSuppliers()).thenReturn(Set.of("SUPPLIER_A"));

    // When
    mockMvc
        .perform(get("/api/printsuppliers").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(PrintSuppliersEndpoint.class))
        .andExpect(handler().methodName("getPrintSuppliers"))
        .andExpect(jsonPath("$[0]", is("SUPPLIER_A")));

    // Then
    verify(userIdentity)
        .checkGlobalUserPermission(
            anyString(), eq(UserGroupAuthorisedActivityType.LIST_PRINT_SUPPLIERS));
  }
}
