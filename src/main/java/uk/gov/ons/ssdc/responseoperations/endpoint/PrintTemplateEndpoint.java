package uk.gov.ons.ssdc.responseoperations.endpoint;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.PrintTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.entity.PrintTemplate;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.repository.PrintTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;
import utility.ObjectMapperFactory;

@RestController
@RequestMapping(value = "/api/printtemplates")
public class PrintTemplateEndpoint {
  public static final ObjectMapper OBJECT_MAPPER = ObjectMapperFactory.objectMapper();
  private final PrintTemplateRepository printTemplateRepository;
  private final UserIdentity userIdentity;

  @Value("${printsupplierconfig}")
  private String printSupplierConfig;

  public PrintTemplateEndpoint(
      PrintTemplateRepository printTemplateRepository, UserIdentity userIdentity) {
    this.printTemplateRepository = printTemplateRepository;
    this.userIdentity = userIdentity;
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

    if (!checkPrintSupplierValid(printTemplateDto.getPrintSupplier())) {
      return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    PrintTemplate printTemplate = new PrintTemplate();
    printTemplate.setPackCode(printTemplateDto.getPackCode());
    printTemplate.setTemplate(printTemplateDto.getTemplate());
    printTemplate.setPrintSupplier(printTemplateDto.getPrintSupplier());

    printTemplateRepository.saveAndFlush(printTemplate);

    return new ResponseEntity(HttpStatus.CREATED);
  }

  private boolean checkPrintSupplierValid(String printSupplier) {
    Map printSupplierMap = null;

    try {
      printSupplierMap = OBJECT_MAPPER.readValue(printSupplierConfig, Map.class);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    return printSupplierMap.containsKey(printSupplier);
  }

  private PrintTemplateDto mapPrintTemplates(PrintTemplate printTemplate) {
    PrintTemplateDto dto = new PrintTemplateDto();
    dto.setPackCode(printTemplate.getPackCode());
    dto.setTemplate(printTemplate.getTemplate());
    dto.setPrintSupplier(printTemplate.getPrintSupplier());

    return dto;
  }
}
