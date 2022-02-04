package uk.gov.ons.ssdc.responseoperations.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.godaddy.logging.Logger;
import com.godaddy.logging.LoggerFactory;
import java.net.URL;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.validation.ColumnValidator;
import uk.gov.ons.ssdc.responseoperations.endpoint.SurveyEndpoint;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyType;
import utility.ObjectMapperFactory;

@Component
public class SampleDefinitionClient {
  private static final Logger log = LoggerFactory.getLogger(SurveyEndpoint.class);
  private static final ObjectMapper OBJECT_MAPPER = ObjectMapperFactory.objectMapper();

  @Value("${sampledefinitions.social}")
  private String socialSampleDefinitionUrl;

  @Value("${sampledefinitions.business}")
  private String businessSampleDefinitionUrl;

  @Value("${sampledefinitions.health}")
  private String healthSampleDefinitionUrl;

  public ColumnValidator[] getColumnValidatorsForSurveyType(SurveyType surveyType) {
    String sampleDefintionUrll = getSampleDefinitionUrlForSurveyType(surveyType);

    try {
      URL url = new URL(sampleDefintionUrll);
      return OBJECT_MAPPER.readValue(url, ColumnValidator[].class);
    } catch (Exception e) {
      log.error(
          String.format(
              "Failed to successfully get ColumnValidator[] from %s.  Message: %s",
              sampleDefintionUrll, e.getMessage()));
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot get Sample Definition");
    }
  }

  public String getSampleDefinitionUrlForSurveyType(SurveyType surveyType) {
    switch (surveyType) {
      case SOCIAL:
        return socialSampleDefinitionUrl;
      case BUSINESS:
        return businessSampleDefinitionUrl;
      case HEALTH:
        return healthSampleDefinitionUrl;

      default:
        //PMD gets this
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            String.format("Cannot find surveyType %s to get survey definition"));
    }
  }
}
