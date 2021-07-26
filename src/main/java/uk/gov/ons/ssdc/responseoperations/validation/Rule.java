package uk.gov.ons.ssdc.responseoperations.validation;

import java.io.Serializable;
import java.util.Optional;

public interface Rule extends Serializable {
  Optional<String> checkValidity(String data);
}
