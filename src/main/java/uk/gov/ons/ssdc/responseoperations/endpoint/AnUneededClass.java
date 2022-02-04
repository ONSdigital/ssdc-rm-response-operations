package uk.gov.ons.ssdc.responseoperations.endpoint;

public class AnUneededClass {
  private String blah;

  // PMD gets this
  private void setSomething(String a) {

    // PMD gets this
    int b = Integer.parseInt(a);
  }

  public void setAThing(String a) {
    int b = Integer.parseInt(a);

    // errorProne spots these at least
    String.format("abc %s, what no variable passed? and result ignored");
    String.format("variables but no holders", b, a);

    return; // pointless
  }
}
