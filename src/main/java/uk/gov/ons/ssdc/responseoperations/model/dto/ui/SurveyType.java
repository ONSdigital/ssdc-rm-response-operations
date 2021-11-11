package uk.gov.ons.ssdc.responseoperations.model.dto.ui;

public enum SurveyType {

    SOCIAL("https://raw.githubusercontent.com/ONSdigital/ssdc-shared-events/main/sample/social/0.1.0/social.json"),
    BUSINESS("https://raw.githubusercontent.com/ONSdigital/ssdc-shared-events/main/sample/business/0.1.0-DRAFT/business.json"),
    HEALTH("https://raw.githubusercontent.com/ONSdigital/ssdc-shared-events/main/sample/sis/0.1.0-DRAFT/sis.json");

    private final String sampleDefinitionUrl;

    SurveyType(String sampleDefinitionUrl) {
        this.sampleDefinitionUrl = sampleDefinitionUrl;
    }

    public String getSampleDefintionUrll() {
        return sampleDefinitionUrl;
    }
}
