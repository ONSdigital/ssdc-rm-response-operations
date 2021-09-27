package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import lombok.Data;

@Data
public class PrintTemplateErrorsDto {
  private String packCodeErrors;
  private String templateErrors;
  private String supplierErrors;
  private boolean validationError = false;

  public void setPackCodeErrors(String packCodeErrors) {
    this.packCodeErrors = packCodeErrors;

    if (packCodeErrors != null) {
      this.validationError = true;
    }
  }

  public void setTemplateErrors(String templateErrors) {
    this.templateErrors = templateErrors;

    if (templateErrors != null) {
      this.validationError = true;
    }
  }

  public void setSupplierErrors(String supplierErrors) {
    this.supplierErrors = supplierErrors;

    if (supplierErrors != null) {
      this.validationError = true;
    }
  }
}
