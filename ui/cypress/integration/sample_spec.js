
describe('My First Test', () => {
    it('Clicks On Create Survey', () => {
        cy.visit('http://localhost:7777/createsurvey')

        // Get Random Name, or attach date time
        var surveyName = "Cypress Test" + new Date().toString();

        cy.get("#createSurveyTextInput").type(surveyName);
        cy.get("#SOCIAL-label").click();


        // Create the survey
        cy.get("#createSurveySubmitBtn").click();


        // We should now have navigated back to the survey page
        cy.url().should('include', '/surveys?flashMessageUntil');
        cy.contains("New survey has been created");

        // does our new survey exist in the list,  and can we click on it - to display the new Survey 
        cy.contains(surveyName).click();

        cy.url().should('include', 'viewSurvey?surveyId=');

        cy.contains('View Survey');

        cy.contains("Survey name: " + surveyName);
    })
})