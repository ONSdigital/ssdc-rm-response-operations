package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import java.util.Optional;
import lombok.Data;

@Data
public class ExportFileTemplateErrorsDto {
  private String packCodeErrors;
  private String templateErrors;
  private String destinationErrors;
  private boolean validationError = false;

  public void setPackCodeErrors(Optional<String> packCodeErrors) {
    if (packCodeErrors.isPresent()) {
      this.packCodeErrors = packCodeErrors.get();
      this.validationError = true;
    }
  }

  public void setTemplateErrors(Optional<String> templateErrors) {
    if (templateErrors.isPresent()) {
      this.templateErrors = templateErrors.get();
      this.validationError = true;
    }
  }

  public void setDestinationErrors(Optional<String> destinationErrors) {
    if (destinationErrors.isPresent()) {
      this.destinationErrors = destinationErrors.get();
      this.validationError = true;
    }
  }
}
