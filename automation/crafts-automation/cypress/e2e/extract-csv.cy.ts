import { getCurrentDateParams } from "@utils/dateUtils";

/**
 * Test suite for extracting CSV files from the application.
 */
describe("Extract CSV", () => {
  beforeEach(() => {
    // Clear session storage, local storage, and cookies before each test
    cy.clearAllSessionStorage();
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/"); // Visit the base URL of the application
  });

  Cypress.on("uncaught:exception", (err: Error, runnable: Mocha.Runnable) => {
    // Prevent the test from failing on uncaught exceptions
    return false;
  });

  it("Extract csv files", () => {
    // Retrieve username and password from environment variables
    const USERNAME = Cypress.env("username");
    const PASSWORD = Cypress.env("password");
    // Get current date parameters for navigation
    const { monthIndex, monthName, year } = getCurrentDateParams();

    // Perform login and navigate to the attendance page
    cy.login(USERNAME, PASSWORD);
    cy.navigateToAttendancePage();
    cy.traverseDate(monthIndex, monthName, year);
  });
});
