package uk.gov.ons.ssdc.responseoperations.endpoint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.godaddy.logging.Logger;
import com.godaddy.logging.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.ons.ssdc.common.model.entity.Survey;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.common.validation.ColumnValidator;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyType;
import uk.gov.ons.ssdc.responseoperations.model.repository.SurveyRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;
import utility.ObjectMapperFactory;

import java.net.URL;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/surveys")
public class SurveyEndpoint {
    private static final Logger log = LoggerFactory.getLogger(SurveyEndpoint.class);
    private static final ObjectMapper OBJECT_MAPPER = ObjectMapperFactory.objectMapper();
    private final SurveyRepository surveyRepository;
    private final UserIdentity userIdentity;

    public SurveyEndpoint(SurveyRepository surveyRepository, UserIdentity userIdentity) {
        this.surveyRepository = surveyRepository;
        this.userIdentity = userIdentity;
    }

    @GetMapping
    public List<SurveyDto> getSurveys(
            @Value("#{request.getAttribute('userEmail')}") String userEmail) {
        userIdentity.checkGlobalUserPermission(userEmail, UserGroupAuthorisedActivityType.LIST_SURVEYS);

        List<Survey> surveys = surveyRepository.findAll();

        // TODO: should we filter out the surveys that the user has no permissions on?
        return surveys.stream().map(this::mapSurvey).collect(Collectors.toList());
    }

    @GetMapping(value = "/{id}")
    public SurveyDto getSurvey(@PathVariable("id") UUID id) {
        // TODO: should we stop unauthorised users getting survey name or is it over the top?

        Optional<Survey> optionalSurvey = surveyRepository.findById(id);

        if (!optionalSurvey.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return mapSurvey(optionalSurvey.get());
    }

    @GetMapping(value = "/surveyTypes")
    public String[] getSurveyTypes() {
        return EnumSet.allOf(SurveyType.class).stream().map(Enum::toString).toArray(String[]::new);
    }

    @PostMapping
    public ResponseEntity createSurvey(
            @RequestBody SurveyDto survey,
            @Value("#{request.getAttribute('userEmail')}") String userEmail) {
        userIdentity.checkGlobalUserPermission(
                userEmail, UserGroupAuthorisedActivityType.CREATE_SURVEY);

        Survey newSurvey = new Survey();
        newSurvey.setId(UUID.randomUUID());
        newSurvey.setName(survey.getName());

        SurveyType surveyType = survey.getSurveyType();
        ColumnValidator[] columnValidators = getColumnValidatorsFromUrl(surveyType.getSampleDefintionUrll());
        newSurvey.setSampleValidationRules(columnValidators);

        newSurvey.setSampleDefinitionUrl(surveyType.getSampleDefintionUrll());
        newSurvey.setSampleSeparator(',');
        surveyRepository.saveAndFlush(newSurvey);

        return new ResponseEntity(HttpStatus.CREATED);
    }

    private ColumnValidator[] getColumnValidatorsFromUrl(String sampleDefintionUrll) {
        try {
            URL url = new URL(sampleDefintionUrll);
            return  OBJECT_MAPPER.readValue(url, ColumnValidator[].class);
        } catch (Exception e){
            log.error(String.format("Failed to successfully get ColumnValidator[] from %s.  Message: %s",
                    sampleDefintionUrll));
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot get Sample Definition");
        }
    }

    private SurveyDto mapSurvey(Survey survey) {
        SurveyDto dto = new SurveyDto();
        dto.setId(survey.getId().toString());
        dto.setName(survey.getName());
        return dto;
    }
}
