package uk.gov.ons.ssdc.responseoperations.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoggingDto {
    private boolean audit;
    private String userWhoCarriedOutAction;
    private String actionType;
    private String details;
}