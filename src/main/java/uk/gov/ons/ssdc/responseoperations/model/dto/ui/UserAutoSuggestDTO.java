package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

import java.util.UUID;
import lombok.Data;

@Data
public class UserAutoSuggestDTO {
  private UUID id;
  // with Design System you have to present the data you want to see/search
  // in the AutoSuggest with a key like 'en', this is the default document language
  // an interesting idea for i18n and L10n.
  // It gets this from: this.lang = document.documentElement.getAttribute('lang').toLowerCase();

  // We'll put Email Address here, in this instance
  private String en;
}
