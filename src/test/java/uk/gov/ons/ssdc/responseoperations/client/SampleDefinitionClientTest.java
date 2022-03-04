package uk.gov.ons.ssdc.responseoperations.client;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.net.MalformedURLException;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import uk.gov.ons.ssdc.common.validation.ColumnValidator;
import uk.gov.ons.ssdc.common.validation.Rule;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyType;

class SampleDefinitionClientTest {

  @Test
  public void testGetSampleDefinitionUrl() {
    SampleDefinitionClient underTest = new SampleDefinitionClient();
    ReflectionTestUtils.setField(underTest, "socialSampleDefinitionUrl", "https//social.url");
    ReflectionTestUtils.setField(underTest, "businessSampleDefinitionUrl", "https//business.url");
    ReflectionTestUtils.setField(underTest, "healthSampleDefinitionUrl", "https//health.url");

    assertThat(underTest.getSampleDefinitionUrlForSurveyType(SurveyType.SOCIAL))
        .isEqualTo("https//social.url");
    assertThat(underTest.getSampleDefinitionUrlForSurveyType(SurveyType.BUSINESS))
        .isEqualTo("https//business.url");
    assertThat(underTest.getSampleDefinitionUrlForSurveyType(SurveyType.HEALTH))
        .isEqualTo("https//health.url");
  }

  @Test
  public void testGetColumnValidators() throws MalformedURLException {
    SampleDefinitionClient underTest = new SampleDefinitionClient();
    String fileUrl =
        new File("src/test/resources/sampleDefinitionFiles/social_test.json")
            .toURI()
            .toURL()
            .toString();

    ReflectionTestUtils.setField(underTest, "socialSampleDefinitionUrl", fileUrl);

    ColumnValidator[] actualColumnValidators =
        underTest.getColumnValidatorsForSurveyType(SurveyType.SOCIAL);
    assertThat(actualColumnValidators).hasSize(2);

    ColumnValidator questionnaireColumnValidator = actualColumnValidators[0];
    assertThat(questionnaireColumnValidator.getColumnName()).isEqualTo("questionnaire");

    Rule[] questionnaireRules = actualColumnValidators[0].getRules();
    assertThat(questionnaireRules).hasSize(2);
    assertThat(questionnaireRules[0].getClass().getName())
        .isEqualTo("uk.gov.ons.ssdc.common.validation.MandatoryRule");
    assertThat(questionnaireRules[1].getClass().getName())
        .isEqualTo("uk.gov.ons.ssdc.common.validation.LengthRule");
  }
}
