package uk.gov.ons.ssdc.responseoperations.config;

import com.godaddy.logging.LoggingConfigs;
import java.util.TimeZone;
import javax.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class AppConfig {

  @PostConstruct
  public void init() {
    LoggingConfigs.setCurrent(LoggingConfigs.getCurrent().useJson());
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
  }
}
