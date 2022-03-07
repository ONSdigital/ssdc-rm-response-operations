package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.common.model.entity.ExportFileTemplate;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.config.ExportFileDestinationConfig;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.ExportFileTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.ExportFileTemplateErrorsDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.ExportFileTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@RestController
@RequestMapping(value = "/api/exportfiletemplates")
public class ExportFileTemplateEndpoint {
  private final ExportFileTemplateRepository exportFileTemplateRepository;
  private final UserIdentity userIdentity;
  private final ExportFileDestinationConfig exportFileDestinationConfig;

  public ExportFileTemplateEndpoint(
      ExportFileTemplateRepository exportFileTemplateRepository,
      UserIdentity userIdentity,
      ExportFileDestinationConfig exportFileDestinationConfig) {
    this.exportFileTemplateRepository = exportFileTemplateRepository;
    this.userIdentity = userIdentity;
    this.exportFileDestinationConfig = exportFileDestinationConfig;
  }

  @GetMapping
  public List<ExportFileTemplateDto> getExportFileTemplates(
      @RequestAttribute("userEmail") String userEmail) {
    userIdentity.checkGlobalUserPermission(
        userEmail, UserGroupAuthorisedActivityType.LIST_EXPORT_FILE_TEMPLATES);

    List<ExportFileTemplate> exportFileTemplates = exportFileTemplateRepository.findAll();
    return exportFileTemplates.stream()
        .map(this::mapExportFileTemplates)
        .collect(Collectors.toList());
  }

  @PostMapping
  public ResponseEntity createExportFileTemplate(
      @RequestBody ExportFileTemplateDto exportFileTemplateDto,
      @RequestAttribute("userEmail") String userEmail) {
    userIdentity.checkGlobalUserPermission(
        userEmail, UserGroupAuthorisedActivityType.CREATE_EXPORT_FILE_TEMPLATE);

    ExportFileTemplateErrorsDto exportFileTemplateErrorsDto =
        getExportFileTemplateErrorsDto(exportFileTemplateDto);

    if (exportFileTemplateErrorsDto.isValidationError()) {
      return new ResponseEntity<>(exportFileTemplateErrorsDto, HttpStatus.BAD_REQUEST);
    }

    ExportFileTemplate exportFileTemplate = new ExportFileTemplate();
    exportFileTemplate.setPackCode(exportFileTemplateDto.getPackCode());
    exportFileTemplate.setTemplate(exportFileTemplateDto.getTemplate());
    exportFileTemplate.setExportFileDestination(exportFileTemplateDto.getExportFileDestination());
    exportFileTemplate.setDescription(exportFileTemplateDto.getDescription());

    exportFileTemplateRepository.saveAndFlush(exportFileTemplate);

    return new ResponseEntity(HttpStatus.CREATED);
  }

  private ExportFileTemplateErrorsDto getExportFileTemplateErrorsDto(
      ExportFileTemplateDto exportFileTemplateDto) {
    ExportFileTemplateErrorsDto exportFileTemplateErrorsDto = new ExportFileTemplateErrorsDto();

    exportFileTemplateErrorsDto.setPackCodeErrors(
        checkPackCodeValid(exportFileTemplateDto.getPackCode()));
    exportFileTemplateErrorsDto.setTemplateErrors(
        checkTemplateIsValid(exportFileTemplateDto.getTemplate()));
    exportFileTemplateErrorsDto.setDestinationErrors(
        checkExportFileDestinationValid(exportFileTemplateDto.getExportFileDestination()));

    return exportFileTemplateErrorsDto;
  }

  private Optional<String> checkPackCodeValid(String packCode) {
    if (StringUtils.isBlank(packCode)) {
      return Optional.of("PackCode cannot be empty or blank");
    }

    if (exportFileTemplateRepository.findAll().stream()
        .anyMatch(exportFileTemplate -> exportFileTemplate.getPackCode().equals(packCode))) {
      return Optional.of("PackCode " + packCode + " is already in use");
    }

    return Optional.empty();
  }

  private Optional<String> checkTemplateIsValid(String[] template) {
    if (template == null || template.length == 0) {
      return Optional.of("Template must have at least one column");
    }

    for (String column : template) {
      if (StringUtils.isBlank(column)) {
        return Optional.of("Template cannot have empty columns");
      }
    }

    Set<String> templateSet = new HashSet<>(Arrays.asList(template));
    if (templateSet.size() != template.length) {
      return Optional.of("Template cannot have duplicate columns");
    }

    return Optional.empty();
  }

  private Optional<String> checkExportFileDestinationValid(String exportFileDestination) {
    if (!exportFileDestinationConfig.getExportFileDestinations().contains(exportFileDestination)) {
      return Optional.of("Export File Destination unknown: " + exportFileDestination);
    }

    return Optional.empty();
  }

  private ExportFileTemplateDto mapExportFileTemplates(ExportFileTemplate exportFileTemplate) {
    ExportFileTemplateDto dto = new ExportFileTemplateDto();
    dto.setPackCode(exportFileTemplate.getPackCode());
    dto.setDescription(exportFileTemplate.getDescription());
    dto.setTemplate(exportFileTemplate.getTemplate());
    dto.setExportFileDestination(exportFileTemplate.getExportFileDestination());
    dto.setMetadata(exportFileTemplate.getMetadata());

    return dto;
  }
}
