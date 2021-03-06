package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import java.util.UUID;
import lombok.Data;

@Data
public class UserGroupDto {
  private UUID id;
  private String name;
  private String description;
}
