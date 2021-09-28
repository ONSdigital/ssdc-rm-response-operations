package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.List;
import java.util.stream.Collectors;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.common.model.entity.PrintTemplate;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.config.PrintSupplierConfig;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.PrintTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.PrintTemplateErrorsDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.PrintTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@RestController
@RequestMapping(value = "/api/printtemplates")
public class PrintTemplateEndpoint {
  private final PrintTemplateRepository printTemplateRepository;
  private final UserIdentity userIdentity;
  private final PrintSupplierConfig printSupplierConfig;

  public PrintTemplateEndpoint(
      PrintTemplateRepository printTemplateRepository,
      UserIdentity userIdentity,
      PrintSupplierConfig printSupplierConfig) {
    this.printTemplateRepository = printTemplateRepository;
    this.userIdentity = userIdentity;
    this.printSupplierConfig = printSupplierConfig;
  }

  @GetMapping
  public List<PrintTemplateDto> getPrintTemplates(
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    userIdentity.checkGlobalUserPermission(
        userEmail, UserGroupAuthorisedActivityType.LIST_PRINT_TEMPLATES);

    List<PrintTemplate> printTemplates = printTemplateRepository.findAll();
    return printTemplates.stream().map(this::mapPrintTemplates).collect(Collectors.toList());
  }

  @PostMapping
  public ResponseEntity createPrintTemplate(
      @RequestBody PrintTemplateDto printTemplateDto,
      @Value("#{request.getAttribute('userEmail')}") String userEmail) {
    userIdentity.checkGlobalUserPermission(
        userEmail, UserGroupAuthorisedActivityType.CREATE_PRINT_TEMPLATE);

    PrintTemplateErrorsDto printTemplateErrorsDto = getPrintTemplateErrorsDto(printTemplateDto);

    if (printTemplateErrorsDto.isValidationError()) {
      return new ResponseEntity<>(printTemplateErrorsDto, HttpStatus.BAD_REQUEST);
    }

    PrintTemplate printTemplate = new PrintTemplate();
    printTemplate.setPackCode(printTemplateDto.getPackCode());
    printTemplate.setTemplate(printTemplateDto.getTemplate());
    printTemplate.setPrintSupplier(printTemplateDto.getPrintSupplier());

    printTemplateRepository.saveAndFlush(printTemplate);

    return new ResponseEntity(HttpStatus.CREATED);
  }

  private PrintTemplateErrorsDto getPrintTemplateErrorsDto(PrintTemplateDto printTemplateDto) {
    PrintTemplateErrorsDto printTemplateErrorsDto = new PrintTemplateErrorsDto();

    printTemplateErrorsDto.setPackCodeErrors(checkPackCodeValid(printTemplateDto.getPackCode()));
    printTemplateErrorsDto.setTemplateErrors(checkTemplateIsValid(printTemplateDto.getTemplate()));
    printTemplateErrorsDto.setSupplierErrors(
        checkPrintSupplierValid(printTemplateDto.getPrintSupplier()));

    return printTemplateErrorsDto;
  }

  private String checkPackCodeValid(String packCode) {
    if (StringUtils.isBlank(packCode)) {
      return "PackCode cannot be empty or blank";
    }

    if (printTemplateRepository.findAll().stream()
        .anyMatch(printTemplate -> printTemplate.getPackCode().equals(packCode))) {
      return "PackCode " + packCode + " is already in use";
    }

    return null;
  }

  private String checkTemplateIsValid(String[] template) {
    if (template == null || template.length == 0) {
      return "Template must have at least one column";
    }

    for (String column : template) {
      if (StringUtils.isBlank(column)) {
        return "Template cannot have empty columns";
      }
    }

    return null;
  }

  private String checkPrintSupplierValid(String printSupplier) {
    if (!printSupplierConfig.getPrintSuppliers().contains(printSupplier)) {
      return "Print supplier unknown: " + printSupplier;
    }

    return null;
  }

  private PrintTemplateDto mapPrintTemplates(PrintTemplate printTemplate) {
    PrintTemplateDto dto = new PrintTemplateDto();
    dto.setPackCode(printTemplate.getPackCode());
    dto.setTemplate(printTemplate.getTemplate());
    dto.setPrintSupplier(printTemplate.getPrintSupplier());

    return dto;
  }
}
