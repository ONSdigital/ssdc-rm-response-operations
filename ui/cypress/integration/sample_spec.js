
describe('My First Test', () => {
    it('Clicks On Create Survey', () => {
        // Navigates to url
        cy.visit('http://localhost:7777/createsurvey')

        // Get Unique survey name, to test for later
        var surveyName = "Cypress Test" + new Date().toString();

        // Find the textInput by ID and enter the survey Name
        cy.get("#createSurveyTextInput").type(surveyName);
        // click on the label for Social Survey
        cy.get("#SOCIAL-label").click();

        // find and click button to submit form
        cy.get("#createSurveySubmitBtn").click();


        // We should now have navigated back to the survey page
        // Check the new Url contains at least this:
        cy.url().should('include', '/surveys?flashMessageUntil');
        // The text for new survey should be displayed
        cy.contains("New survey has been created");

        // does our new survey exist in the list,  and can we click on it - to display the new Survey 
        cy.contains(surveyName).click();

        // We should have navigated to the View Survey Page
        cy.url().should('include', 'viewSurvey?surveyId=');

        // Does the page say View Survey?
        cy.contains('View Survey');

        // And does it display the survey name?
        cy.contains("Survey name: " + surveyName);
    })
})