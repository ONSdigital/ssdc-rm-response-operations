package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import java.util.Optional;
import lombok.Data;

@Data
public class PrintTemplateErrorsDto {
  private String packCodeErrors;
  private String templateErrors;
  private String supplierErrors;
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

  public void setSupplierErrors(Optional<String> supplierErrors) {
    if (supplierErrors.isPresent()) {
      this.supplierErrors = supplierErrors.get();
      this.validationError = true;
    }
  }
}
