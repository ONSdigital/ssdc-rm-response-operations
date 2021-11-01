package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import lombok.Data;

@Data
public class ExportFileTemplateDto {
  private String packCode;
  private String[] template;
  private String exportFileDestination;
  private String description;
}
