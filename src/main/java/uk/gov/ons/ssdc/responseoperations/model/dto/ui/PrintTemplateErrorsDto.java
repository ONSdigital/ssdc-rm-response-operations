package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import lombok.Data;

import java.util.List;

@Data
public class PrintTemplateErrorsDto {
  private List<String> packCodeErrors;
  private List<String> templateErrors;
  private List<String> supplierErrors;
  private boolean error = false;

  public void setPackCodeErrors(List<String> packCodeErrors) {
    this.packCodeErrors = packCodeErrors;

    if (packCodeErrors.size() > 0) {
      this.error = true;
    }
  }

  public void setTemplateErrors(List<String> templateErrors) {
    this.templateErrors = templateErrors;

    if (templateErrors.size() > 0) {
      this.error = true;
    }
  }

  public void setSupplierErrors(List<String> supplierErrors) {
    this.supplierErrors = supplierErrors;

    if (supplierErrors.size() > 0) {
      this.error = true;
    }
  }
}
