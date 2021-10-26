package uk.gov.ons.ssdc.responseoperations.endpoint;

import static uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType.LIST_EXPORT_FILE_DESTINATIONS;

import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.responseoperations.config.ExportFileDestinationConfig;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@RestController
@RequestMapping(value = "/api/exportfiledestinations")
public class ExportFileDestinationEndpoint {

  private final UserIdentity userIdentity;
  private final ExportFileDestinationConfig exportFileDestinationConfig;

  public ExportFileDestinationEndpoint(
      UserIdentity userIdentity, ExportFileDestinationConfig exportFileDestinationConfig) {
    this.userIdentity = userIdentity;
    this.exportFileDestinationConfig = exportFileDestinationConfig;
  }

  @GetMapping
  public Set<String> getExportFileDestinations(
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    userIdentity.checkGlobalUserPermission(userEmail, LIST_EXPORT_FILE_DESTINATIONS);
    return exportFileDestinationConfig.getExportFileDestinations();
  }
}
