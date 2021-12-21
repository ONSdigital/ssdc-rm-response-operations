package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import java.util.UUID;
import lombok.Data;

@Data
public class UserDto {
  private UUID id;
  private String email;
}
