package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
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
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.SurveyDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.SurveyRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@RestController
@RequestMapping(value = "/api/surveys")
public class SurveyEndpoint {
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

  @PostMapping
  public ResponseEntity createSurvey(
      @RequestBody SurveyDto survey,
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    userIdentity.checkGlobalUserPermission(
        userEmail, UserGroupAuthorisedActivityType.CREATE_SURVEY);

    Survey newSurvey = new Survey();
    newSurvey.setId(UUID.randomUUID());
    newSurvey.setName(survey.getName());
    newSurvey.setSampleSeparator(',');
    newSurvey.setSampleValidationRules("{}"); // TODO: this needs to be replaced with real rules
    surveyRepository.saveAndFlush(newSurvey);
    return new ResponseEntity(HttpStatus.CREATED);
  }

  private SurveyDto mapSurvey(Survey survey) {
    SurveyDto dto = new SurveyDto();
    dto.setId(survey.getId().toString());
    dto.setName(survey.getName());
    return dto;
  }
}
