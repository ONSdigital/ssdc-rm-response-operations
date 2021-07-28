package uk.gov.ons.ssdc.responseoperations.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentity;
import uk.gov.ons.ssdc.responseoperations.security.UserIdentityInterceptor;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
  private final UserIdentity userIdentity;

  public WebMvcConfig(UserIdentity userIdentity) {
    this.userIdentity = userIdentity;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new UserIdentityInterceptor(userIdentity));
  }
}
