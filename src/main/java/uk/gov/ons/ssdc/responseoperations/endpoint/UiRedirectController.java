package uk.gov.ons.ssdc.responseoperations.endpoint;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UiRedirectController {
  // This forwards any request for something other than /api back to the root, so that React works
  @GetMapping(value = "{_:^(?!index\\.html|api).*$}")
  public String forward() {
    return "forward:/";
  }
}
