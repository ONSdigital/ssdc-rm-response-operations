package uk.gov.ons.ssdc.responseoperations.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class UserIdentityInterceptor implements HandlerInterceptor {
  private final UserIdentity userIdentity;

  public UserIdentityInterceptor(UserIdentity userIdentity) {
    this.userIdentity = userIdentity;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    String jwtToken = request.getHeader("x-goog-iap-jwt-assertion");
    String userEmail = userIdentity.getUserEmail(jwtToken);
    request.setAttribute("userEmail", userEmail);
    return true;
  }
}
