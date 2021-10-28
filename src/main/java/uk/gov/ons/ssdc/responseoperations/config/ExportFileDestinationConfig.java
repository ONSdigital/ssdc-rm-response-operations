package uk.gov.ons.ssdc.responseoperations.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import utility.ObjectMapperFactory;

@Configuration
public class ExportFileDestinationConfig {
  private static final ObjectMapper OBJECT_MAPPER = ObjectMapperFactory.objectMapper();

  private Set<String> exportFileDestinations = null;

  @Value("${exportfiledestinationconfigfile}")
  private String configFile;

  public Set<String> getExportFileDestinations() {
    if (exportFileDestinations != null) {
      return exportFileDestinations;
    }

    try (InputStream configFileStream = new FileInputStream(configFile)) {
      Map map = OBJECT_MAPPER.readValue(configFileStream, Map.class);
      exportFileDestinations = map.keySet();
      return exportFileDestinations;
    } catch (JsonProcessingException | FileNotFoundException e) {
      throw new RuntimeException(e);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}
