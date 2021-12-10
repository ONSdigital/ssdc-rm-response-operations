package uk.gov.ons.ssdc.responseoperations.model;

public record LoggingDto(boolean audit, String userWhoCarriedOutAction, String actionType, String details) { }
