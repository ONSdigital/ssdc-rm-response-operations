package uk.gov.ons.ssdc.responseoperations.endpoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.gov.ons.ssdc.responseoperations.test_utils.JsonHelper.asJsonString;

import java.util.List;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.PrintTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.entity.PrintTemplate;
import uk.gov.ons.ssdc.responseoperations.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.model.repository.PrintTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class PrintTemplateEndpointTest {

  @Mock private PrintTemplateRepository printTemplateRepository;

  @Mock private UserIdentity userIdentity;

  @InjectMocks private PrintTemplateEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetPrintfileTemplates() throws Exception {

    // Given
    PrintTemplate printTemplate = new PrintTemplate();
    printTemplate.setPackCode("packCode1");
    printTemplate.setTemplate(new String[] {"a", "b", "c"});
    printTemplate.setPrintSupplier("printyMcPrinter");

    when(printTemplateRepository.findAll()).thenReturn(List.of(printTemplate));

    // When
    mockMvc
        .perform(get("/api/printtemplates").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("getPrintTemplates"))
        .andExpect(jsonPath("$[0].packCode", is(printTemplate.getPackCode())))
        .andExpect(jsonPath("$[0].template").value(Matchers.containsInAnyOrder("a", "b", "c")))
        .andExpect(jsonPath("$[0].printSupplier", is(printTemplate.getPrintSupplier())));

    // Then
    verify(userIdentity)
        .checkGlobalUserPermission(
            anyString(), eq(UserGroupAuthorisedActivityType.LIST_PRINT_TEMPLATES));
  }

  @Test
  public void testCreatePrintTemplate() throws Exception {

    ReflectionTestUtils.setField(
        underTest,
        "printSupplierConfig",
        "{\"SUPPLIER_A\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\": \"bar\"},\"SUPPLIER_B\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\":\"bar\"}}");

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("packCode1");
    printTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/printtemplates", printTemplateDto)
                .content(asJsonString(printTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("createPrintTemplate"));

    ArgumentCaptor<PrintTemplate> printTemplateArgumentCaptor =
        ArgumentCaptor.forClass(PrintTemplate.class);
    verify(printTemplateRepository).saveAndFlush(printTemplateArgumentCaptor.capture());
    assertThat(printTemplateArgumentCaptor.getValue().getPackCode())
        .isEqualTo(printTemplateDto.getPackCode());
    assertThat(printTemplateArgumentCaptor.getValue().getTemplate())
        .isEqualTo(printTemplateDto.getTemplate());
    assertThat(printTemplateArgumentCaptor.getValue().getPrintSupplier())
        .isEqualTo(printTemplateDto.getPrintSupplier());
  }

  @Test
  public void testThatEmptyPackCodeIsRejected() throws Exception {
    ReflectionTestUtils.setField(
        underTest,
        "printSupplierConfig",
        "{\"SUPPLIER_A\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\": \"bar\"},\"SUPPLIER_B\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\":\"bar\"}}");

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("");
    printTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/printtemplates", printTemplateDto)
                .content(asJsonString(printTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("createPrintTemplate"))
        .andExpect(
            result ->
                assertThat("400 BAD_REQUEST \"PackCode cannot be empty or blank\"")
                    .isEqualTo(result.getResolvedException().getMessage()));
  }

  @Test
  public void testThatNoneUniquePackCodeIsRejected() throws Exception {
    ReflectionTestUtils.setField(
        underTest,
        "printSupplierConfig",
        "{\"SUPPLIER_A\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\": \"bar\"},\"SUPPLIER_B\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\":\"bar\"}}");

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("PackCodeA");
    printTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    PrintTemplate printTemplate = new PrintTemplate();
    printTemplate.setPackCode("PackCodeA");
    printTemplate.setTemplate(new String[] {"a", "b", "c"});
    printTemplate.setPrintSupplier("printyMcPrinter");
    when(printTemplateRepository.findAll()).thenReturn(List.of(printTemplate));

    mockMvc
        .perform(
            post("/api/printtemplates", printTemplateDto)
                .content(asJsonString(printTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("createPrintTemplate"))
        .andExpect(
            result ->
                assertThat("400 BAD_REQUEST \"PackCode PackCodeA is already in use\"")
                    .isEqualTo(result.getResolvedException().getMessage()));
  }

  @Test
  public void testCreatePrintTemplateFailsWithInvalidPrintSupplier() throws Exception {

    ReflectionTestUtils.setField(
        underTest,
        "printSupplierConfig",
        "{\"SUPPLIER_A\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\": \"bar\"},\"SUPPLIER_B\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\":\"bar\"}}");

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("packCode1");
    printTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    printTemplateDto.setPrintSupplier("BAD_PRINT_SUPPLIERR");

    mockMvc
        .perform(
            post("/api/printtemplates", printTemplateDto)
                .content(asJsonString(printTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("createPrintTemplate"))
        .andExpect(
            result ->
                assertThat("400 BAD_REQUEST \"Print supplier unknown: BAD_PRINT_SUPPLIERR\"")
                    .isEqualTo(result.getResolvedException().getMessage()));
  }

  @Test
  public void testEmptyTemplateThrowsError() throws Exception {
    ReflectionTestUtils.setField(
        underTest,
        "printSupplierConfig",
        "{\"SUPPLIER_A\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\": \"bar\"},\"SUPPLIER_B\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\":\"bar\"}}");

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("packCode1");
    printTemplateDto.setTemplate(null);
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/printtemplates", printTemplateDto)
                .content(asJsonString(printTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("createPrintTemplate"))
        .andExpect(
            result ->
                assertThat("400 BAD_REQUEST \"Template must have at least one column\"")
                    .isEqualTo(result.getResolvedException().getMessage()));
  }

  @Test
  public void testEmptyColumnInTemplateThrowsError() throws Exception {
    ReflectionTestUtils.setField(
        underTest,
        "printSupplierConfig",
        "{\"SUPPLIER_A\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\": \"bar\"},\"SUPPLIER_B\":{\"sftpDirectory\":\"foo\",\"encryptionKeyFilename\":\"bar\"}}");

    PrintTemplateDto printTemplateDto = new PrintTemplateDto();
    printTemplateDto.setPackCode("packCode1");
    printTemplateDto.setTemplate(new String[] {"a", "", "c"});
    printTemplateDto.setPrintSupplier("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/printtemplates", printTemplateDto)
                .content(asJsonString(printTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(PrintTemplateEndpoint.class))
        .andExpect(handler().methodName("createPrintTemplate"))
        .andExpect(
            result ->
                assertThat("400 BAD_REQUEST \"Template cannot have empty columns\"")
                    .isEqualTo(result.getResolvedException().getMessage()));
  }
}
