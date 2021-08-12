package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import lombok.Data;

@Data
public class PrintTemplateDto {
  private String packCode;
  private String[] template;
  private String printSupplier;
}
