package uk.gov.ons.ssdc.responseoperations.endpoint;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/whoami")
public class WhoAmIEndpoint {
  @GetMapping
  public Map<String, String> getWhoIAm(@RequestAttribute("userEmail") String userEmail) {
    return Map.of("user", userEmail);
  }
}
