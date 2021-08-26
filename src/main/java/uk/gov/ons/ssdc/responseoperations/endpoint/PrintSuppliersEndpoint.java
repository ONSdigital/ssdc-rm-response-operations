package uk.gov.ons.ssdc.responseoperations.endpoint;

import static uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType.CREATE_PRINT_TEMPLATE;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.responseoperations.config.PrintSupplierConfig;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;
import utility.ObjectMapperFactory;

@RestController
@RequestMapping(value = "/api/printsuppliers")
public class PrintSuppliersEndpoint {

  private final UserIdentity userIdentity;
  private final PrintSupplierConfig printSupplierConfig;

  public PrintSuppliersEndpoint(UserIdentity userIdentity,
      PrintSupplierConfig printSupplierConfig) {
    this.userIdentity = userIdentity;
    this.printSupplierConfig = printSupplierConfig;
  }

  @GetMapping
  public Set<String> getPrintSuppliers(
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    userIdentity.checkGlobalUserPermission(userEmail, CREATE_PRINT_TEMPLATE);
    return printSupplierConfig.getPrintSuppliers();

  }
}
