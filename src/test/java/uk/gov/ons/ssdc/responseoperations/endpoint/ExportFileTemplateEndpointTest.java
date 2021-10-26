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
import java.util.Set;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.ons.ssdc.common.model.entity.ExportFileTemplate;
import uk.gov.ons.ssdc.common.model.entity.UserGroupAuthorisedActivityType;
import uk.gov.ons.ssdc.responseoperations.config.ExportFileDestinationConfig;
import uk.gov.ons.ssdc.responseoperations.model.dto.ui.ExportFileTemplateDto;
import uk.gov.ons.ssdc.responseoperations.model.repository.ExportFileTemplateRepository;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;

@ExtendWith(MockitoExtension.class)
class ExportFileTemplateEndpointTest {

  @Mock private ExportFileTemplateRepository exportFileTemplateRepository;

  @Mock private UserIdentity userIdentity;

  @Mock private ExportFileDestinationConfig exportFileDestinationConfig;

  @InjectMocks private ExportFileTemplateEndpoint underTest;

  private MockMvc mockMvc;

  @BeforeEach
  public void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(underTest).build();
  }

  @Test
  public void testGetPrintfileTemplates() throws Exception {

    // Given
    ExportFileTemplate printTemplate = new ExportFileTemplate();
    printTemplate.setPackCode("packCode1");
    printTemplate.setTemplate(new String[] {"a", "b", "c"});
    printTemplate.setExportFileDestination("printyMcPrinter");

    when(exportFileTemplateRepository.findAll()).thenReturn(List.of(printTemplate));

    // When
    mockMvc
        .perform(get("/api/exportfiletemplates").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("getExportFileTemplates"))
        .andExpect(jsonPath("$[0].packCode", is(printTemplate.getPackCode())))
        .andExpect(jsonPath("$[0].template").value(Matchers.containsInAnyOrder("a", "b", "c")))
        .andExpect(
            jsonPath("$[0].exportFileDestination", is(printTemplate.getExportFileDestination())));

    // Then
    verify(userIdentity)
        .checkGlobalUserPermission(
            anyString(), eq(UserGroupAuthorisedActivityType.LIST_EXPORT_FILE_TEMPLATES));
  }

  @Test
  public void testCreatePrintTemplate() throws Exception {
    when(exportFileDestinationConfig.getExportFileDestinations()).thenReturn(Set.of("SUPPLIER_A"));

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("packCode1");
    exportFileTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/exportfiletemplates", exportFileTemplateDto)
                .content(asJsonString(exportFileTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("createExportFileTemplate"));

    ArgumentCaptor<ExportFileTemplate> printTemplateArgumentCaptor =
        ArgumentCaptor.forClass(ExportFileTemplate.class);
    verify(exportFileTemplateRepository).saveAndFlush(printTemplateArgumentCaptor.capture());
    assertThat(printTemplateArgumentCaptor.getValue().getPackCode())
        .isEqualTo(exportFileTemplateDto.getPackCode());
    assertThat(printTemplateArgumentCaptor.getValue().getTemplate())
        .isEqualTo(exportFileTemplateDto.getTemplate());
    assertThat(printTemplateArgumentCaptor.getValue().getExportFileDestination())
        .isEqualTo(exportFileTemplateDto.getExportFileDestination());
  }

  @Test
  public void testThatEmptyPackCodeIsRejected() throws Exception {
    when(exportFileDestinationConfig.getExportFileDestinations()).thenReturn(Set.of("SUPPLIER_A"));

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("");
    exportFileTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/exportfiletemplates", exportFileTemplateDto)
                .content(asJsonString(exportFileTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("createExportFileTemplate"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .isEqualTo(
                        "{\"packCodeErrors\":\"PackCode cannot be empty or blank\",\"templateErrors\":null,\"destinationErrors\":null,\"validationError\":true}"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }

  @Test
  public void testThatNoneUniquePackCodeIsRejected() throws Exception {
    when(exportFileDestinationConfig.getExportFileDestinations()).thenReturn(Set.of("SUPPLIER_A"));

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("PackCodeA");
    exportFileTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    ExportFileTemplate printTemplate = new ExportFileTemplate();
    printTemplate.setPackCode("PackCodeA");
    printTemplate.setTemplate(new String[] {"a", "b", "c"});
    printTemplate.setExportFileDestination("printyMcPrinter");
    when(exportFileTemplateRepository.findAll()).thenReturn(List.of(printTemplate));

    mockMvc
        .perform(
            post("/api/exportfiletemplates", exportFileTemplateDto)
                .content(asJsonString(exportFileTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("createExportFileTemplate"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .isEqualTo(
                        "{\"packCodeErrors\":\"PackCode PackCodeA is already in use\",\"templateErrors\":null,\"destinationErrors\":null,\"validationError\":true}"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }

  @Test
  public void testCreatePrintTemplateFailsWithInvalidexportFileDestination() throws Exception {
    //
    // when(exportFileDestinationConfig.getexportFileDestinations()).thenReturn(Set.of("SUPPLIER_A"));

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("packCode1");
    exportFileTemplateDto.setTemplate(new String[] {"a", "b", "c"});
    exportFileTemplateDto.setExportFileDestination("BAD_PRINT_SUPPLIER");

    mockMvc
        .perform(
            post("/api/exportfiletemplates", exportFileTemplateDto)
                .content(asJsonString(exportFileTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("createExportFileTemplate"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .isEqualTo(
                        "{\"packCodeErrors\":null,\"templateErrors\":null,\"destinationErrors\":\"Export File Destination unknown: BAD_PRINT_SUPPLIER\",\"validationError\":true}"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }

  @Test
  public void testEmptyTemplateThrowsError() throws Exception {
    when(exportFileDestinationConfig.getExportFileDestinations()).thenReturn(Set.of("SUPPLIER_A"));

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("packCode1");
    exportFileTemplateDto.setTemplate(null);
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/exportfiletemplates", exportFileTemplateDto)
                .content(asJsonString(exportFileTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("createExportFileTemplate"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .isEqualTo(
                        "{\"packCodeErrors\":null,\"templateErrors\":\"Template must have at least one column\",\"destinationErrors\":null,\"validationError\":true}"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }

  @Test
  public void testEmptyColumnInTemplateThrowsError() throws Exception {
    when(exportFileDestinationConfig.getExportFileDestinations()).thenReturn(Set.of("SUPPLIER_A"));

    ExportFileTemplateDto exportFileTemplateDto = new ExportFileTemplateDto();
    exportFileTemplateDto.setPackCode("packCode1");
    exportFileTemplateDto.setTemplate(new String[] {"a", "", "c"});
    exportFileTemplateDto.setExportFileDestination("SUPPLIER_A");

    mockMvc
        .perform(
            post("/api/exportfiletemplates", exportFileTemplateDto)
                .content(asJsonString(exportFileTemplateDto))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is4xxClientError())
        .andExpect(handler().handlerType(ExportFileTemplateEndpoint.class))
        .andExpect(handler().methodName("createExportFileTemplate"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .isEqualTo(
                        "{\"packCodeErrors\":null,\"templateErrors\":\"Template cannot have empty columns\",\"destinationErrors\":null,\"validationError\":true}"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value()));
  }
}
